// import { useState, useEffect, useRef } from "react";
// import { PacmanLoader } from "react-spinners";
// import { FaChevronDown } from "react-icons/fa";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { initGA, trackPageView } from "../../../../../Analytics";
// import axiosInstance from "../../../../../Auth/Axios";
// import { jwtDecode } from "jwt-decode";
// import "./Viewer.scss";

// const Viewer = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const containerRef = useRef(null);
//   const imageRefs = useRef([]);

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [showScrollHint, setShowScrollHint] = useState(true);
//   const [startIndex, setStartIndex] = useState(0);
//   const hasTrackedRef = useRef(false); // ✅ ensures view tracked only once

//   const { projectSlug } = useParams();
//   const projectId = projectSlug?.split("-")[0];

//   const token = localStorage.getItem("token");
//   let userId = null;
//   let username = null;

//   // Decode token
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       console.log("Decoded token:", decoded);
//       userId = decoded?.userId || null;
//       username = decoded?.username || null;
//     } catch (err) {
//       console.error("Error decoding token:", err);
//     }
//   }

//   // Zoom controls
//   const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
//   const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
//   const resetZoom = () => setScale(1);

//   // Google Analytics
//   useEffect(() => {
//     initGA();
//     trackPageView(window.location.pathname + window.location.search);

//     const timer = setTimeout(() => setLoading(false), 1000);
//     const hintTimer = setTimeout(() => setShowScrollHint(false), 5000);

//     return () => {
//       clearTimeout(timer);
//       clearTimeout(hintTimer);
//     };
//   }, []);

//   // ✅ Track project view only once
// useEffect(() => {
//   if (!projectId || hasTrackedRef.current) return;

//   const trackView = async () => {
//     try {
//       console.log("Tracking view for project:", projectId);
//       const response = await axiosInstance.post(
//         `/projects/${projectId}/view`,
//         {},
//         {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : undefined,
//         }
//       );
//       console.log("View recorded:", response.data);
//       hasTrackedRef.current = true;
//     } catch (err) {
//       console.error("Error tracking view:", err.response?.data || err.message);
//     }
//   };

//   trackView();
// }, [projectId]); // only projectId

//   // Fetch images
// useEffect(() => {
//   const fetchImages = async () => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const queryImages = queryParams.get("images");
//     const queryStartIndex = queryParams.get("start");

//     if (queryStartIndex) {
//       setStartIndex(parseInt(queryStartIndex, 10));
//     }

//     // ⭐ If images came from Swiper → use them
//     if (queryImages) {
//       try {
//         const parsedImages = JSON.parse(decodeURIComponent(queryImages));
//         setImages(parsedImages || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error parsing images from query", err);
//         setImages([]);
//         setLoading(false);
//       }
//     }

//     // ⭐ Else load from Backend
//     else if (projectId) {
//       try {
//         const res = await axiosInstance.get(`/projects/id/${projectId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//           params: { userId, username },
//         });

//         const project = res.data.project;

//         const thumbnails = project.thumbnailImages || [];
//         const pdfPages = project.comicPages || [];
//         const allImages = project.allImages || [];

//         let merged = [];

//         // ⭐ Priority 1 → Backend-provided master order
//         if (Array.isArray(allImages) && allImages.length > 0) {
//           merged = allImages;
//         }

//         // ⭐ Priority 2 → Merge JPG + PDF in natural order
//         else {
//           merged = [...thumbnails, ...pdfPages];
//         }

//         setImages(merged);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching images from backend", err);
//         setImages([]);
//         setLoading(false);
//       }
//     }
//   };

//   fetchImages();
// }, [projectId, token, userId, username]);


//   // Detect visible image while scrolling
//   useEffect(() => {
//     if (!images.length || !containerRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         let mostVisible = null;
//         let maxRatio = 0;

//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
//             maxRatio = entry.intersectionRatio;
//             mostVisible = entry.target;
//           }
//         });

//         if (mostVisible) {
//           const index = parseInt(mostVisible.dataset.index, 10);

//           if (index !== startIndex) {
//             setStartIndex(index);

//             const url = new URL(window.location.href);
//             url.searchParams.set("start", index);
//             navigate(`${url.pathname}?${url.searchParams.toString()}`, { replace: true });
//           }

