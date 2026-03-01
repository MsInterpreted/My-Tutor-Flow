/**
 * Messaging Service for WhatsApp and WeChat Integration
 * Handles automated invoice delivery and notifications
 */

class MessagingService {
  constructor() {
    this.whatsappConfig = {
      apiUrl: 'https://graph.facebook.com/v18.0',
      phoneNumberId: process.env.REACT_APP_WHATSAPP_PHONE_NUMBER_ID,
      accessToken: process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN,
      businessAccountId: process.env.REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID,
      webhookVerifyToken: process.env.REACT_APP_WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    };

    this.weChatConfig = {
      appId: process.env.REACT_APP_WECHAT_APP_ID,
      appSecret: process.env.REACT_APP_WECHAT_APP_SECRET,
      apiUrl: 'https://api.weixin.qq.com/cgi-bin',
    };

    this.messageTemplates = {
      invoiceDelivery: {
        whatsapp: {
          name: 'invoice_delivery',
          language: { code: 'en_US' },
          components: [
            {
              type: 'header',
              parameters: [
                {
                  type: 'document',
                  document: {
                    filename: '',
                    link: '',
                  },
                },
              ],
            },
            {
              type: 'body',
              parameters: [
                { type: 'text', text: '' }, // Student name
                { type: 'text', text: '' }, // Invoice number
                { type: 'text', text: '' }, // Amount
                { type: 'text', text: '' }, // Due date
              ],
            },
          ],
        },
      },
      paymentReminder: {
        whatsapp: {
          name: 'payment_reminder',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: '' }, // Student name
                { type: 'text', text: '' }, // Amount
                { type: 'text', text: '' }, // Days overdue
              ],
            },
          ],
        },
      },
    };
  }

  /**
   * Initialize messaging service
   */
  async initialize() {
    try {
      // Verify WhatsApp Business API connection
      if (this.whatsappConfig.accessToken) {
        await this.verifyWhatsAppConnection();
      }

      // Initialize WeChat if configured
      if (this.weChatConfig.appId) {
        await this.initializeWeChat();
      }

      console.log('✅ Messaging service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize messaging service:', error);
      return false;
    }
  }

  /**
   * Verify WhatsApp Business API connection
   */
  async verifyWhatsAppConnection() {
    try {
      const response = await fetch(
        `${this.whatsappConfig.apiUrl}/${this.whatsappConfig.phoneNumberId}`,
        {
          headers: {
            Authorization: `Bearer ${this.whatsappConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API verification failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ WhatsApp Business API connected:', data.display_phone_number);
      return true;
    } catch (error) {
      console.error('❌ WhatsApp connection verification failed:', error);
      throw error;
    }
  }

  /**
   * Initialize WeChat API
   */
  async initializeWeChat() {
    try {
      // Get access token for WeChat
      const tokenResponse = await fetch(
        `${this.weChatConfig.apiUrl}/token?grant_type=client_credential&appid=${this.weChatConfig.appId}&secret=${this.weChatConfig.appSecret}`
      );

      const tokenData = await tokenResponse.json();
      if (tokenData.errcode) {
        throw new Error(`WeChat token error: ${tokenData.errmsg}`);
      }

      this.weChatConfig.accessToken = tokenData.access_token;
      console.log('✅ WeChat API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ WeChat initialization failed:', error);
      throw error;
    }
  }

  /**
   * Send invoice via WhatsApp
   */
  async sendInvoiceViaWhatsApp(phoneNumber, invoiceData, pdfUrl) {
    try {
      // Format phone number (remove + and ensure country code)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const template = this.messageTemplates.invoiceDelivery.whatsapp;

      // Update template parameters
      template.components[0].parameters[0].document.filename = `Invoice_${invoiceData.invoiceNumber}.pdf`;
      template.components[0].parameters[0].document.link = pdfUrl;

      template.components[1].parameters[0].text = invoiceData.studentName;
      template.components[1].parameters[1].text = invoiceData.invoiceNumber;
      template.components[1].parameters[2].text = this.formatCurrency(invoiceData.amount);
      template.components[1].parameters[3].text = new Date(
        invoiceData.dueDate
      ).toLocaleDateString();

      const messageData = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: template,
      };

      const response = await fetch(
        `${this.whatsappConfig.apiUrl}/${this.whatsappConfig.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.whatsappConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${result.error?.message || 'Unknown error'}`);
      }

      console.log('✅ Invoice sent via WhatsApp:', result.messages[0].id);
      return {
        success: true,
        messageId: result.messages[0].id,
        platform: 'whatsapp',
      };
    } catch (error) {
      console.error('❌ Failed to send invoice via WhatsApp:', error);
      return {
        success: false,
        error: error.message,
        platform: 'whatsapp',
      };
    }
  }

  /**
   * Send payment reminder via WhatsApp
   */
  async sendPaymentReminderViaWhatsApp(phoneNumber, reminderData) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const template = this.messageTemplates.paymentReminder.whatsapp;

      template.components[0].parameters[0].text = reminderData.studentName;
      template.components[0].parameters[1].text = this.formatCurrency(reminderData.amount);
      template.components[0].parameters[2].text = reminderData.daysOverdue.toString();

      const messageData = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: template,
      };

      const response = await fetch(
        `${this.whatsappConfig.apiUrl}/${this.whatsappConfig.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.whatsappConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${result.error?.message || 'Unknown error'}`);
      }

      console.log('✅ Payment reminder sent via WhatsApp:', result.messages[0].id);
      return {
        success: true,
        messageId: result.messages[0].id,
        platform: 'whatsapp',
      };
    } catch (error) {
      console.error('❌ Failed to send payment reminder via WhatsApp:', error);
      return {
        success: false,
        error: error.message,
        platform: 'whatsapp',
      };
    }
  }

  /**
   * Send message via WeChat (for Chinese users)
   */
  async sendMessageViaWeChat(openId, messageData) {
    try {
      if (!this.weChatConfig.accessToken) {
        await this.initializeWeChat();
      }

      const templateMessage = {
        touser: openId,
        template_id: 'your_template_id', // Configure in WeChat backend
        data: {
          first: { value: 'TD Learning Academy Invoice', color: '#173177' },
          keyword1: { value: messageData.studentName, color: '#173177' },
          keyword2: { value: messageData.invoiceNumber, color: '#173177' },
          keyword3: { value: this.formatCurrency(messageData.amount), color: '#173177' },
          keyword4: { value: new Date(messageData.dueDate).toLocaleDateString(), color: '#173177' },
          remark: { value: 'Please pay by the due date. Thank you!', color: '#173177' },
        },
      };

      const response = await fetch(
        `${this.weChatConfig.apiUrl}/message/template/send?access_token=${this.weChatConfig.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateMessage),
        }
      );

      const result = await response.json();

      if (result.errcode !== 0) {
        throw new Error(`WeChat API error: ${result.errmsg}`);
      }

      console.log('✅ Message sent via WeChat:', result.msgid);
      return {
        success: true,
        messageId: result.msgid,
        platform: 'wechat',
      };
    } catch (error) {
      console.error('❌ Failed to send message via WeChat:', error);
      return {
        success: false,
        error: error.message,
        platform: 'wechat',
      };
    }
  }

  /**
   * Send invoice to parent via preferred platform
   */
  async sendInvoiceToParent(parentContact, invoiceData, pdfUrl) {
    const results = [];

    // Determine preferred platforms based on contact info
    const platforms = this.determinePlatforms(parentContact);

    for (const platform of platforms) {
      let result;

      switch (platform) {
        case 'whatsapp':
          if (parentContact.whatsappNumber || parentContact.phone) {
            result = await this.sendInvoiceViaWhatsApp(
              parentContact.whatsappNumber || parentContact.phone,
              invoiceData,
              pdfUrl
            );
          }
          break;

        case 'wechat':
          if (parentContact.wechatOpenId) {
            result = await this.sendMessageViaWeChat(parentContact.wechatOpenId, invoiceData);
          }
          break;

        default:
          console.warn(`Unsupported platform: ${platform}`);
      }

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Determine messaging platforms based on parent contact info
   */
  determinePlatforms(parentContact) {
    const platforms = [];

    // Check for WhatsApp (phone number present)
    if (parentContact.whatsappNumber || parentContact.phone) {
      platforms.push('whatsapp');
    }

    // Check for WeChat (OpenID present)
    if (parentContact.wechatOpenId) {
      platforms.push('wechat');
    }

    // Default to WhatsApp if phone number is available
    if (platforms.length === 0 && parentContact.phone) {
      platforms.push('whatsapp');
    }

    return platforms;
  }

  /**
   * Format phone number for WhatsApp API
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let formatted = phoneNumber.replace(/\D/g, '');

    // Add country code if not present (assuming US +1 for demo)
    if (formatted.length === 10) {
      formatted = '1' + formatted;
    }

    return formatted;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Handle webhook for message status updates
   */
  async handleWebhook(webhookData) {
    try {
      if (webhookData.object === 'whatsapp_business_account') {
        for (const entry of webhookData.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              await this.processMessageStatus(change.value);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
    }
  }

  /**
   * Process message status updates
   */
  async processMessageStatus(messageData) {
    if (messageData.statuses) {
      for (const status of messageData.statuses) {
        console.log(`📱 Message ${status.id} status: ${status.status}`);

        // Update message status in database
        // This would typically update your invoice/message tracking system
        await this.updateMessageStatus(status.id, status.status);
      }
    }
  }

  /**
   * Update message status in tracking system
   */
  async updateMessageStatus(messageId, status) {
    // Implementation would depend on your database structure
    console.log(`Updating message ${messageId} status to: ${status}`);
  }

  /**
   * Get messaging statistics
   */
  async getMessagingStats() {
    // This would typically query your database for messaging statistics
    return {
      totalMessagesSent: 0,
      whatsappMessages: 0,
      wechatMessages: 0,
      deliveryRate: 0,
      responseRate: 0,
    };
  }
}

// Create singleton instance
const messagingService = new MessagingService();

export default messagingService;
