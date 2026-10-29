import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import axios from "axios";
import MangaReleaseCalendar from "./pages/MangaReleaseCalendar/MangaReleaseCalendar";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import ForumHome from "./pages/forum/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import MyComponent from "./utils/projectapi";
import Landing from "./pages/home/Landing";
import RegisterComponent from "./pages/credentials/RegisterComponent";
import AvatarComponent from "./pages/ProfileCard/avatar";
import LoginComponent from "./pages/credentials/LoginComponent";
import DetailsPage from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/DetailsPage";
import ProjectPage from "./pages/ProfileCard/TabComponent/ProjectComponent/ProjectPage";
import DemoProjectPage from "./components/carousel/DemoProject";
import Notification from "./components/Notification/Notification";
import ForgotPassword from "./pages/credentials/ForgotPassword";
import PostDetail from "./pages/forum/PostDetail";
import CreatePost from "./pages/forum/CreatePost";
import Viewer from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/Viewer";
import SettingsPage from "./pages/setting/Setting";
import BlankPage from "./pages/ProfileCard/TabComponent/ProjectComponent/DetailsPage/blank";
import Checkout from "./components/checkout/Checkout";
import About from "./components/footer/about";
import FAQ from "./components/footer/faq";
import TermsOfUse from "./components/footer/TermsOfUse";

import "./App.scss";
import { initGA } from "./Analytics";
import AnalyticsTracker from "./components/AnalyticsTracker";
import PrivacyPolicy from "./components/footer/privacy_policy";
import RefundPolicy from "./components/footer/RefundPolicy";
import ContactUs from "./components/footer/ContactUs";
import NewsList from "./pages/News/NewsList";
import NewsDetail from "./pages/News/NewsDetail";
import CreateNews from "./pages/News/CreateNews";
import NotificationBell from "./components/Notification/Notification";
import GamificationDashboard from "./components/Chart/gamification/GamificationDashboard";
import TavernBot from "./components/TavernBot/TavernBot";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import PaymentDashboard from "./pages/PaymentDashboard/PaymentDashboard";
import MyLibrary from "./pages/MyLibrary/MyLibrary";
import NotificationPrompt from "./components/NotificationPrompt/NotificationPrompt";
import ScheduleAnnouncementBar from "./components/ScheduleAnnouncementBar/ScheduleAnnouncementBar";
import GoogleOneTapPrompt from "./components/GoogleOneTap/GoogleOneTapPrompt";
import WebtoonSlicer from "./pages/Tools/WebtoonSlicer";
import Features from "./pages/Features/Features";
import Pricing from "./pages/Pricing/Pricing";

