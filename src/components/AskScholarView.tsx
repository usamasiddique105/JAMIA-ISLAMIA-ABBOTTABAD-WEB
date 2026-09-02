import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { StorageService } from '../services/storage';
import { OnlineQuestion } from '../types';
import { ReCaptcha } from './common/ReCaptcha';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  Lock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare,
  Globe,
  FileText,
  UserCheck
} from 'lucide-react';

interface AskScholarViewProps {
  onBackToServices?: () => void;
}

export const AskScholarView: React.FC<AskScholarViewProps> = ({ onBackToServices }) => {
  const { darkMode, language } = useThemeLanguage();

  // Active form vs tracker toggle
  const [activeTab, setActiveTab] = useState<'ask' | 'track'>('ask');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    phone: '',
    category: 'General Fiqh',
    subject: '',
    question: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<OnlineQuestion | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Question Tracking State
  const [trackNumberInput, setTrackNumberInput] = useState('');
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackedQuestion, setTrackedQuestion] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string>('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = [
    { value: 'General Fiqh', label: 'General Fiqh & Daily Life (عمومی مسائل و عبادات)' },
    { value: 'Tahara & Cleansing', label: 'Purification & Taharah (طہارت و وضو)' },
    { value: 'Namaz & Prayer', label: 'Salah & Prayer Times (نماز و اوقات)' },
    { value: 'Roza & Fasting', label: 'Fasting & Ramadan (روزہ، اعتکاف و فدیہ)' },
    { value: 'Zakat & Charity', label: 'Zakat, Sadaqah & Waqf (زکوٰۃ، صدقات و وقف)' },
    { value: 'Nikah & Talaq', label: 'Marriage, Family & Divorce (نکاح، طلاق و خلع)' },
    { value: 'Business & Trade', label: 'Business, Trade & Islamic Finance (بیوع، تجارت و مالیات)' },
    { value: 'Modern Issues & Tech', label: 'Modern Tech, Crypto & Medical Ethics (جدید ٹیکنالوجی و طب)' },
    { value: 'ایمانیات و عقائد', label: 'Aqeedah & Islamic Beliefs (ایمانیات و عقائد)' },
    { value: 'Social & Ethics', label: 'Social Ethics & Rights (اخلاقیات و حقوق العباد)' },
    { value: 'متفرقات', label: 'Miscellaneous Matters (متفرقات)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email address so the scholar can send your written fatwa.');
      return;
    }
    if (!formData.subject.trim()) {
      setFormError('Please enter a brief subject/title for your question.');
      return;
    }
    if (!formData.question.trim() || formData.question.trim().length < 15) {
      setFormError('Please write your question clearly with sufficient context (at least 15 characters).');
      return;
    }
    if (!captchaToken) {
      setFormError('Please complete the security verification (reCAPTCHA) below.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedTracking = `JIA-Q-${Date.now().toString().slice(-6)}`;
      const newQ: OnlineQuestion = {
        id: `q-en-${Date.now()}`,
        trackingNumber: generatedTracking,
        questionerName: formData.name.trim(),
        questionerEmail: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
        language: 'en',
        category: formData.category,
        subject: formData.subject.trim(),
        question: formData.question.trim(),
        submissionDate: new Date().toISOString().split('T')[0],
        isAnswered: false,
      };

      await StorageService.addQuestion(newQ, captchaToken);
      setSubmissionSuccess(newQ);
      setFormData({
        name: '',
        email: '',
        country: '',
        city: '',
        phone: '',
        category: 'General Fiqh',
        subject: '',
        question: '',
      });
      setCaptchaToken(null);
    } catch (err: any) {
      console.error('Question submission error:', err);
      setFormError(err.message || 'Failed to submit question to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackNumberInput.trim();
    if (!query) return;

    setIsSearchingTrack(true);
    setTrackError('');
    setTrackedQuestion(null);

    try {
      const res = await fetch(`/api/questions?trackingNumber=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.data) {
        setTrackedQuestion(data.data);
      } else {
        // Fallback check in local memory storage if client-side mock
        const allQuestions = StorageService.getQuestions();
        const found = allQuestions.find(
          q => q.trackingNumber?.toLowerCase() === query.toLowerCase() || q.id === query
        );
        if (found) {
          setTrackedQuestion({
            trackingNumber: found.trackingNumber,
            category: found.category,
            status: found.isAnswered ? 'Answered' : 'Pending',
            questionText: found.question,
            answerText: found.reply || '',
            submittedAt: found.submissionDate,
            muftiName: 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد (Darul Ifta Board)',
          });
        } else {
          setTrackError('No question found for tracking ID: "' + query + '". Please check the ID and try again.');
        }
      }
    } catch {
      // Local fallback
      const allQuestions = StorageService.getQuestions();
      const found = allQuestions.find(
        q => q.trackingNumber?.toLowerCase() === query.toLowerCase() || q.id === query
      );
      if (found) {
        setTrackedQuestion({
          trackingNumber: found.trackingNumber,
          category: found.category,
          status: found.isAnswered ? 'Answered' : 'Pending',
          questionText: found.question,
          answerText: found.reply || '',
          submittedAt: found.submissionDate,
          muftiName: 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد (Darul Ifta Board)',
        });
      } else {
        setTrackError('Unable to connect to the server or question not found. Please verify your tracking number.');
      }
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const faqItems = [
    {
      q: 'How long does it take for a Mufti to review and answer my question?',
      a: 'Most standard inquiries are answered within 2 to 5 business days. Inquiries requiring detailed jurisprudential research or collective deliberation by the senior Ifta council may take slightly longer. You will receive an email notification when the answer is ready, or you can check using your Tracking Number.',
    },
    {
      q: 'Which Islamic school of thought (Madhab) does the Darul Ifta follow?',
      a: 'The Darul Ifta of Jamia Islamia Abbottabad issues rulings strictly based on the Holy Quran, the Sunnah of Prophet Muhammad ﷺ, consensus (Ijma), and traditional Hanafi jurisprudence (Fiqh al-Hanafi), drawing upon authoritative classical sources including Radd al-Muhtar (Shami), Al-Bahr al-Raiq, Al-Hidayah, and Fatawa Alamgiri.',
    },
    {
      q: 'Is my question and personal identity kept confidential?',
      a: 'Yes, absolutely. Your personal details (name, email, location) are kept strictly confidential. When a ruling is archived for public benefit, all identifying personal information is completely removed to protect privacy.',
    },
    {
      q: 'Is there any fee or charge for asking a fatwa?',
      a: 'No. All religious rulings, fatwas, and guidance provided by Jamia Islamia Abbottabad are 100% free of charge for the pleasure of Allah Ta’ala.',
    },
    {
      q: 'Can complex marital disputes or legal inheritance cases be resolved online?',
      a: 'Preliminary guidance and Sharia rulings can be provided online. However, for binding marital separations, inheritance distribution involving deeds, or cases currently before civil courts, we recommend presenting original documentation directly to the Darul Ifta board in Abbottabad.',
    },
  ];

  return (
    <div className="space-y-8 text-left font-sans" dir="ltr">
      
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-400">Online Services</span>
          <span>/</span>
          <span className="text-[#B88A3B] font-bold">Ask an Islamic Scholar (English)</span>
        </div>
        {onBackToServices && (
          <button
            onClick={onBackToServices}
            className="text-xs text-[#5C4632] dark:text-amber-300 hover:underline font-bold"
          >
            ← Return to Online Services
          </button>
        )}
      </div>

      {/* 1. INSTITUTIONAL HEADER BANNER */}
      <div 
        className="w-full border-y-2 border-[#B88A3B] px-4 sm:px-8 py-6 shadow-xs rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          backgroundColor: '#F8F4EC',
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(248, 244, 236, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 7.5L7.5 30 30 52.5 52.5 30 30 7.5z'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5C4632] text-amber-200 rounded-full text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Darul Ifta • Jamia Islamia Abbottabad (Est. 1951)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#3E2514] tracking-tight font-serif">
            Ask an Islamic Scholar & Mufti Online
          </h1>
          <p className="text-sm text-stone-700 leading-relaxed pt-1">
            Submit your religious, theological, and jurisprudential inquiries in English to certified scholars and Muftis of Jamia Islamia Abbottabad. Receive authentic, verified Sharia guidance referenced in accordance with the Holy Quran, Sunnah, and classical Hanafi jurisprudence.
          </p>
        </div>

        {/* Action Toggle Switcher */}
        <div className="shrink-0 flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-[#B88A3B]/40 shadow-xs">
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ask'
                ? 'bg-[#5C4632] text-amber-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#5C4632]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Question</span>
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-[#5C4632] text-amber-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#5C4632]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Fatwa Status</span>
          </button>
        </div>
      </div>

      {/* 2. INSTITUTIONAL STANDARDS BAR (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-stone-200 dark:border-slate-700 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-700 text-[#B88A3B] shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-xs">Certified Muftis</h2>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">Rulings reviewed by scholars specializing in *Takhassus fil Ifta*.</p>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-stone-200 dark:border-slate-700 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-700 text-[#B88A3B] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-xs">Classical Hanafi Fiqh</h2>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">Grounded in Quran, Hadith, and authentic jurisprudential references.</p>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-stone-200 dark:border-slate-700 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-700 text-[#B88A3B] shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-xs">Strict Confidentiality</h2>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">Your personal identity and sensitive situations remain confidential.</p>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-stone-200 dark:border-slate-700 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-700 text-[#B88A3B] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900 dark:text-stone-100 text-xs">Free & Prompt Service</h2>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">100% free Sharia service with dedicated tracking numbers.</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION (SUBMISSION FORM OR TRACKER) */}
      {activeTab === 'ask' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#B88A3B]/40 p-5 sm:p-8 shadow-sm space-y-6">
          
          {submissionSuccess ? (
            /* SUCCESS CONFIRMATION PANEL */
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                  Question Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  JazakAllahu Khairan. Your question has been securely transmitted to the scholars at Darul Ifta Jamia Islamia Abbottabad.
                </p>
              </div>

              {/* Tracking ID Badge */}
              <div className="bg-amber-50 dark:bg-slate-800 border-2 border-[#B88A3B] rounded-2xl p-5 max-w-md mx-auto space-y-3">
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider block font-bold">
                  Your Official Tracking ID
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-black font-mono text-[#5C4632] dark:text-amber-300 tracking-wider">
                    {submissionSuccess.trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(submissionSuccess.trackingNumber || '')}
                    className="p-2 bg-white dark:bg-slate-700 hover:bg-stone-100 rounded-lg border border-stone-300 dark:border-slate-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy Tracking ID"
                  >
                    {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                    <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Save this tracking ID. You can enter it on this page at any time to verify the progress and view your answer once published.
                </p>
              </div>

              {/* Follow-up Details Summary */}
              <div className="bg-stone-50 dark:bg-slate-800/60 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 border border-stone-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subject:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{submissionSuccess.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Category:</span>
                  <span className="text-stone-800 dark:text-stone-200">{submissionSuccess.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Email:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">{submissionSuccess.questionerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Submission Date:</span>
                  <span className="text-stone-800 dark:text-stone-200">{submissionSuccess.submissionDate}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmissionSuccess(null)}
                  className="px-5 py-2.5 bg-[#5C4632] hover:bg-[#453424] text-amber-100 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Submit Another Question
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackNumberInput(submissionSuccess.trackingNumber || '');
                    setActiveTab('track');
                    setSubmissionSuccess(null);
                  }}
                  className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Go to Status Tracker
                </button>
              </div>
            </div>
          ) : (
            /* SUBMISSION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
                  <span>Online Question Submission Form</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Please provide clear, accurate information so the Muftis can formulate a thorough response.
                </p>
              </div>

              {formError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Muhammad Abdullah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Email Address <span className="text-rose-600">*</span>
                    <span className="text-[10px] text-stone-400 font-normal ml-1">(Where the fatwa will be sent)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  />
                </div>

                {/* Country of Residence */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United Kingdom, United States, Pakistan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  />
                </div>

                {/* Phone / WhatsApp (Optional) */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    WhatsApp / Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 7123 456789 / +92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Subject / Topic Area <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Title / Summary */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Question Summary / Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Ruling on combining prayers during long-haul flights"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] transition-colors"
                  />
                </div>

                {/* Detailed Question Body */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Detailed Question Description <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Please explain your question in full detail with relevant background context, specific scenarios, or nuances. Avoid ambiguous or one-line queries so the Muftis can formulate an accurate, definitive ruling..."
                    className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#B88A3B] leading-relaxed transition-colors"
                  ></textarea>
                </div>
              </div>

              {/* CAPTCHA Verification */}
              <div className="p-4 bg-stone-50 dark:bg-slate-800/50 rounded-xl border border-stone-200 dark:border-slate-700 space-y-2">
                <label className="block font-bold text-xs text-stone-700 dark:text-stone-300">
                  Security Anti-Spam Verification <span className="text-rose-600">*</span>
                </label>
                <ReCaptcha 
                  onChange={(token) => setCaptchaToken(token)} 
                  theme={darkMode ? 'dark' : 'light'} 
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  By submitting, you agree to receive Sharia guidance via email and agree to our confidentiality terms.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#5C4632] hover:bg-[#433123] text-amber-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-[#B88A3B] shadow-md transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Question...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Question to Mufti</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      ) : (
        /* TRACK FATWA STATUS SECTION */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#B88A3B]/40 p-5 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#B88A3B]" />
              <span>Track Your Submitted Fatwa / Question</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Enter the unique Tracking Number provided upon submitting your question (e.g. <span className="font-mono font-bold">JIA-Q-123456</span>).
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="max-w-xl mx-auto space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={trackNumberInput}
                onChange={(e) => setTrackNumberInput(e.target.value)}
                placeholder="Enter Tracking ID (e.g. JIA-Q-891234)"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono text-sm uppercase focus:outline-hidden focus:border-[#B88A3B]"
              />
              <button
                type="submit"
                disabled={isSearchingTrack}
                className="px-6 py-3 bg-[#5C4632] hover:bg-[#433123] text-amber-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-[#B88A3B] shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSearchingTrack ? (
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Check Status</span>
              </button>
            </div>

            {trackError && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}
          </form>

          {/* TRACKED QUESTION RESULT CARD */}
          {trackedQuestion && (
            <div className="max-w-2xl mx-auto bg-stone-50 dark:bg-slate-800/80 rounded-2xl border border-stone-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] text-stone-500 block">Tracking ID:</span>
                  <span className="font-mono font-bold text-sm text-[#5C4632] dark:text-amber-300">
                    {trackedQuestion.trackingNumber}
                  </span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  trackedQuestion.status === 'Answered' || trackedQuestion.answerText
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                }`}>
                  {trackedQuestion.status === 'Answered' || trackedQuestion.answerText ? 'Answered • Fatwa Issued' : 'Under Review by Mufti'}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  Question (سائل کا سوال):
                </span>
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                  {trackedQuestion.questionText}
                </div>
              </div>

              {/* Sharia Answer (If answered) */}
              {trackedQuestion.answerText ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sharia Ruling & Fatwa (الجواب وباللہ التوفیق):</span>
                    </span>
                    {trackedQuestion.answeredAt && (
                      <span className="text-[10px] text-stone-400">Date: {trackedQuestion.answeredAt}</span>
                    )}
                  </div>
                  <div className="p-4 bg-emerald-50/80 dark:bg-slate-900 border-2 border-emerald-300/80 dark:border-emerald-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 leading-relaxed font-serif whitespace-pre-line">
                    {trackedQuestion.answerText}
                  </div>
                  <div className="text-[11px] text-stone-500 pt-1 text-right">
                    <span>{trackedQuestion.muftiName || 'مفتیانِ کرام دار الافتاء جامعہ اسلامیہ ایبٹ آباد'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-slate-900/60 rounded-xl border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Your question is currently assigned to a Mufti.</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    The research board is formulating the formal ruling. Please check back soon or watch your email for the notification.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. FREQUENTLY ASKED QUESTIONS (English Accordion) */}
      <div className="bg-[#F8F4EC] dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-6 space-y-4">
        <div className="border-b border-stone-200 dark:border-slate-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#5C4632] dark:text-amber-300">
            Frequently Asked Questions Regarding Online Fatwa & Sharia Guidance
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Essential information regarding methodology, timelines, and religious authority.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 hover:text-[#5C4632] dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#B88A3B] shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-slate-700/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
