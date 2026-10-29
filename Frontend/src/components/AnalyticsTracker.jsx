import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-4H4TLRD1H7";

const getOrCreateClientId = () => {
  try {
    let cid = localStorage.getItem("zp_cid");
    if (!cid) {
      cid = Math.floor(Math.random() * 2147483647) + "." + Math.floor(Date.now() / 1000);
      localStorage.setItem("zp_cid", cid);
    }
    return cid;
  } catch (e) {
    return Math.floor(Math.random() * 2147483647) + "." + Math.floor(Date.now() / 1000);
  }
};

const sendFallbackBeacon = (eventName, params = {}) => {
  try {
    const clientId = getOrCreateClientId();
    const queryParts = [
      "v=2",
      `tid=${GA_MEASUREMENT_ID}`,
      `cid=${clientId}`,
      `en=${encodeURIComponent(eventName)}`,
    ];

    if (params._et) queryParts.push(`_et=${params._et}`);
    if (params.dl) queryParts.push(`dl=${encodeURIComponent(params.dl)}`);
    if (params.dt) queryParts.push(`dt=${encodeURIComponent(params.dt)}`);
    if (params.dr) queryParts.push(`dr=${encodeURIComponent(params.dr)}`);

    const beaconUrl = `/zp-stats/g/collect?${queryParts.join("&")}`;

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(beaconUrl);
    } else if (typeof fetch === "function") {
      fetch(beaconUrl, { method: "POST", mode: "no-cors", keepalive: true }).catch(() => {});
    }
  } catch (_) {}
};

const AnalyticsTracker = () => {
  const location = useLocation();

  const startTimeRef = useRef(Date.now());
  const activeLocationRef = useRef(window.location.href);
  const activePathRef = useRef(location.pathname + location.search);
  const activeTitleRef = useRef(document.title);
  const isFirstMountRef = useRef(true);

  // Helper to flush engagement for the active page
  const flushEngagement = (isTransition = false) => {
    const elapsedMs = Date.now() - startTimeRef.current;
    // Filter out accidental rapid micro-clicks under 1 second to eliminate noisy zeroes
    if (elapsedMs < 1000) {
      if (isTransition) startTimeRef.current = Date.now();
      return;
    }

    const loc = activeLocationRef.current || window.location.href;
    const title = activeTitleRef.current || document.title;
    const path = activePathRef.current || (location.pathname + location.search);

    // a) Standard gtag path
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", "user_engagement", {
          engagement_time_msec: elapsedMs,
          page_location: loc,
          page_title: title,
          page_path: path,
        });
      } catch (_) {}
    } else {
      // b) Fallback beacon for privacy browsers / script blockers
      sendFallbackBeacon("user_engagement", {
        _et: elapsedMs,
        dl: loc,
        dt: title,
      });
    }

    // Reset stopwatch baseline
    startTimeRef.current = Date.now();
  };

  // 1. Route transition and Page View lifecycle
  useEffect(() => {
    const pagePath = location.pathname + location.search;
    const pageLocation = window.location.href;
    const pageTitle = document.title;

    if (isFirstMountRef.current) {
      // First mount of the SPA: track initial page_view
      isFirstMountRef.current = false;
      startTimeRef.current = Date.now();
      activeLocationRef.current = pageLocation;
      activePathRef.current = pagePath;
      activeTitleRef.current = pageTitle;

      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_title: pageTitle,
          page_location: pageLocation,
          page_path: pagePath,
        });
      } else {
        sendFallbackBeacon("page_view", { dl: pageLocation, dt: pageTitle });
      }
      return;
    }

    // Route Changed: Flush engagement of the previous route
    flushEngagement(true);

    // Update active route pointers
    activeLocationRef.current = pageLocation;
    activePathRef.current = pagePath;
    activeTitleRef.current = pageTitle;
    startTimeRef.current = Date.now();

    // Fire page_view for the new route
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: pageTitle,
        page_location: pageLocation,
        page_path: pagePath,
      });
    } else {
      sendFallbackBeacon("page_view", { dl: pageLocation, dt: pageTitle });
    }
  }, [location.pathname, location.search]);

  // 2. Visibility change and Page Hide lifecycle (tab switch, close, mobile minimize)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushEngagement();
      } else if (document.visibilityState === "visible") {
        startTimeRef.current = Date.now();
      }
    };

    const handlePageHide = () => {
      flushEngagement();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, []);

  return null;
};

export default AnalyticsTracker;
