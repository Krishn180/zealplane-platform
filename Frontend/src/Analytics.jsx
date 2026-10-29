// src/analytics.js
import ReactGA from "react-ga4";

export const initGA = () => {
  const transportUrl = typeof window !== "undefined" ? window.location.origin + "/zp-stats" : undefined;
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-4H4TLRD1H7", { 
      send_page_view: false,
      transport_url: transportUrl
    });
  }
  ReactGA.initialize("G-4H4TLRD1H7", {
    gtagOptions: {
      transport_url: transportUrl
    }
  });
};

export const trackPageView = (path) => {
  if (typeof window !== "undefined") {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    ReactGA.send({ hitType: "pageview", page: path });
  }
};