//           setShowOverlay(index === images.length - 1);
//         }
//       },
//       {
//         root: containerRef.current,
//         threshold: Array.from({ length: 10 }, (_, i) => i / 10),
//       }
//     );

//     imageRefs.current.forEach((img) => img && observer.observe(img));

//     return () => {
//       imageRefs.current.forEach((img) => img && observer.unobserve(img));
//     };
//   }, [images, startIndex, navigate]);

//   return (
//     <div className="viewer">
//       <div className="viewer__container" ref={containerRef}>
//         {loading && (
//           <div className="viewer__loading-spinner">
//             <PacmanLoader color="orange" size={50} />
//           </div>
//         )}

//         {showScrollHint && (
//           <div className="viewer__scroll-hint">
//             <div className="viewer__scroll-icon">
//               <FaChevronDown className="viewer__chevron" />
//               <span className="viewer__scroll-text">Scroll down to read</span>
//             </div>
//           </div>
//         )}

//         <div className="viewer__scroll-wrapper">
//           {Array.isArray(images) && images.length > 0 ? (
//             images.map((img, index) => (
//               <div
//                 key={index}
//                 className="viewer__image-wrapper"
//                 style={{
//                   transform: `scale(${scale})`,
//                   transformOrigin: "top center",
//                 }}
//               >
//                 <img
//                   ref={(el) => (imageRefs.current[index] = el)}
//                   data-index={index}
//                   src={img}
//                   alt={`Page ${index + 1}`}
//                   className="viewer__image"
//                   onLoad={() => setLoading(false)}
//                   onError={() => setLoading(false)}
//                 />
//               </div>
//             ))
//           ) : (
//             !loading && (
//               <p style={{ color: "white", textAlign: "center" }}>
//                 No images available.
//               </p>
//             )
//           )}
//         </div>

//         {showOverlay && (
//           <div className="viewer__overlay viewer__overlay--forum-cta">
//             <p>
//               Loved this comic? Join fellow fans in epic debates, share your theories,
//               and discover hidden easter eggs you might have missed!
//             </p>
//             <button onClick={() => navigate(`/forum`)}>Join the Comic Community</button>
//           </div>
//         )}

