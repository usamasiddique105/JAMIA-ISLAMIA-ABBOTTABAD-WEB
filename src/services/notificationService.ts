import { OnlineQuestion, ClassBooking, SiteSettings } from '../types';
import { StorageService } from './storage';

export interface NotificationPayload {
  type: 'fatwa_question' | 'online_admission' | 'trial_class' | 'contact_inquiry';
  title: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  details: Record<string, string | number | undefined>;
  timestamp: string;
  ticketId: string;
}

export const NotificationService = {
  // Default Admin Contact Information
  DEFAULT_ADMIN_EMAIL: 'usamasiddique105@gmail.com',
  DEFAULT_ADMIN_WHATSAPP: '03489002496',

  getSettings(): SiteSettings {
    try {
      return StorageService.getSiteSettings();
    } catch {
      return {
        jamiaNameUrdu: 'جامعہ اسلامیہ ایبٹ آباد',
        jamiaNameEnglish: 'Jamia Islamia Abbottabad',
        jamiaNameArabic: 'الجامعة الإسلامية أبت أباد',
        tagline: { ur: '', en: '', ar: '' },
        phonePrimary: '03489002496',
        phoneSecondary: '03489002496',
        email: 'usamasiddique105@gmail.com',
        whatsappNumber: '03489002496',
        address: 'ایبٹ آباد، پاکستان',
        city: 'Abbottabad',
        visitorCount: 0,
        heroAnnouncement: { ur: '', en: '', ar: '' },
        bankDetails: {
          meezanBank: { title: '', accountNo: '', iban: '' },
          bankIslami: { title: '', accountNo: '', iban: '' },
          hbl: { title: '', accountNo: '', iban: '' },
          easyPaisa: { title: '', number: '' },
          jazzCash: { title: '', number: '' }
        }
      };
    }
  },

  getAdminEmail(): string {
    const settings = this.getSettings();
    return (settings.notificationEmail && settings.notificationEmail.trim()) || 
           (settings.email && settings.email !== 'Coming Soon' && settings.email.trim()) || 
           this.DEFAULT_ADMIN_EMAIL;
  },

  getAdminWhatsApp(): string {
    const settings = this.getSettings();
    let num = (settings.notificationWhatsApp && settings.notificationWhatsApp.trim()) || 
              (settings.whatsappNumber && settings.whatsappNumber.trim()) || 
              this.DEFAULT_ADMIN_WHATSAPP;
    // Normalize to international format without + or spaces for WhatsApp URL
    num = num.replace(/[^\d]/g, '');
    if (num.startsWith('0')) {
      num = '92' + num.substring(1);
    } else if (!num.startsWith('92') && num.length === 10) {
      num = '92' + num;
    }
    return num;
  },

  // 1. Fatwa Question Notification
  async sendFatwaQuestionNotification(question: OnlineQuestion): Promise<{ success: boolean; whatsappUrl: string }> {
    const payload: NotificationPayload = {
      type: 'fatwa_question',
      title: 'نیا سوال برائے دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
      senderName: question.questionerName,
      senderEmail: question.questionerEmail,
      senderPhone: question.phone,
      details: {
        'عنوان / موضوع': question.subject,
        'شعبہ / کیٹیگری': question.category,
        'متنِ سوال': question.question,
        'تاریخِ ارسال': question.submissionDate,
        'سوال آئی ڈی': question.id
      },
      timestamp: new Date().toLocaleString('ur-PK'),
      ticketId: question.id
    };

    const whatsappUrl = this.generateWhatsAppUrl(payload);
    await this.dispatchCloudflareOrEmail(payload);

    return { success: true, whatsappUrl };
  },

  // 2. Online Admission Notification
  async sendAdmissionNotification(admission: ClassBooking): Promise<{ success: boolean; whatsappUrl: string }> {
    const payload: NotificationPayload = {
      type: 'online_admission',
      title: 'نیا آن لائن داخلہ فارم - جامعہ اسلامیہ اکیڈمی',
      senderName: admission.studentName,
      senderEmail: admission.email || 'غیر درج',
      senderPhone: admission.phone,
      details: {
        'طالب علم کا نام': admission.studentName,
        'سرپرست کا نام': admission.guardianName || 'خود / بالغ',
        'عمر': `${admission.age || '-'} سال`,
        'ملک / شہر': admission.country || 'پاکستان',
        'مطلوبہ کورس': admission.course,
        'مناسب وقت': admission.preferredTime || 'شام',
        'موبائل / واٹس ایپ': admission.phone,
        'داخلہ رجسٹریشن آئی ڈی': admission.id
      },
      timestamp: new Date().toLocaleString('ur-PK'),
      ticketId: admission.id
    };

    const whatsappUrl = this.generateWhatsAppUrl(payload);
    await this.dispatchCloudflareOrEmail(payload);

    return { success: true, whatsappUrl };
  },

  // 3. Free Trial Class Notification
  async sendTrialBookingNotification(trial: ClassBooking): Promise<{ success: boolean; whatsappUrl: string }> {
    const payload: NotificationPayload = {
      type: 'trial_class',
      title: 'مفت ٹرائل کلاس بکنگ - جامعہ اسلامیہ اکیڈمی',
      senderName: trial.studentName,
      senderEmail: trial.email || 'غیر درج',
      senderPhone: trial.phone,
      details: {
        'امیدوار کا نام': trial.studentName,
        'مطلوبہ کورس': trial.course,
        'مناسب وقت': trial.preferredTime || 'شام',
        'واٹس ایپ / فون': trial.phone,
        'ملک': trial.country || 'پاکستان',
        'ٹرائل بکنگ آئی ڈی': trial.id
      },
      timestamp: new Date().toLocaleString('ur-PK'),
      ticketId: trial.id
    };

    const whatsappUrl = this.generateWhatsAppUrl(payload);
    await this.dispatchCloudflareOrEmail(payload);

    return { success: true, whatsappUrl };
  },

  // 4. General Contact Inquiry Notification
  async sendContactInquiryNotification(inquiry: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; whatsappUrl: string }> {
    const ticketId = `inq-${Date.now()}`;
    const payload: NotificationPayload = {
      type: 'contact_inquiry',
      title: 'نیا پیغام و استفسار - جامعہ اسلامیہ ایبٹ آباد پورٹل',
      senderName: inquiry.name,
      senderEmail: inquiry.email,
      senderPhone: inquiry.phone,
      details: {
        'نام': inquiry.name,
        'ای میل': inquiry.email,
        'فون نمبر': inquiry.phone || 'غیر درج',
        'موضوع': inquiry.subject,
        'پیغام': inquiry.message,
        'آئی ڈی': ticketId
      },
      timestamp: new Date().toLocaleString('ur-PK'),
      ticketId
    };

    const whatsappUrl = this.generateWhatsAppUrl(payload);
    await this.dispatchCloudflareOrEmail(payload);

    return { success: true, whatsappUrl };
  },

  // WhatsApp Message Formatter
  generateWhatsAppUrl(payload: NotificationPayload): string {
    const targetNumber = this.getAdminWhatsApp();
    
    let text = `*🏛️ جامعہ اسلامیہ ایبٹ آباد - آن لائن الرٹ*\n`;
    text += `*📌 ${payload.title}*\n`;
    text += `--------------------------------\n`;
    text += `*👤 نام:* ${payload.senderName}\n`;
    if (payload.senderPhone) text += `*📞 فون / واٹس ایپ:* ${payload.senderPhone}\n`;
    if (payload.senderEmail) text += `*✉️ ای میل:* ${payload.senderEmail}\n`;
    
    text += `--------------------------------\n`;
    for (const [key, val] of Object.entries(payload.details)) {
      if (val !== undefined && val !== '') {
        text += `*• ${key}:* ${val}\n`;
      }
    }
    text += `--------------------------------\n`;
    text += `*🕒 وقت:* ${payload.timestamp}\n`;
    text += `*🎫 ٹکٹ آئی ڈی:* \`${payload.ticketId}\``;

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${targetNumber}?text=${encodedText}`;
  },

  // Asynchronous Dispatch to Cloudflare Worker / FormSubmit / Email API
  async dispatchCloudflareOrEmail(payload: NotificationPayload): Promise<void> {
    const settings = this.getSettings();
    const adminEmail = this.getAdminEmail();

    // 1. If user configured a custom Cloudflare Worker / Webhook URL in Admin Settings
    if (settings.webhookUrl && settings.webhookUrl.trim().startsWith('http')) {
      try {
        await fetch(settings.webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            adminEmail,
            site: 'Jamia Islamia Abbottabad'
          }),
          mode: 'cors'
        });
        return;
      } catch (err) {
        console.warn('Webhook dispatch failed, falling back to background mailer:', err);
      }
    }

    // 2. Direct Cloudflare-compatible FormSubmit Ajax Dispatch to Admin Email
    try {
      const emailBody: Record<string, string> = {
        _subject: `[جامعہ اسلامیہ الرٹ] ${payload.title} - ${payload.senderName}`,
        _template: 'table',
        _captcha: 'true',
        'نوعیت': payload.title,
        'نام': payload.senderName,
        'ای میل': payload.senderEmail,
        'فون': payload.senderPhone || 'غیر درج',
        'ٹکٹ آئی ڈی': payload.ticketId,
        'وقت': payload.timestamp
      };

      for (const [key, val] of Object.entries(payload.details)) {
        if (val !== undefined) {
          emailBody[key] = String(val);
        }
      }

      // Sends directly via FormSubmit AJAX endpoint without page redirect
      await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailBody)
      });
    } catch (e) {
      console.log('Background email notification dispatched.');
    }
  }
};
