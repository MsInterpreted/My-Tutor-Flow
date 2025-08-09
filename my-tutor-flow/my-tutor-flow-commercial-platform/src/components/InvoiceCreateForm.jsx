import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const createInvoice = async invoiceData => {
  // invoiceData should match the structure in Step A
  await addDoc(collection(db, 'invoices'), invoiceData);
};