//         <div className="viewer__zoom-controls">
//           <button onClick={zoomOut}>−</button>
//           <button onClick={resetZoom}>⭮</button>
//           <button onClick={zoomIn}>+</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Viewer;

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { PacmanLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { initGA, trackPageView } from "../../../../../Analytics";
import axiosInstance from "../../../../../Auth/Axios";
import { jwtDecode } from "jwt-decode";

// OPTIMIZED INLINE COMPONENT EXTENSIONS
import ViewerProgressBar from "./Viewer/ViewerProgressBar";
import TierSelectionOverlay from "./Viewer/TierSelectionOverlay";
import PaymentSuccessModal from "./Viewer/PaymentSuccessModal";
import GamifiedLoader from "./Viewer/GamifiedLoader";
import ViewerHUD from "./Viewer/ViewerHUD";
import ViewerMilestone from "./Viewer/ViewerMilestone";
import ViewerCompletion from "./Viewer/ViewerCompletion";
import ViewerResumeModal from "./Viewer/ViewerResumeModal";
import AmbientPlayer from "./Viewer/AmbientPlayer";
import PanelReaction from "./Viewer/PanelReaction";
import ChapterBreakOverlay from "./Viewer/ChapterBreakOverlay";
import ViewerExitPrompt from "./Viewer/ViewerExitPrompt";
import "./Viewer.scss";
import "./Viewer/ViewerEngagement.scss";

const getBaseSeriesName = (name) => {
  return (name || "").trim()
    .replace(/\s*-\s*Chapter\s*\d+/gi, "")
    .replace(/\s*Chapter\s*\d+/gi, "")
    .replace(/\s*#\s*\d+/gi, "")
    .replace(/\s*Part\s*\d+/gi, "")
    .replace(/\s*\(english\)/gi, "")
    .replace(/\s*\(hindi\)/gi, "")
    .replace(/\s*\(one-shot\)/gi, "")
    .replace(/\s*\(mini comic\)/gi, "")
    .replace(/\s+ke\s+naye\s+ka?rnaam?e/gi, "")
    .replace(/\s+ki\s+duniya/gi, "")
    .trim()
    .toLowerCase();
};

const Viewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const projectId = projectSlug?.split("-")[0];
  const token = localStorage.getItem("token");
  
  // Temporary flag to disable paywall overlay and unlock all pages for readers
  const isPaywallDisabled = true;

  // Memoize user credentials payload extraction
  const userContext = useMemo(() => {
    if (!token) return { userId: null, username: null, email: "Anonymous Reader", phone: null };
    try {
      const decoded = jwtDecode(token);
      return {
        userId: decoded?.userId || null,
        username: decoded?.username || null,
        email: decoded?.email || "Anonymous Reader",
        phone: decoded?.phone || null
      };
    } catch {
      return { userId: null, username: null, email: "Anonymous Reader", phone: null };
    }
  }, [token]);

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("guestId", guestId);
  }

  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const hasTrackedRef = useRef(false);
  
  const [successModal, setSuccessModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [purchasedTier, setPurchasedTier] = useState("");
  const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);

  // Premium Access states
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [physicalDiscountCode, setPhysicalDiscountCode] = useState(null);

  // ── engagement / retention states ──────────────────────────────────
  const [theme,          setTheme]          = useState(() => localStorage.getItem("vp_theme") || "dark");
  const [isImmersive,    setIsImmersive]    = useState(false);
  const [autoScrolling,  setAutoScrolling]  = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showResume,     setShowResume]     = useState(false);
  const [savedPage,      setSavedPage]      = useState(0);
  const [musicVisible,   setMusicVisible]   = useState(false);
  // Ambient hue: starts at 220 (cool blue), shifts towards 10 (warm red) at end
  const [ambientHue,     setAmbientHue]     = useState(220);
  const autoScrollRafRef = useRef(null);
  const wrapperRefs      = useRef([]);  // refs to .viewer__image-wrapper divs

  // Auto-advance / Infinity Scroll states
  const [allProjects, setAllProjects] = useState([]);
  const [nextProject, setNextProject] = useState(null);
  const [loadedChapters, setLoadedChapters] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(projectId);
  const [loadingNext, setLoadingNext] = useState(false);

  const progressPercentage = useMemo(() => {
    return images.length > 1 ? (startIndex / (images.length - 1)) * 100 : 0;
  }, [startIndex, images.length]);
  
  // ── Behavior tracking & debounced syncing ──
  const sessionStartRef = useRef(Date.now());
  const lastSyncTimeRef = useRef(Date.now());
  const maxStartIndexRef = useRef(0);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Track max page reached
  useEffect(() => {
    if (startIndex > maxStartIndexRef.current) {
      maxStartIndexRef.current = startIndex;
    }
  }, [startIndex]);

  const syncBehavior = useCallback(async (isFinal = false) => {
    if (!projectId) return;

    const now = Date.now();
    const timeSpent = Math.round((now - lastSyncTimeRef.current) / 1000);
    if (timeSpent <= 0 && !isFinal) return;

    const maxIndex = maxStartIndexRef.current;
    const progress = images.length > 1 ? maxIndex / (images.length - 1) : 0;
    const trackingUserId = userContext.userId || localStorage.getItem("Id") || "anonymous_session";

    try {
      const payload = {
        userId: trackingUserId,
        projectId,
        readProgress: progress,
        timeSpentSeconds: timeSpent,
      };

      // Reset sync timer immediately
      lastSyncTimeRef.current = now;

      if (isFinal) {
        // Use sendBeacon for final sync on unmount to make sure it sends reliably
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${apiBaseUrl}/behavior/track`, blob);
        }
      } else {
        await axiosInstance.post("/behavior/track", payload);
      }
    } catch (err) {
      console.error("Failed to sync behavior statistics:", err);
    }
  }, [projectId, images.length, userContext.userId, apiBaseUrl]);

  // Periodic behavior tracking sync
  useEffect(() => {
    const interval = setInterval(() => {
      syncBehavior(false);
    }, 15000); // sync every 15s

    return () => {
      clearInterval(interval);
      syncBehavior(true); // final sync on unload
    };
  }, [syncBehavior]);

  // Find next chapter or next unique comic series in database for infinite scrolling
  useEffect(() => {
    if (!images.length || !projectId) return;

    const findNextChapter = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        const list = res.data || [];
        setAllProjects(list);

        const activeId = activeProjectId || projectId;
        const currentProj = list.find(p => (p.projectId || p._id) === activeId);
        if (!currentProj) return;

        const baseName = getBaseSeriesName(currentProj.name);
        const series = list.filter(p => getBaseSeriesName(p.name) === baseName);

        const extractChapterNum = (name) => {
          const m = name.match(/chapter\s*(\d+)/i) || name.match(/part\s*(\d+)/i) || name.match(/#\s*(\d+)/i) || name.match(/episode\s*(\d+)/i);
          return m ? parseInt(m[1], 10) : 0;
        };

        const sortedSeries = [...series].sort((a, b) => extractChapterNum(a.name) - extractChapterNum(b.name));
        const curIndex = sortedSeries.findIndex(p => (p.projectId || p._id) === activeId);

        if (curIndex !== -1 && curIndex < sortedSeries.length - 1) {
          // Next chapter in same series
          setNextProject(sortedSeries[curIndex + 1]);
        } else {
          // Series ended! Find next UNIQUE comic series so reading never stops
          const seenKeys = new Set();
          const uniqueSeriesList = [];
          for (const p of list) {
            const key = getBaseSeriesName(p.name);
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              uniqueSeriesList.push(p);
            }
          }
          const curSeriesIndex = uniqueSeriesList.findIndex(p => getBaseSeriesName(p.name) === baseName);
          const nextSeriesIndex = (curSeriesIndex + 1) % (uniqueSeriesList.length || 1);
          const nextSeriesObj = uniqueSeriesList[nextSeriesIndex];
          if (nextSeriesObj && (nextSeriesObj.projectId || nextSeriesObj._id) !== activeId) {
            setNextProject(nextSeriesObj);
          } else {
            setNextProject(null);
          }
        }
      } catch (err) {
        console.error("Error finding next chapter:", err);
      }
    };

    findNextChapter();
  }, [projectId, activeProjectId, images.length]);

  const slugifyHelper = (text) => {
    const clean = (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return clean || "comic";
  };

  // Navigate directly into the viewer for the next chapter.
  // Use /viewer/ route so the reader lands in read mode immediately,
  // not on the details/info page which requires an extra tap to start reading.
  const loadNextChapter = useCallback(() => {
    if (!nextProject) return;
    const nextId = nextProject.projectId || nextProject._id;
    const slug = slugifyHelper(nextProject.name);
    window.location.href = `/viewer/${nextId}-${slug}`;
  }, [nextProject]);

  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = useCallback(() => {
    setLoadedCount((prev) => {
      const nextCount = prev + 1;
      const target = Math.min(3, images.length);
      if (nextCount >= target && target > 0) {
        setLoading(false);
      }
      return nextCount;
    });
  }, [images.length]);

  const currentIndexRef = useRef(0);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => setScale(1);

  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname + window.location.search);
    const timer = setTimeout(() => setLoading(false), 5000); // Safety fallback timeout of 5s to prevent loader hang
    const hintTimer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => { clearTimeout(timer); clearTimeout(hintTimer); };
  }, []);

  // ── Anti-piracy security handlers ──
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Disable Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P" || e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return;
      }
      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect/Console/Element select)
      if (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J" || e.key === "c" || e.key === "C")) {
        e.preventDefault();
        return;
      }
      // Disable F12
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Copyright ZealPlane. Unauthorized duplication is strictly prohibited.").catch(() => {});
        toast.warning("Screenshots are disabled on the reader to protect creator rights!");
      }
    };

    const handleBlur = () => {
      document.body.classList.add("viewer-blurred");
    };

    const handleFocus = () => {
      document.body.classList.remove("viewer-blurred");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // DevTools detection loop
    const devtoolsThreshold = 160;
    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > devtoolsThreshold || heightDiff > devtoolsThreshold) {
        setIsDevtoolsOpen(true);
      } else {
        setIsDevtoolsOpen(false);
      }
    };
    const devToolsInterval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      clearInterval(devToolsInterval);
      document.body.classList.remove("viewer-blurred");
    };
  }, []);

  useEffect(() => {
    if (!projectId || hasTrackedRef.current) return;
    const trackView = async () => {
      try {
        await axiosInstance.post(`/projects/${projectId}/view`, { guestId }, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        hasTrackedRef.current = true;
      } catch (err) { console.error("Error tracking view:", err); }
    };
    trackView();
  }, [projectId, token, guestId]);

  useEffect(() => {
    const fetchImages = async () => {
      // ── CHAPTER RESET: clear all previous chapter state on projectId change ──
      // This prevents old chapter pages from persisting/appending when navigating
      // to a new chapter via the "Read Next Chapter" button
      setImages([]);
      setLoadedChapters([]);
      setLoadingNext(false);
      setLoading(true);
      setStartIndex(0);
      setShowResume(false);
      hasTrackedRef.current = false;
      currentIndexRef.current = 0;
      // Scroll back to top of viewer on chapter change
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: "instant" });
      }

      const queryParams = new URLSearchParams(window.location.search);
      const queryImages = queryParams.get("images");
      const queryStartIndex = queryParams.get("start");

      if (queryStartIndex) {
        const parsedStart = parseInt(queryStartIndex, 10);
        setStartIndex(parsedStart);
        currentIndexRef.current = parsedStart;
      }

      if (queryImages) {
        try {
          const parsedImages = JSON.parse(decodeURIComponent(queryImages));
          const resolved = parsedImages || [];
          setImages(resolved);
          if (resolved.length === 0) {
            setLoading(false);
          }
          // Check for saved reading position (resume feature)
          const saved = parseInt(localStorage.getItem(`vp_${projectId}`) || "0", 10);
          if (saved > 0) { setSavedPage(saved); setShowResume(true); }
          return;
        } catch (err) { console.error(err); }
      }

      if (projectId) {
        try {
          let res;
          try {
            res = await axiosInstance.get(`/projects/id/${projectId}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              params: { userId: userContext.userId, username: userContext.username, guestId }
            });
          } catch (fetchErr) {
            // If stale/expired token causes 401/403, clear credentials & retry as guest
            if (fetchErr.response?.status === 401 || fetchErr.response?.status === 403) {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              res = await axiosInstance.get(`/projects/id/${projectId}`, {
                params: { guestId }
              });
            } else {
              throw fetchErr;
            }
          }
          const project = res.data.project;
          
          if (project.hasPremiumAccess) {
            setHasPremiumAccess(true);
            if (project.physicalDiscountCode) {
              setPhysicalDiscountCode(project.physicalDiscountCode);
            }
            toast.success("🔓 Premium Pages & BTS Unlocked!");
          }

          const resolvedImages = project.allImages?.length
            ? project.allImages
            : [...(project.thumbnailImages || []), ...(project.comicPages || [])];
          setImages(resolvedImages);
          setLoading(false);

          // Initialize loaded chapters
          const firstChapter = {
            projectId: projectId,
            name: project.name,
            startPageIndex: 0,
            endPageIndex: (resolvedImages || []).length - 1
          };
          setLoadedChapters([firstChapter]);
          setActiveProjectId(projectId);

          // Bookmark reading state for continuous retention
          try {
            localStorage.setItem("zp_last_read", JSON.stringify({
              projectId: projectId,
              projectSlug: projectSlug || projectId,
              title: project.name,
              thumbnail: project.thumbnailImage || (resolvedImages && resolvedImages[0]) || "",
              url: window.location.pathname,
              timestamp: Date.now()
            }));
          } catch (_) {}

          // Check for saved reading position (resume feature)
          const saved = parseInt(localStorage.getItem(`vp_${projectId}`) || "0", 10);
          if (saved > 0) { setSavedPage(saved); setShowResume(true); }
        } catch { setImages([]); setLoading(false); }
      }
    };
    fetchImages();
  }, [projectId, token, userContext]);

  useEffect(() => {
    if (!images.length || !containerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      let mostVisible = null;
      let maxRatio = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio; mostVisible = entry.target;
        }
      });
      if (mostVisible) {
        const index = parseInt(mostVisible.dataset.index, 10);

        // Auto-advance trigger: load next chapter when 3 pages from current end
        if (index !== currentIndexRef.current) {
          currentIndexRef.current = index; setStartIndex(index);

          // ── Trigger ViewerCompletion modal when reader reaches the LAST page ──
          // Previously showCompletion was never set to true — this was dead code.
          if (index === images.length - 1) {
            setShowCompletion(true);
          }

          const activeCh = loadedChapters.find(ch => index >= ch.startPageIndex && index <= ch.endPageIndex) || { projectId, startPageIndex: 0 };

          if (activeCh && activeCh.projectId !== activeProjectId) {
            setActiveProjectId(activeCh.projectId);

            const slugify = (text) => {
              const clean = (text || "")
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
              return clean || "comic";
            };

            const newSlug = `${activeCh.projectId}-${slugify(activeCh.name)}`;
            const url = new URL(window.location.href);
            url.searchParams.set("start", index - activeCh.startPageIndex);

            // Keep URL in sync as /viewer/ since that's where the reader is
            window.history.replaceState(null, "", `/viewer/${newSlug}?${url.searchParams.toString()}`);

            // Track view count for the new active chapter
            const trackNextView = async () => {
              try {
                await axiosInstance.post(`/projects/${activeCh.projectId}/view`, { guestId }, {
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined
                });
              } catch (err) { console.error("Error tracking view:", err); }
            };
            trackNextView();
            trackPageView(`/viewer/${newSlug}`);
          } else {
            const url = new URL(window.location.href);
            url.searchParams.set("start", index - activeCh.startPageIndex);
            window.history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}`);
            trackPageView(`${url.pathname}?${url.searchParams.toString()}`);
          }

          localStorage.setItem(`vp_${activeCh.projectId}`, index - (activeCh.startPageIndex || 0));

          // ── Ink-burst particle effect on page turn ──
          const wrapper = wrapperRefs.current[index];
          if (wrapper) {
            wrapper.classList.add("page-turn-fx");
            setTimeout(() => wrapper.classList.remove("page-turn-fx"), 750);
          }
        }
      }
    }, { root: containerRef.current, threshold: [0.1, 0.3, 0.5, 0.7, 0.9] });

    imageRefs.current.forEach((img) => img && observer.observe(img));
    return () => observer.disconnect();
  }, [images, navigate, projectId, nextProject, loadingNext, loadNextChapter, loadedChapters, activeProjectId, token, guestId]);

  // ── Keyboard navigation: ← → arrow keys to flip pages ──────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!images.length) return;
      if (e.code === "ArrowRight" || e.code === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(currentIndexRef.current + 1, images.length - 1);
        imageRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(currentIndexRef.current - 1, 0);
        imageRefs.current[prev]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images]);

  // ── Auto-scroll: smooth hands-free reading ───────────────────────────────
  useEffect(() => {
    if (autoScrolling) {
      const tick = () => {
        containerRef.current?.scrollBy({ top: 1, behavior: "instant" });
        autoScrollRafRef.current = requestAnimationFrame(tick);
      };
      autoScrollRafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(autoScrollRafRef.current);
    }
    return () => cancelAnimationFrame(autoScrollRafRef.current);
  }, [autoScrolling]);

  // ── Persist theme choice ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("vp_theme", theme);
  }, [theme]);

  // ── Ambient hue shift: cool blue → warm orange-red as reading progresses ──
  useEffect(() => {
    // 220 (indigo-blue at 0%) → 30 (warm amber at 50%) → 10 (deep red at 100%)
    const hue = Math.round(220 - progressPercentage * 2.1);
    setAmbientHue(Math.max(10, hue));
  }, [progressPercentage]);

  // ===================== MEMOIZED INTERACTION CALLBACKS =====================
  const handleSupportClick = useCallback(async (tierValue, guestInfo = {}) => {
    const { email: guestEmail, phone: guestPhone } = guestInfo;
    setSupportLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.post("/payment/support", { 
        tier: tierValue, 
        projectId, 
        email: guestEmail || userContext.email,
        phone: guestPhone || userContext.phone
      }, { headers });

      if (res.data.success) {
        const { order_id, key, amount, currency } = res.data;
        const options = {
          key, amount, currency,
          name: "ZealPlane Content Unlock",
          description: tierValue === "99" ? "Unlock Motion Comics + Early Access" : "Unlock Behind The Scenes + Extra Pages",
          order_id,
          remember_customer: true, // Prevents session dropped/connection closed loops
          retry: { enabled: true, max_count: 3 }, // Safe connection fallback engine
          prefill: {
            email: guestEmail || userContext.email || "",
            contact: guestPhone || userContext.phone || ""
          },
          handler: async function (response) {
            try {
              setSupportLoading(true);
              const verifyRes = await axiosInstance.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tier: tierValue, 
                projectId,
                email: guestEmail || userContext.email,
                phone: guestPhone || userContext.phone
              }, { headers });

              if (verifyRes.data.success) {
                setPaymentId(response.razorpay_payment_id);
                setPurchasedTier(tierValue);
                setSuccessModal(true);
              }
            } catch (err) { console.error(err); } finally { setSupportLoading(false); }
          },
          modal: { ondismiss: () => setSupportLoading(false) },
          theme: { color: "#ff4500" }
        };
        new window.Razorpay(options).open();
      }
    } catch { setSupportLoading(false); }
  }, [projectId, token, userContext.email, userContext.phone]);

  const handleForumNavigation = useCallback(() => navigate("/forum"), [navigate]);
  const closeSuccessModal = useCallback(() => setSuccessModal(false), []);

  // Resume: scroll to saved page
  const handleResume = useCallback(() => {
    setShowResume(false);
    setTimeout(() => {
      imageRefs.current[savedPage]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [savedPage]);

  const handleStartOver = useCallback(() => {
    if (projectId) localStorage.removeItem(`vp_${projectId}`);
    setShowResume(false);
  }, [projectId]);

  const handleCloseCompletion = useCallback(() => setShowCompletion(false), []);
  const handleThemeChange     = useCallback((t) => setTheme(t), []);
  const handleToggleImmersive = useCallback(() => setIsImmersive(v => !v), []);
  const handleToggleAutoScroll= useCallback(() => setAutoScrolling(v => !v), []);
  const handleToggleMusic     = useCallback(() => setMusicVisible(v => !v), []);

  return (
    <div
      className={`viewer viewer--${theme} ${isImmersive ? "viewer--immersive" : ""}`}
      style={{ transform: "translate3d(0,0,0)", contain: "layout" }}
    >
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {isDevtoolsOpen && (
        <div className="viewer__devtools-warning">
          <div className="warning-box">
            <h2>⚠️ Developer Tools Detected</h2>
            <p>To protect creator rights and secure content from piracy, reading is suspended while Developer Tools is active.</p>
            <p className="sub-text">Please close DevTools to resume your reading experience.</p>
          </div>
        </div>
      )}
      {/* Ambient background glow — shifts hue with reading progress */}
      <div
        className="viewer__ambient-glow"
        style={{ "--vp-ambient-hue": ambientHue }}
        aria-hidden="true"
      />

      <div className="viewer__container" ref={containerRef} style={{ position: "relative" }}>
        
        <ViewerProgressBar
          progressPercentage={progressPercentage}
          currentPage={startIndex}
          totalPages={images.length}
        />

        {/* Gamified loading screen — replaces plain spinner; no core logic changed */}
        <GamifiedLoader loading={loading} />

        {/* ── Engagement overlay components ── */}
        <ViewerHUD
          currentPage={startIndex}
          totalPages={images.length}
          theme={theme}
          onThemeChange={handleThemeChange}
          isImmersive={isImmersive}
          onToggleImmersive={handleToggleImmersive}
          autoScrolling={autoScrolling}
          onToggleAutoScroll={handleToggleAutoScroll}
          musicVisible={musicVisible}
          onToggleMusic={handleToggleMusic}
          onOpenDetails={() => navigate(`/details/${projectSlug || projectId}`)}
        />
        
        {/* Physical Discount Code Float */}
        {hasPremiumAccess && physicalDiscountCode && (
          <div className="viewer__discount-float" style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 100, background: 'linear-gradient(135deg, #ff4500, #ff007f)', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(255, 69, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>🎁 Physical Copy Discount</span>
            <span style={{ fontSize: '16px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>{physicalDiscountCode}</span>
          </div>
        )}

        <ViewerResumeModal
          isOpen={showResume}
          savedPage={savedPage}
          totalPages={images.length}
          onResume={handleResume}
          onStartOver={handleStartOver}
        />
        <ViewerCompletion
          isOpen={showCompletion}
          projectId={projectId}
          onClose={handleCloseCompletion}
        />

        {showScrollHint && (
          <div className="viewer__scroll-hint">
            <div className="viewer__scroll-icon"><FaChevronDown className="viewer__chevron" /><span className="viewer__scroll-text">Scroll down to read</span></div>
          </div>
        )}

        {/* COMIC STREAM BLOCK - FORCED VERTICAL FLOW */}
        <div className="viewer__scroll-wrapper" style={{ display: "block", position: "relative", width: "100%" }}>
          {((hasPremiumAccess || isPaywallDisabled) ? images : images.slice(0, 15)).map((img, index) => (
            <div
              key={index}
              className="viewer__image-wrapper"
              ref={(el) => { if (el) wrapperRefs.current[index] = el; }}
              style={{ transform: `scale(${scale}) translate3d(0,0,0)`, transformOrigin: "top center", willChange: "transform", width: "100%", display: "block" }}
            >
              <div className="viewer__image-shield" />
              <img
                ref={(el) => { if (el) imageRefs.current[index] = el; }}
                data-index={index} src={img} alt={`Page ${index + 1}`} className="viewer__image"
                loading={index > 2 ? "lazy" : "eager"}
                fetchPriority={index === 0 ? "high" : "auto"}
                onLoad={handleImageLoad} onError={handleImageLoad}
                style={{ display: "block", width: "100%", height: "auto", userSelect: "none", WebkitUserDrag: "none", pointerEvents: "none" }}
              />
              {/* Emoji float reaction — appears once per page on first view */}
              <PanelReaction
                pageIndex={index}
                containerRef={containerRef}
                imgRef={{ current: imageRefs.current[index] }}
              />
            </div>
          ))}

          {loadingNext && (
            <div className="viewer__next-chapter-loading" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", backgroundColor: "#0d0d14", gap: "15px", borderTop: "2px solid #ff4500", width: "100%" }}>
              <PacmanLoader color="orange" size={25} />
              <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>Loading Next Chapter...</span>
            </div>
          )}

          {/* 🏁 PRATILIPI-STYLE CHAPTER END INTERSTITIAL BREAK & LEAD CAPTURE SCREEN */}
          {images.length > 0 && (
            <ChapterBreakOverlay
              currentChapterName={loadedChapters[loadedChapters.length - 1]?.name || "End of Chapter"}
              nextProject={nextProject}
              onLoadNext={loadNextChapter}
              onNavigateHome={() => navigate("/")}
              onNavigateForum={() => navigate("/forum")}
              projectId={activeProjectId || projectId}
            />
          )}

          {/* ⚡ CLEAR BLOCK WRAPPER FORCING TIERS DOWN TO THE BOTTOM AND STRIPPING CORRUPT SCROLL PARAMS */}
          {images.length > 0 && !isPaywallDisabled && (
            <div style={{ display: "block", position: "relative", clear: "both", width: "100%", backgroundColor: "#0d0d14", borderTop: "3px solid #ff4500", padding: "60px 0 80px 0", transform: "none", opacity: 1, visibility: "visible", maskImage: "none", WebkitMaskImage: "none" }}>
              <TierSelectionOverlay 
                onSelectTier={handleSupportClick} 
                supportLoading={supportLoading} 
                onNavigateForum={handleForumNavigation} 
                userContext={userContext}
              />
            </div>
          )}
        </div>

        <div className="viewer__zoom-controls">
          <button onClick={zoomOut}>−</button>
          <button onClick={resetZoom}>⭮</button>
          <button onClick={zoomIn}>+</button>
        </div>
      </div>

      <PaymentSuccessModal 
        isOpen={successModal} 
        purchasedTier={purchasedTier} 
        paymentId={paymentId} 
        onClose={closeSuccessModal} 
      />

      {/* 🔔 Exit-intent push notification prompt — fires on scroll-back or mouse-leave */}
      <ViewerExitPrompt
        currentPage={startIndex}
        totalPages={images.length}
        chapterName={loadedChapters[loadedChapters.length - 1]?.name || ""}
        nextChapterName={nextProject?.name || null}
      />

      {/* Floating ambient music player */}
      <AmbientPlayer visible={musicVisible} />
    </div>
  );
};

export default Viewer;