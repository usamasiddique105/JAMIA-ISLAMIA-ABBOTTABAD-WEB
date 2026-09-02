import React, { useState, useEffect } from 'react';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { SEOHead } from './components/SEOHead';
import { INITIAL_SITE_SETTINGS } from './data/initialData';

// Direct eager imports for instant 0ms page switching without any loading delay or spinner
import { FatwaSection } from './components/FatwaSection';
import { FatwaSubmissionModal } from './components/FatwaSubmissionModal';
import { ExamResultsView } from './components/ExamResultsView';
import { DonationView } from './components/DonationView';
import { LibraryView } from './components/LibraryView';
import { AboutJamiaView } from './components/AboutJamiaView';
import { AcademicDepartmentsView } from './components/AcademicDepartmentsView';
import { FacultyView } from './components/FacultyView';
import { NewsEventsView } from './components/NewsEventsView';
import { ContactFAQView } from './components/ContactFAQView';
import { OnlineServicesView } from './components/OnlineServicesView';
import { AskScholarView } from './components/AskScholarView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CmsPageView } from './components/CmsPageView';
import { trackSiteVisit } from './services/visitorTracker';

import { 
  BookOpen, 
  GraduationCap, 
  Heart, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Users, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Search,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

function parseCurrentTab(): string {
  if (typeof window === 'undefined') return 'home';
  let path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim().toLowerCase();
  const hash = window.location.hash.replace('#', '').trim();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');

  if (path === 'admin-login' || hash === 'admin-login' || hash === 'admin' || path === 'admin') return 'admin';
  if (tabParam) return tabParam;

  // Handle language prefixes: /en, /ar, /ur
  if (path === 'en' || path === 'ar' || path === 'ur') return 'home';
  if (path.startsWith('en/')) {
    path = path.substring(3).trim();
  } else if (path.startsWith('ar/')) {
    path = path.substring(3).trim();
  } else if (path.startsWith('ur/')) {
    path = path.substring(3).trim();
  }

  // Handle fatwa specific deep paths e.g. /fatwa/123 or /en/fatwa/123
  if (path.startsWith('fatwa/')) {
    return 'fatwas';
  }

  if (path && path !== 'index.html') {
    return path;
  }
  return hash || 'home';
}

function MainApp() {
  const { t, language } = useThemeLanguage();
  const [currentTab, setCurrentTab] = useState(() => parseCurrentTab());
  const [searchOpen, setSearchOpen] = useState(false);
  const [fatwaModalOpen, setFatwaModalOpen] = useState(false);

  // Sync state with URL changes & support back/forward browser navigation and /admin-login
  useEffect(() => {
    const handleRouteCheck = () => {
      const newTab = parseCurrentTab();
      if (newTab !== currentTab) {
        setCurrentTab(newTab);
      }
    };

    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, [currentTab]);

  // Silently record real visitor traffic
  useEffect(() => {
    if (currentTab !== 'admin') {
      trackSiteVisit(currentTab);
    }
  }, [currentTab]);

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    const pathname = window.location.pathname.toLowerCase();
    
    // If user is currently browsing English clean URL routes
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      const targetUrl = newTab === 'home' ? '/en' : `/en/${newTab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    } 
    // If user is currently browsing Arabic clean URL routes
    else if (pathname === '/ar' || pathname.startsWith('/ar/')) {
      const targetUrl = newTab === 'home' ? '/ar' : `/ar/${newTab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    } 
    // Default Urdu / standard navigation
    else {
      if (window.location.hash.replace('#', '') !== newTab) {
        window.history.pushState(null, '', `#${newTab}`);
      }
    }
  };

  return (
    <div className={`w-full max-w-full min-h-screen overflow-x-clip ${currentTab === 'home' ? 'bg-islamic-pattern' : 'bg-white dark:bg-slate-950'} text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#064e3b] selection:text-white`}>
      {/* Dynamic SEO Head Manager */}
      <SEOHead currentTab={currentTab} />
      
      {/* Sticky Header with Navigation */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenFatwaModal={() => setFatwaModalOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-10 pb-16 sm:pb-8">
        {/* TAB 1: HOMEPAGE */}
        {currentTab === 'home' && (
          <HeroSection 
            setCurrentTab={handleTabChange}
            onOpenFatwaModal={() => setFatwaModalOpen(true)}
          />
        )}

        {/* TAB 2: ABOUT & SUB-SECTIONS */}
        {(currentTab === 'about' || currentTab.startsWith('about-')) && (
          <AboutJamiaView 
            activeTabId={currentTab} 
            onSelectTab={(tabId) => handleTabChange(tabId)} 
          />
        )}

        {/* TAB 3: ACADEMIC DEPARTMENTS */}
        {currentTab === 'departments' && <AcademicDepartmentsView />}

        {/* TAB 4: FACULTY */}
        {currentTab === 'faculty' && <FacultyView />}

        {/* TAB 5: DARUL IFTA & FATWAS */}
        {(currentTab === 'fatwas' || currentTab.startsWith('fatwa-')) && (
          <FatwaSection 
            activeTabId={currentTab}
            onSelectTab={(tab) => handleTabChange(tab)}
            onOpenFatwaModal={() => setFatwaModalOpen(true)} 
          />
        )}

        {/* TAB 6: EXAM RESULTS PORTAL */}
        {currentTab === 'results' && <ExamResultsView />}

        {/* TAB 7: DIGITAL LIBRARY & MEDIA */}
        {currentTab === 'library' && (
          <LibraryView 
            activeTabId={currentTab} 
            onSelectTab={(tab) => handleTabChange(tab)} 
          />
        )}
        {currentTab === 'media' && (
          <LibraryView 
            activeTabId={currentTab} 
            onSelectTab={(tab) => handleTabChange(tab)} 
          />
        )}

        {/* TAB 8: NEWS & EVENTS */}
        {currentTab === 'news' && <NewsEventsView />}

        {/* TAB 9: DONATIONS & ZAKAT */}
        {(currentTab === 'donations' || currentTab === 'online-taawun' || currentTab === 'taawun') && (
          <DonationView setCurrentTab={handleTabChange} />
        )}

        {/* TAB 10: CONTACT & FAQS */}
        {currentTab === 'contact' && <ContactFAQView />}
        {currentTab === 'faq' && <ContactFAQView />}

        {/* TAB 11: ONLINE ACADEMY & SERVICES */}
        {currentTab === 'ask-scholar' && (
          <AskScholarView onBackToServices={() => handleTabChange('online-services')} />
        )}

        {((currentTab === 'online-services' || currentTab.startsWith('online-')) && currentTab !== 'online-taawun') && (
          <OnlineServicesView 
            activeSubTab={currentTab}
            onSelectSubTab={(subTab) => handleTabChange(subTab)}
            onOpenFatwaModal={() => setFatwaModalOpen(true)}
            setCurrentTab={handleTabChange}
          />
        )}

        {/* TAB 12: COMPLETE CMS ADMIN DASHBOARD */}
        {currentTab === 'admin' && <AdminDashboard />}

        {/* DYNAMIC CMS PAGES (e.g. #page-admissions, #page-rules, or published custom pages) */}
        {(!['home', 'departments', 'faculty', 'results', 'library', 'media', 'news', 'donations', 'online-taawun', 'taawun', 'contact', 'faq', 'ask-scholar', 'admin'].includes(currentTab) &&
          !currentTab.startsWith('about') &&
          !currentTab.startsWith('fatwa') &&
          !currentTab.startsWith('online-')) && (
          <CmsPageView 
            slug={currentTab.startsWith('page-') || currentTab.startsWith('page/') ? currentTab.replace(/^page[-/]/, '') : currentTab} 
            onNavigate={handleTabChange} 
          />
        )}
      </main>

      {/* Floating WhatsApp Action Button with Direct Online Admission / Trial Inquiry */}
      <a 
        href="https://wa.me/923489002496?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%21%20%D9%85%D9%8A%DA%BA%20%D8%AC%D8%A7%D9%85%D8%B9%D9%87%20%D8%A7%D8%B3%D9%84%D8%A7%D9%85%D9%8A%D9%87%20%D8%A7%D9%8A%D8%A8%D9%8F%D9%B9%20%D8%A2%D8%A8%D8%A7%D8%AF%20%D9%85%D9%8A%DA%BA%20%D8%A2%D9%86%20%D9%84%D8%A7%D8%A6%D9%86%20%28%D9%82%D8%B1%D8%A2%D9%86%20%DA%A9%D8%B1%D9%8A%D9%85%20%2F%20%D8%B9%D8%B1%D8%A8%D9%8A%20%D8%B2%D8%A8%D8%A7%D9%86%20%2F%20%D8%AF%D8%B1%D8%B3%20%D9%86%D8%B8%D8%A7%D9%85%D9%8A%29%20%DA%A9%D9%88%D8%B1%D8%B3%20%D9%85%D9%8A%DA%BA%20%DB%B3%20%D8%B1%D9%88%D8%B2%DB%81%20%D9%81%D8%B1%D9%8A%20%D9%B9%D8%B1%D8%A7%D8%A6%D9%84%20%D8%A7%D9%88%D8%B1%20%D8%AF%D8%A7%D8%AE%D9%84%DB%81%20%DA%A9%DB%8C%20%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%DA%86%D8%A7%DB%81%D8%AA%D8%A7%20%DB%81%D9%88%DA%BA%DB%94" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact Jamia Islamia Abbottabad on WhatsApp for Online Admission"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 cursor-pointer group"
        title="آن لائن کلاسز و داخلہ کے لیے واٹس ایپ پر رابطہ کریں"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
      </a>

      {/* Global Modals */}
      {searchOpen && (
        <GlobalSearchModal 
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={(tab) => handleTabChange(tab)}
        />
      )}

      {fatwaModalOpen && (
        <FatwaSubmissionModal 
          isOpen={fatwaModalOpen}
          onClose={() => setFatwaModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer 
        setCurrentTab={handleTabChange}
        onOpenFatwaModal={() => setFatwaModalOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeLanguageProvider>
      <MainApp />
    </ThemeLanguageProvider>
  );
}
