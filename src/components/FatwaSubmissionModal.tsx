import React, { useState } from 'react';
import { FatwaCategory, OnlineQuestion } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notificationService';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Send, Sparkles, CheckCircle2, Shield, Lock, MessageCircle, Mail } from 'lucide-react';

interface FatwaSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: FatwaCategory[] = [
  'Tahara & Cleansing',
  'Namaz & Prayer',
  'Zakat & Charity',
  'Roza & Fasting',
  'Nikah & Talaq',
  'Business & Trade',
  'Modern Issues & Tech',
  'Social & Ethics',
  'General Fiqh'
];

export const FatwaSubmissionModal: React.FC<FatwaSubmissionModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useThemeLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<FatwaCategory>('General Fiqh');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState<OnlineQuestion | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !question.trim()) return;

    setIsSubmitting(true);
    const newQuestion: OnlineQuestion = {
      id: `q-${Date.now()}`,
      questionerName: name,
      questionerEmail: email,
      phone: phone || undefined,
      category,
      subject: subject || 'سوال برائے دار الافتاء',
      question: `${question}\n\n[تفصیلاتِ سائِل: پتہ/شہر: ${address || 'غیر درج'}, فون: ${phone || 'غیر درج'}]`,
      submissionDate: new Date().toISOString().split('T')[0],
      isAnswered: false
    };

    StorageService.addQuestion(newQuestion);
    setSubmittedQuestion(newQuestion);

    try {
      const res = await NotificationService.sendFatwaQuestionNotification(newQuestion);
      setWhatsappUrl(res.whatsappUrl);
    } catch (err) {
      console.error('Notification dispatch error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setSubject('');
    setQuestion('');
    setSubmitted(false);
    setSubmittedQuestion(null);
    setWhatsappUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl max-w-lg w-full border border-[#D5C7B2] dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-urdu relative z-10" dir={language === 'en' ? 'ltr' : 'rtl'}>
        
        {/* Header */}
        <div className="bg-[#3C2E21] dark:bg-slate-950 text-amber-100 p-3.5 px-4 sm:px-5 flex items-center justify-between border-b border-[#B88A3B]/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#5C4632] rounded-md text-[#B88A3B]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100 leading-tight">دار الافتاء - آن لائن فتویٰ</h3>
              <p className="text-[11px] text-amber-200/70">جامعہ اسلامیہ ایبٹ آباد، پاکستان</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md bg-[#5C4632] text-amber-200 hover:bg-[#6e543d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-right">
          {submitted ? (
            <div className="text-center py-5 space-y-4 font-urdu">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#3C2E21] dark:text-amber-100">
                  آپ کا شرعی سوال دار الافتاء کو موصول ہو گیا ہے!
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
                  مفتیانِ کرام جلد از جلد آپ کے سوال کا شرعی جائزہ لے کر بذریعہ ای میل جواب فراہم کریں گے۔
                </p>
              </div>

              {submittedQuestion && (
                <div className="bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 rounded-xl p-3 text-xs text-right space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between items-center text-[11px] pb-1 border-b border-amber-200/60 dark:border-slate-700">
                    <span className="text-stone-500 dark:text-stone-400">سوال کا ٹکٹ نمبر:</span>
                    <span className="font-mono font-bold text-[#0B5D3B] dark:text-emerald-400">{submittedQuestion.id}</span>
                  </div>
                  <div className="text-stone-700 dark:text-stone-300">
                    <span className="font-bold">سائل:</span> {submittedQuestion.questionerName} ({submittedQuestion.questionerEmail})
                  </div>
                  <div className="text-stone-700 dark:text-stone-300">
                    <span className="font-bold">موضوع:</span> {submittedQuestion.subject}
                  </div>
                </div>
              )}

              {/* Direct Instant Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                {whatsappUrl && (
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واٹس ایپ پر فوری نقل بھیجیں</span>
                  </a>
                )}

                <button 
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#0B5D3B] hover:bg-[#08482D] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  مکمل کریں (بند کریں)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نام (سائل کا نام) *
                  </label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اپنا مکمل نام درج کریں..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] text-right font-urdu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ای میل (Email) *
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] text-left font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    موبائل / واٹس ایپ نمبر
                  </label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    شہر / سکونت
                  </label>
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثلاً: ایبٹ آباد، مانسہرہ..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] text-right font-urdu"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  شرعی زمرہ بندی *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FatwaCategory)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] font-urdu font-medium text-right"
                >
                  <option value="Tahara & Cleansing">طہارت و وضو</option>
                  <option value="Namaz & Prayer">نماز و عبادات</option>
                  <option value="Zakat & Charity">زکوۃ، صدقات و مالیات</option>
                  <option value="Roza & Fasting">روزہ و روزمرہ مسائل</option>
                  <option value="Nikah & Talaq">نکاح، طلاق و خلع</option>
                  <option value="Business & Trade">تجارت و بیوع</option>
                  <option value="Modern Issues & Tech">جدید مسائل و ٹیکنالوجی</option>
                  <option value="Social & Ethics">اخلاقیات و معاشرت</option>
                  <option value="General Fiqh">متفرق شرعی مسائل</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  عنوان / موضوعِ سوال
                </label>
                <input 
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="سوال کا مختصر عنوان..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] text-right font-urdu"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  تفصیلی شرعی سوال *
                </label>
                <textarea 
                  rows={3}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اپنا شرعی سوال تمام تر ضروری تفصیلات کے ساتھ تحریر فرمائیں..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800 focus:outline-none focus:border-[#0B5D3B] font-urdu leading-relaxed text-right resize-none"
                ></textarea>
              </div>

              <div className="bg-[#FAF7F0] dark:bg-slate-800/80 p-2.5 rounded-lg border border-[#D5C7B2] dark:border-slate-700 text-[11px] text-stone-600 dark:text-stone-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#0B5D3B] shrink-0" />
                <span>آپ کا سوال مکمل راز داری میں رکھا جائے گا اور مفتیانِ کرام خود جائزہ لیں گے۔</span>
              </div>

              <div className="pt-2 flex justify-end items-center gap-2.5">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#0B5D3B] hover:bg-[#08482D] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>اپنا سوال جمع کریں</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
