import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ==================== Refund Processing ====================

interface RefundRequest {
  paymentId: string;
  type: "full" | "partial";
  method: "provider" | "credit";
  amount: number;
  currency: string;
  reason: string;
  invoiceId?: string;
  studentId?: string;
}

export const processRefund = functions.https.onCall(
  async (data: RefundRequest, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be authenticated to process refunds."
      );
    }

    const {paymentId, type, method, amount, currency, reason, invoiceId, studentId} = data;

    if (!paymentId || !amount || amount <= 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Payment ID and valid amount are required."
      );
    }

    // Get the payment record
    const paymentDoc = await db.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Payment not found.");
    }

    const payment = paymentDoc.data()!;
    if (payment.status !== "completed") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Only completed payments can be refunded."
      );
    }

    let refundStatus = "processing";

    // Handle provider-specific refunds
    if (method === "provider") {
      if (payment.provider === "stripe" && payment.stripePaymentIntent) {
        try {
          const stripeKey = functions.config().stripe?.secret_key;
          if (stripeKey) {
            const stripe = require("stripe")(stripeKey);
            await stripe.refunds.create({
              payment_intent: payment.stripePaymentIntent,
              amount: Math.round(amount * 100), // Stripe uses cents
            });
            refundStatus = "completed";
          } else {
            refundStatus = "manual_required";
          }
        } catch (error: any) {
          console.error("Stripe refund failed:", error.message);
          throw new functions.https.HttpsError(
            "internal",
            `Stripe refund failed: ${error.message}`
          );
        }
      } else if (payment.provider === "paypal" && payment.paypalCaptureId) {
        // PayPal refund would require PayPal SDK setup
        // For now, mark as manual_required
        refundStatus = "manual_required";
      } else {
        // Other providers require manual processing
        refundStatus = "manual_required";
      }
    } else if (method === "credit" && studentId) {
      // Credit-based refund
      await db.collection("students").doc(studentId)
        .collection("credits").add({
          amount,
          currency: currency || "ZAR",
          source: "refund",
          description: reason || `Refund from payment ${paymentId}`,
          status: "active",
          paymentId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      refundStatus = "completed";
    }

    // Create refund record
    const refundRef = await db.collection("refunds").add({
      paymentId,
      invoiceId: invoiceId || payment.invoiceId || null,
      type,
      method,
      amount,
      currency: currency || payment.currency || "ZAR",
      reason: reason || "",
      status: refundStatus,
      processedBy: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update payment record
    const isFullRefund = type === "full";
    const existingRefunded = payment.refundedAmount || 0;
    await paymentDoc.ref.update({
      status: isFullRefund ? "refunded" : "partially_refunded",
      refundedAmount: existingRefunded + amount,
      lastRefundDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update invoice if linked
    const linkedInvoiceId = invoiceId || payment.invoiceId;
    if (linkedInvoiceId) {
      const invoiceDoc = await db.collection("invoices").doc(linkedInvoiceId).get();
      if (invoiceDoc.exists) {
        const invoice = invoiceDoc.data()!;
        const newPaidAmount = Math.max(0, (invoice.paidAmount || 0) - amount);
        const newStatus = newPaidAmount <= 0 ? "pending" :
          newPaidAmount >= (invoice.totalAmount || invoice.amount) ? "paid" : "partial";
        await invoiceDoc.ref.update({
          paidAmount: newPaidAmount,
          status: newStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    return {
      success: true,
      refundId: refundRef.id,
      status: refundStatus,
    };
  }
);

// Handle Stripe webhook for dashboard-initiated refunds
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const stripeKey = functions.config().stripe?.secret_key;
  const webhookSecret = functions.config().stripe?.webhook_secret;

  if (!stripeKey || !webhookSecret) {
    res.status(500).send("Stripe not configured");
    return;
  }

  const stripe = require("stripe")(stripeKey);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const paymentIntentId = charge.payment_intent;

    // Find payment by stripe payment intent
    const paymentsSnap = await db.collection("payments")
      .where("stripePaymentIntent", "==", paymentIntentId)
      .limit(1)
      .get();

    if (!paymentsSnap.empty) {
      const paymentDoc = paymentsSnap.docs[0];
      const refundAmount = charge.amount_refunded / 100;
      const isFullRefund = charge.refunded;

      // Create refund record
      await db.collection("refunds").add({
        paymentId: paymentDoc.id,
        invoiceId: paymentDoc.data().invoiceId || null,
        type: isFullRefund ? "full" : "partial",
        method: "provider",
        amount: refundAmount,
        currency: (charge.currency || "usd").toUpperCase(),
        reason: "Refund initiated from Stripe Dashboard",
        status: "completed",
        stripeRefundId: charge.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update payment
      await paymentDoc.ref.update({
        status: isFullRefund ? "refunded" : "partially_refunded",
        refundedAmount: refundAmount,
        lastRefundDate: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  res.status(200).json({received: true});
});

// ==================== Recurring Billing ====================

// Calculate next run date based on frequency
function calculateNextRunDate(
  currentDate: Date,
  frequency: string
): Date {
  const next = new Date(currentDate);
  switch (frequency) {
  case "weekly":
    next.setDate(next.getDate() + 7);
    break;
  case "biweekly":
    next.setDate(next.getDate() + 14);
    break;
  case "monthly":
    next.setMonth(next.getMonth() + 1);
    break;
  default:
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

// Scheduled function: runs daily at 06:00 to generate recurring invoices
export const generateRecurringInvoices = functions.pubsub
  .schedule("every day 06:00")
  .timeZone("Africa/Johannesburg")
  .onRun(async () => {
    const now = new Date();
    console.log(`Running recurring invoice generation at ${now.toISOString()}`);

    // Query active schedules where nextRunDate <= now
    const schedulesSnap = await db.collection("billingSchedules")
      .where("isActive", "==", true)
      .where("nextRunDate", "<=", admin.firestore.Timestamp.fromDate(now))
      .get();

    if (schedulesSnap.empty) {
      console.log("No schedules due for processing.");
      return null;
    }

    const batch = db.batch();
    let invoicesCreated = 0;

    for (const scheduleDoc of schedulesSnap.docs) {
      const schedule = scheduleDoc.data();
      const studentIds: string[] = schedule.studentIds || [];

      // Check end date
      if (schedule.endDate) {
        const endDate = schedule.endDate.toDate
          ? schedule.endDate.toDate() : new Date(schedule.endDate);
        if (now > endDate) {
          // Deactivate expired schedule
          batch.update(scheduleDoc.ref, {
            isActive: false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          continue;
        }
      }

      for (const studentId of studentIds) {
        let invoiceAmount = schedule.fixedAmount || 0;

        // If using student rates, fetch from student record
        if (schedule.amountType === "from_rates") {
          try {
            const studentDoc = await db.collection("students").doc(studentId).get();
            if (studentDoc.exists) {
              const studentData = studentDoc.data()!;
              invoiceAmount = studentData.monthlyRate ||
                studentData.hourlyRate || schedule.fixedAmount || 0;
            }
          } catch (err) {
            console.error(`Failed to fetch rate for student ${studentId}:`, err);
            invoiceAmount = schedule.fixedAmount || 0;
          }
        }

        if (invoiceAmount <= 0) continue;

        const dueDate = new Date(now);
        dueDate.setDate(
          dueDate.getDate() + (schedule.invoiceTemplate?.dueAfterDays || 30)
        );

        // Create the invoice
        const invoiceRef = db.collection("invoices").doc();
        batch.set(invoiceRef, {
          studentId,
          amount: invoiceAmount,
          totalAmount: invoiceAmount,
          currency: schedule.currency || "ZAR",
          status: "pending",
          invoiceDate: admin.firestore.Timestamp.fromDate(now),
          dueDate: admin.firestore.Timestamp.fromDate(dueDate),
          description: schedule.invoiceTemplate?.description ||
            `${schedule.name} - ${schedule.frequency} billing`,
          billingScheduleId: scheduleDoc.id,
          paidAmount: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        invoicesCreated++;
      }

      // Update schedule's nextRunDate and lastRunDate
      const nextRun = calculateNextRunDate(now, schedule.frequency);
      batch.update(scheduleDoc.ref, {
        lastRunDate: admin.firestore.Timestamp.fromDate(now),
        nextRunDate: admin.firestore.Timestamp.fromDate(nextRun),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    console.log(`Created ${invoicesCreated} recurring invoices.`);
    return null;
  });

// Optional: auto-charge an invoice using saved payment method
export const autoChargeInvoice = functions.https.onCall(
  async (data: { invoiceId: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be authenticated."
      );
    }

    const {invoiceId} = data;
    if (!invoiceId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invoice ID is required."
      );
    }

    const invoiceDoc = await db.collection("invoices").doc(invoiceId).get();
    if (!invoiceDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Invoice not found.");
    }

    const invoice = invoiceDoc.data()!;
    if (invoice.status === "paid") {
      return {success: true, message: "Invoice already paid."};
    }

    // Get payment settings
    const settingsDoc = await db.collection("settings").doc("payments").get();
    const settings = settingsDoc.exists ? settingsDoc.data() : null;

    if (!settings?.stripe?.enabled) {
      return {success: false, message: "Auto-charge requires Stripe to be configured."};
    }

    // For auto-charge we need a saved customer/payment method
    // This is a placeholder for the full Stripe Customer + PaymentMethod flow
    return {
      success: false,
      message: "Auto-charge requires saved payment methods. Please process manually.",
    };
  }
);