function App() {
  const dispatch = useDispatch();
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdLocalStorage;
  const { url } = useSelector((state) => state.home);

  const location = useLocation();

  // ✅ Define this BEFORE using it below
  const hideFooterPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard",
    "/profile",
    "/my-library",
    "/payment-dashboard",
    "/settings",
    "/checkout",
    "/forum/create-post",
    "/add-news"
  ];

  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));
  const isViewerPage = location.pathname.startsWith("/viewer");
  const shouldHideChatbot = isViewerPage;

  useEffect(() => {
    initGA();
  }, []);

  // 🌍 Smart Amazon Geo-Router & Affiliate Tag Injector:
  // Routes India -> amazon.in (zealplane-21), International -> amazon.com (zealplane-20)
  // Ensures ALL Amazon links (Kindle novel cards, manga volumes, gaming products) carry the active tag
  useEffect(() => {
    const handleAmazonClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor || !anchor.href) return;

      try {
        const urlObj = new URL(anchor.href);
        const host = urlObj.hostname.toLowerCase();

        if (host.includes("amazon.in") || host.includes("amazon.com") || host.includes("amzn.to")) {
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
          const isIndia =
            userTimezone.includes("Calcutta") ||
            userTimezone.includes("Kolkata") ||
            navigator.language === "en-IN" ||
            navigator.language === "hi";

          const targetTag = isIndia ? "zealplane-21" : "zealplane-20";
          const targetHost = isIndia ? "www.amazon.in" : "www.amazon.com";

          if (host.includes("amazon.")) {
            urlObj.hostname = targetHost;
          }

          // Ensure regional affiliate tag is attached
          urlObj.searchParams.set("tag", targetTag);
          anchor.href = urlObj.toString();
        }
      } catch (err) {
        // Fallback for edge cases
        const href = anchor.href;
        if (href.includes("amazon.in") || href.includes("amazon.com")) {
          const isIndia =
            (Intl.DateTimeFormat().resolvedOptions().timeZone || "").includes("Calcutta") ||
            navigator.language === "en-IN";
          const tag = isIndia ? "zealplane-21" : "zealplane-20";
          const domain = isIndia ? "amazon.in" : "amazon.com";
          let cleanHref = href.replace(/amazon\.(com|in)/g, domain);
          if (cleanHref.includes("tag=")) {
            cleanHref = cleanHref.replace(/tag=[^&]+/g, `tag=${tag}`);
          } else {
            cleanHref += (cleanHref.includes("?") ? "&" : "?") + `tag=${tag}`;
          }
          anchor.href = cleanHref;
        }
      }
    };

    document.addEventListener("click", handleAmazonClick, { capture: true });
    return () => document.removeEventListener("click", handleAmazonClick, { capture: true });
  }, []);

  return (
    <div>
      {/* 📅 Top Schedule Announcement Bar */}
      <ScheduleAnnouncementBar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/viewer/:projectSlug" element={<Viewer />} />
          <Route path="/blank" element={<BlankPage />} />
          <Route path="/home/notification" element={<NotificationBell />} />
          <Route path="/details/:projectId" element={<DetailsPage />} />
          <Route path="/home/:id" element={<DemoProjectPage />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forum" element={<ForumHome />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/forum/create-post" element={<CreatePost />} />
          <Route path="/profile/:id" element={<AvatarComponent />} />
          <Route path="/p" element={<MyComponent />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/dashboard" element={<GamificationDashboard />} />
          <Route path="/payment-dashboard" element={<PaymentDashboard />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/terms-of-service" element={<TermsOfUse />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/dmca" element={<TermsOfUse />} />
          <Route path="/dmca-policy" element={<TermsOfUse />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/add-news" element={<CreateNews />} />
          <Route path="/manga-release-calendar" element={<MangaReleaseCalendar />} />
          <Route path="/anime-schedule" element={<Navigate to="/manga-release-calendar" replace />} />
          <Route path="/release-calendar" element={<Navigate to="/manga-release-calendar" replace />} />

          {/* ✂️ ZealPlane Creator Studio Tools */}
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/tools/webtoon-slicer" element={<WebtoonSlicer />} />
          <Route path="/tools/comic-slicer" element={<Navigate to="/tools/webtoon-slicer" replace />} />
          <Route path="/tools/croppy-alternative" element={<Navigate to="/tools/webtoon-slicer" replace />} />
          <Route path="/webtoon-slicer" element={<Navigate to="/tools/webtoon-slicer" replace />} />

          {/* 404 Fallback Catch-All */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {!shouldHideChatbot && <TavernBot />}

      {/* 🌐 Global Floating Vernacular Language Selector */}
      {!isViewerPage && <LanguageSwitcher variant="floating" />}

      {/* 🔔 Browser Web Push Notification Prompt disabled to prevent intrusive popups */}
      {/* {!isViewerPage && <NotificationPrompt />} */}

      {/* 📖 Continue Reading Banner removed per user request */}
      {/* {!isViewerPage && <ContinueReadingBanner />} */}

      {/* ✅ Uncomment this when ready */}
      {/* {!shouldHideFooter && <Footer />} */}
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
