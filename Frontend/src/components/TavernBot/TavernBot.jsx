import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaPaperPlane, 
  FaTimes, 
  FaCommentDots, 
  FaBolt, 
  FaCrown, 
  FaBookOpen,
  FaCalendarAlt,
  FaTv,
  FaQuestionCircle,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt
} from "react-icons/fa";
import "./TavernBot.scss";

// --- MANGA & COMIC RELEASE CALENDAR (IST Verified) ---
const MANGA_SCHEDULE = [
  {
    id: "op",
    title: "One Piece",
    nextChapter: "Chapter 1192",
    day: "Sundays",
    timeIST: "8:30 PM IST",
    platform: "MANGA Plus / Shonen Jump",
    spoilers: "Raw leaks circulate Wed–Thu",
    status: "Active (Elbaf Arc)",
    icon: "🏴‍☠️",
    searchTerms: ["one piece", "luffy", "op", "1191", "1192", "zoro", "elbaf", "oda"]
  },
  {
    id: "csm",
    title: "Chainsaw Man",
    nextChapter: "Chapter 198",
    day: "Tuesdays (Bi-weekly / Weekly)",
    timeIST: "8:30 PM IST",
    platform: "MANGA Plus / Shonen Jump+",
    spoilers: "War Devil & Reze Climax",
    status: "Active",
    icon: "🪚",
    searchTerms: ["chainsaw man", "csm", "denji", "reze", "fujimoto", "makima"]
  },
  {
    id: "kb",
    title: "Kagurabachi",
    nextChapter: "Chapter 74",
    day: "Sundays",
    timeIST: "8:30 PM IST",
    platform: "Weekly Shonen Jump / MANGA Plus",
    spoilers: "Enchanted Blade War Arc",
    status: "Active",
    icon: "🗡️",
    searchTerms: ["kagurabachi", "chihiro", "hokazono"]
  },
  {
    id: "sl",
    title: "Solo Leveling: Ragnarok",
    nextChapter: "Weekly Episode",
    day: "Wednesdays",
    timeIST: "10:30 PM IST",
    platform: "KakaoPage / Webtoon",
    spoilers: "Sung Suho Shadow Monarch Ascension",
    status: "Active",
    icon: "⚔️",
    searchTerms: ["solo leveling", "ragnarok", "sung suho", "jinwoo"]
  },
  {
    id: "boruto",
    title: "Boruto: Two Blue Vortex",
    nextChapter: "Chapter 20",
    day: "20th of Every Month",
    timeIST: "8:30 PM IST",
    platform: "V-Jump / MANGA Plus",
    spoilers: "Shinju God Tree Invasions",
    status: "Monthly",
    icon: "🌀",
    searchTerms: ["boruto", "two blue vortex", "tbv", "sarada", "kawaki"]
  },
  {
    id: "sando",
    title: "Sando ki Duniya (ZealPlane Original)",
    nextChapter: "Chapter 9 ('इडली-डोसा')",
    day: "Every Sunday",
    timeIST: "8:00 PM IST",
    platform: "ZealPlane Exclusive",
    spoilers: "Sando's hilarious local misadventures in Bharat",
    status: "Active & Free",
    icon: "🇮🇳",
    projectId: "66e133bb75ca77f98991b36e",
    isZealPlane: true,
    searchTerms: ["sando", "sando ki duniya", "chullu"]
  },
  {
    id: "karma",
    title: "Karma (ZealPlane Original)",
    nextChapter: "Chapter 4 + Motion Comic",
    day: "Exclusive Drops",
    timeIST: "Vault Access Live",
    platform: "ZealPlane Indie Showcase",
    spoilers: "Cosmic scales of Karma shatter under heavy sin",
    status: "Active & Trending",
    icon: "⚖️",
    projectId: "66fa7a6797ccce27918a5996",
    isZealPlane: true,
    searchTerms: ["karma", "magha", "scales"]
  }
];

// --- WHERE TO WATCH ANIME IN INDIA (Legal OTT & Regional Dubs Guide) ---
const STREAMING_GUIDE = [
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    platforms: ["Crunchyroll India", "Netflix"],
    dubs: ["Hindi", "Tamil", "Telugu", "English", "Japanese"],
    highlight: "Full Hindi, Tamil & Telugu dubs available on Crunchyroll and Netflix! Infinity Castle movie trilogy coming soon.",
    searchTerms: ["demon slayer", "kimetsu", "tanjiro", "nezuko", "mugen", "hashira"]
  },
  {
    title: "Jujutsu Kaisen",
    platforms: ["Crunchyroll India", "Netflix"],
    dubs: ["Hindi (Crunchyroll)", "English", "Japanese"],
    highlight: "Seasons 1 & 2 plus JJK 0 movie streaming. Hindi dub available on Crunchyroll India!",
    searchTerms: ["jujutsu kaisen", "jjk", "gojo", "sukuna", "itadori", "shibuya"]
  },
  {
    title: "Solo Leveling",
    platforms: ["Crunchyroll India"],
    dubs: ["Hindi (Official)", "Tamil", "English", "Japanese"],
    highlight: "Dedicated official Hindi dub streaming exclusively on Crunchyroll India. Season 2 announced!",
    searchTerms: ["solo leveling", "sung jinwoo", "jinwoo", "shadow monarch"]
  },
  {
    title: "One Piece",
    platforms: ["Netflix India", "Crunchyroll India", "Muse India (YouTube)"],
    dubs: ["Japanese", "English (Netflix)"],
    highlight: "Egghead Island Arc simulcasts every week on Netflix and Crunchyroll India.",
    searchTerms: ["one piece", "luffy", "zoro", "egghead", "gear 5"]
  },
  {
    title: "Attack on Titan (AOT)",
    platforms: ["Crunchyroll India", "Netflix India"],
    dubs: ["Japanese", "English"],
    highlight: "Complete collection from Season 1 to 'The Final Chapters' available in HD uncut.",
    searchTerms: ["attack on titan", "aot", "eren", "levi", "shingeki"]
  },
  {
    title: "Chainsaw Man",
    platforms: ["Crunchyroll India", "Netflix India"],
    dubs: ["Japanese", "English"],
    highlight: "Season 1 streaming in crisp HD. The Reze Arc movie has been officially announced!",
    searchTerms: ["chainsaw man", "csm", "denji", "makima", "reze", "pochita"]
  },
  {
    title: "Naruto & Shippuden",
    platforms: ["Netflix India", "JioCinema", "Sony YAY!"],
    dubs: ["Hindi Dub (JioCinema / Sony YAY!)", "English", "Japanese"],
    highlight: "All 500+ Shippuden episodes on Netflix. Selected Hindi-dubbed arcs available on JioCinema!",
    searchTerms: ["naruto", "shippuden", "sasuke", "kakashi", "hokage"]
  },
  {
    title: "Bleach: Thousand-Year Blood War",
    platforms: ["Disney+ Hotstar"],
    dubs: ["Japanese", "English"],
    highlight: "Exclusive streaming home for Bleach TYBW Part 1, 2, and 3 (The Conflict) in India!",
    searchTerms: ["bleach", "tybw", "ichigo", "thousand year blood war", "aizen"]
  },
  {
    title: "Death Note",
    platforms: ["Netflix India", "Amazon Prime Video"],
    dubs: ["English", "Japanese"],
    highlight: "Entire 37-episode psychological thriller masterpiece available in high definition.",
    searchTerms: ["death note", "light yagami", "ryuk", "kira", "l lawliet"]
  },
  {
    title: "Dragon Ball Super & Z",
    platforms: ["Crunchyroll India", "JioCinema"],
    dubs: ["Hindi Dub (DB Super on Crunchyroll)", "English", "Japanese"],
    highlight: "Dragon Ball Super has a dedicated Hindi dub available right on Crunchyroll India!",
    searchTerms: ["dragon ball", "dbz", "goku", "vegeta", "dragon ball super", "daima"]
  },
  {
    title: "Spy x Family",
    platforms: ["Netflix India", "Crunchyroll India", "Muse India (YouTube)"],
    dubs: ["Hindi Dub (Muse India YouTube)", "English", "Japanese"],
    highlight: "Watch free episodes with official Hindi dubs on Muse India's YouTube channel, or stream on Netflix!",
    searchTerms: ["spy x family", "anya", "loid", "yor", "forger"]
  },
  {
    title: "Dandadan",
    platforms: ["Netflix India", "Crunchyroll India"],
    dubs: ["Japanese", "English"],
    highlight: "Science SARU's mega supernatural comedy anime streaming globally and in India!",
    searchTerms: ["dandadan", "okarun", "momo", "turbo granny"]
  }
];

// --- ZEALPLANE SPOTLIGHT COMICS ---
const ZEAL_COMICS = [
  {
    id: "66fa7a6797ccce27918a5996",
    name: "Karma",
    tagline: "Indian Supernatural Dark Fantasy",
    desc: "When a soul so heavy with sin enters the realm, the cosmic scales of Karma physically shatter.",
    image: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1727715421/a084c03b-dff8-4905-a3be-3ffb8754a6db.jpg",
    genre: "dark_fantasy"
  },
  {
    id: "66e133bb75ca77f98991b36e",
    name: "Sando ki Duniya",
    tagline: "Desi Nostalgic Comedy & Fun",
    desc: "Hilarious, heartwarming adventures of Sando navigating quirky Indian neighbourhood dilemmas.",
    image: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1726051770/pivs18lxyq87z77fymn4.jpg",
    genre: "comedy"
  },
  {
    id: "chullu",
    name: "Chullu aur Lootera Bhoot",
    tagline: "Humour meets Ghostly Mystery",
    desc: "Chullu tackles mischievous spirits and unruly uncles with hilarious wits.",
    image: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1727715421/a084c03b-dff8-4905-a3be-3ffb8754a6db.jpg",
    genre: "comedy"
  }
];

const TavernBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  
  const logsEndRef = useRef(null);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const userId = localStorage.getItem("Id");

  // Fetch recent news articles for live chapter/spoiler lookup
  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/news`);
        if (Array.isArray(res.data)) {
          setNewsArticles(res.data.slice(0, 15));
        }
      } catch (err) {
        // Non-blocking fallback
      }
    };
    loadNews();
  }, [apiBaseUrl]);

  // Initialize greeting with high-utility choices
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addMessage("bot", "Aha! Welcome to the Multiverse Tavern! 🔮\nI am Mimir — your live manga release tracker, anime streaming oracle, and comic companion. What wisdom do you seek today?", {
        options: [
          { text: "📅 Manga Release Tracker (IST)", action: "release_calendar" },
          { text: "🔮 'What Should I Read?' Quiz", action: "start_quiz" },
          { text: "📺 Where to Watch Anime in India", action: "streaming_guide" },
          { text: "⚡ What's New on ZealPlane", action: "whats_new" },
          { text: "💎 Unlock Exclusive VIP Vault", action: "pitch_tiers" }
        ]
      });
    }
  }, [isOpen]);

  // Global event listener for triggers from Release Calendar page or nav
  useEffect(() => {
    const handleGlobalMimir = (e) => {
      setIsOpen(true);
      if (e && e.detail) {
        if (e.detail.action) {
          setTimeout(() => {
            handleAction(e.detail.action, e.detail.payload);
          }, 200);
        } else if (e.detail.query) {
          setTimeout(() => {
            processQuery(e.detail.query);
          }, 200);
        }
      }
    };
    window.addEventListener("openMimir", handleGlobalMimir);
    return () => window.removeEventListener("openMimir", handleGlobalMimir);
  }, [newsArticles]);

  // Auto scroll
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, loading]);

  const addMessage = (sender, text, extra = {}) => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...extra
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearOptions = () => {
    setMessages((prev) => 
      prev.map((msg) => ({
        ...msg,
        options: null,
        quizOptions: null
      }))
    );
  };

  // --- ACTIONS HANDLER ---
  const handleAction = async (actionType, payload = null) => {
    if (loading) return;
    clearOptions();

    // 1. RELEASE CALENDAR OVERVIEW
    if (actionType === "release_calendar") {
      addMessage("user", "📅 Show me Manga & Comic Release Schedule");
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", "📅 Verified Weekly Chapter Release Tracker (IST):\n\n" +
          "• 🏴‍☠️ One Piece 1192: Sundays 8:30 PM IST (MANGA Plus / Shonen Jump)\n" +
          "• 🪚 Chainsaw Man 198: Tuesdays 8:30 PM IST (MANGA Plus)\n" +
          "• 🗡️ Kagurabachi 74: Sundays 8:30 PM IST (Weekly Shonen Jump)\n" +
          "• ⚔️ Solo Leveling: Ragnarok: Wednesdays 10:30 PM IST (Webtoon)\n" +
          "• 🌀 Boruto: TBV 20: 20th of every month 8:30 PM IST (V-Jump)\n" +
          "• 🇮🇳 Sando ki Duniya (ZealPlane): Every Sunday 8:00 PM IST (Chapter 9 drops this Sunday!)\n\n" +
          "Which series would you like specific spoiler timing and details for?", {
          scheduleItems: MANGA_SCHEDULE,
          options: [
            { text: "🏴‍☠️ One Piece 1192 Intel", action: "filter_release", payload: "One Piece" },
            { text: "🪚 Chainsaw Man Status", action: "filter_release", payload: "Chainsaw Man" },
            { text: "⚔️ Solo Leveling Updates", action: "filter_release", payload: "Solo Leveling: Ragnarok" },
            { text: "🇮🇳 Sando ki Duniya (ZealPlane)", action: "filter_release", payload: "Sando ki Duniya (ZealPlane Original)" },
            { text: "🔮 Take Reading Quiz", action: "start_quiz" }
          ]
        });
        setLoading(false);
      }, 400);
    }

    // 2. SPECIFIC SERIES RELEASE FILTER
    else if (actionType === "filter_release") {
      const match = MANGA_SCHEDULE.find((item) => 
        item.title.toLowerCase().includes(payload.toLowerCase()) || 
        payload.toLowerCase().includes(item.title.toLowerCase())
      );
      addMessage("user", `Check release for ${payload}`);
      setLoading(true);

      setTimeout(() => {
        if (match) {
          addMessage("bot", `✨ ${match.icon} ${match.title} Schedule:\n\n` +
            `• Next Up: ${match.nextChapter}\n` +
            `• Release Timing: ${match.day} at ${match.timeIST}\n` +
            `• Official Publisher: ${match.platform}\n` +
            `• Insider Intel: ${match.spoilers}\n` +
            `• Status: ${match.status}`, {
            cta: match.isZealPlane 
              ? { text: `Read ${match.title} on ZealPlane`, url: `/details/${match.projectId}` }
              : { text: "Browse Deep Dives on ZealPlane News", url: "/news" },
            options: [
              { text: "📅 Check Another Series", action: "release_calendar" },
              { text: "📺 Where to Watch Anime", action: "streaming_guide" }
            ]
          });
        } else {
          addMessage("bot", `I couldn't find an exact match for "${payload}", but I track One Piece, Chainsaw Man, Solo Leveling, Kagurabachi, Boruto, and ZealPlane Originals!`, {
            options: [
              { text: "📅 View Full Release Calendar", action: "release_calendar" }
            ]
          });
        }
        setLoading(false);
      }, 400);
    }

    // 3. WHERE TO WATCH ANIME IN INDIA (STREAMING GUIDE)
    else if (actionType === "streaming_guide") {
      addMessage("user", "📺 Where can I watch anime in India?");
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", "📺 Indian Legal Anime Streaming & Regional Dubs Guide:\n\n" +
          "Here are verified OTT platforms & Hindi/Tamil/Telugu dub availability for India. Click a title below to inspect, or type any anime name:", {
          streamingHighlights: STREAMING_GUIDE.slice(0, 4),
          options: [
            { text: "⚔️ Demon Slayer (Hindi/Tamil/Telugu)", action: "check_stream", payload: "Demon Slayer" },
            { text: "👁️ Jujutsu Kaisen (Hindi Dub)", action: "check_stream", payload: "Jujutsu Kaisen" },
            { text: "🗡️ Solo Leveling (Hindi Dub)", action: "check_stream", payload: "Solo Leveling" },
            { text: "🏴‍☠️ One Piece (Netflix / Crunchyroll)", action: "check_stream", payload: "One Piece" },
            { text: "🩸 Bleach: TYBW (Disney+ Hotstar)", action: "check_stream", payload: "Bleach" },
            { text: "🍥 Naruto (JioCinema / Netflix)", action: "check_stream", payload: "Naruto" }
          ]
        });
        setLoading(false);
      }, 400);
    }

    // 4. CHECK SPECIFIC ANIME STREAMING
    else if (actionType === "check_stream") {
      const match = STREAMING_GUIDE.find((item) => 
        item.title.toLowerCase().includes(payload.toLowerCase()) ||
        item.searchTerms.some(term => payload.toLowerCase().includes(term))
      );
      addMessage("user", `Where to watch ${payload} in India?`);
      setLoading(true);

      setTimeout(() => {
        if (match) {
          addMessage("bot", `📺 Where to Watch ${match.title} in India:\n\n` +
            `• Legal OTT Platforms: ${match.platforms.join(" • ")}\n` +
            `• Audio / Dubs Available: ${match.dubs.join(", ")}\n\n` +
            `💡 Note: ${match.highlight}`, {
            options: [
              { text: "📺 Check Another Anime", action: "streaming_guide" },
              { text: "🔮 Recommend an Indie Comic Like This", action: "start_quiz" }
            ]
          });
        } else {
          addMessage("bot", `For "${payload}", most new simulcasts stream on Crunchyroll India and Netflix India, while select shonen classics (like Bleach TYBW) stream on Disney+ Hotstar. Type another title!`, {
            options: [
              { text: "📺 Back to Anime Streaming Guide", action: "streaming_guide" }
            ]
          });
        }
        setLoading(false);
      }, 400);
    }

    // 5. INTERACTIVE READING QUIZ (3-STEP PERSONALIZED MATCHER)
    else if (actionType === "start_quiz") {
      addMessage("user", "🔮 What should I read next?");
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", "🔮 Step 1 of 3: What genre or universe are you craving right now?", {
          options: [
            { text: "⚔️ High-Octane Action & Battle", action: "quiz_step_2", payload: { genre: "action", genreName: "Action & Battle" } },
            { text: "🌑 Dark Fantasy, Karma & Supernatural", action: "quiz_step_2", payload: { genre: "dark_fantasy", genreName: "Dark Fantasy" } },
            { text: "🧠 Psychological Mystery & Mind Games", action: "quiz_step_2", payload: { genre: "mystery", genreName: "Psychological Mystery" } },
            { text: "😂 Desi Humor, Gags & Nostalgia", action: "quiz_step_2", payload: { genre: "comedy", genreName: "Desi Comedy & Nostalgia" } }
          ]
        });
        setLoading(false);
      }, 400);
    }

    else if (actionType === "quiz_step_2") {
      const { genre, genreName } = payload;
      addMessage("user", `I'm craving: ${genreName}`);
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", `🔮 Step 2 of 3: What kind of reading experience do you want?`, {
          options: [
            { text: "⚡ Fast-Paced Binge (< 15 mins)", action: "quiz_step_3", payload: { ...payload, pace: "quick" } },
            { text: "📚 Deep Ongoing Multiverse Lore", action: "quiz_step_3", payload: { ...payload, pace: "epic" } }
          ]
        });
        setLoading(false);
      }, 400);
    }

    else if (actionType === "quiz_step_3") {
      const paceLabel = payload.pace === "quick" ? "Fast-Paced Binge" : "Deep Multiverse Lore";
      addMessage("user", `Reading style: ${paceLabel}`);
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", `🔮 Step 3 of 3: What's your origin preference?`, {
          options: [
            { text: "🇮🇳 Original Indian Indie Comics", action: "quiz_result", payload: { ...payload, origin: "indian" } },
            { text: "🇯🇵 Mainstream Manga / Anime Style", action: "quiz_result", payload: { ...payload, origin: "manga" } },
            { text: "🌟 The Ultimate Combo (Give Me Both!)", action: "quiz_result", payload: { ...payload, origin: "both" } }
          ]
        });
        setLoading(false);
      }, 400);
    }

    else if (actionType === "quiz_result") {
      const { genre } = payload;
      addMessage("user", "Reveal my perfect comic match!");
      setLoading(true);

      setTimeout(() => {
        if (genre === "dark_fantasy") {
          addMessage("bot", "🏆 Your Tailored Match: KARMA + Jujutsu Kaisen!\n\n" +
            "• Indian Indie Pick: KARMA (by Magha Studio)\n" +
            "When a soul weighed down by unpayable sin enters the realm, the cosmic scales of Karma shatter. Visceral Indian dark fantasy.\n\n" +
            "• Mainstream Manga Companion: Jujutsu Kaisen\n" +
            "Dive into curses, binding vows, and devastating supernatural clashes.", {
            cta: { text: "Start Reading KARMA Chapter 1 ➜", url: "/details/66fa7a6797ccce27918a5996" },
            options: [
              { text: "📅 Check Manga Release Dates", action: "release_calendar" },
              { text: "🔮 Retake Reading Quiz", action: "start_quiz" }
            ]
          });
        } else if (genre === "mystery") {
          addMessage("bot", "🏆 Your Tailored Match: GHOST IN THE CROWD + Death Note!\n\n" +
            "• Indian Indie Pick: Ghost in the Crowd (by Prince Ayush)\n" +
            "A chilling psychological puzzle where nothing is what it seems and paranoia reigns.\n\n" +
            "• Mainstream Manga Companion: Death Note / Monster\n" +
            "Cat-and-mouse psychological warfare with unforgiving consequences.", {
            cta: { text: "Browse Mystery on ZealPlane ➜", url: "/" },
            options: [
              { text: "📅 Check Manga Release Dates", action: "release_calendar" },
              { text: "🔮 Retake Reading Quiz", action: "start_quiz" }
            ]
          });
        } else if (genre === "comedy") {
          addMessage("bot", "🏆 Your Tailored Match: SANDO KI DUNIYA + Sakamoto Days!\n\n" +
            "• Indian Indie Pick: Sando ki Duniya\n" +
            "Laugh-out-loud relatable Bharat comedy! Chapter 9 'इडली-डोसा' drops this Sunday.\n\n" +
            "• Mainstream Manga Companion: Sakamoto Days / Gintama\n" +
            "Hilarious everyday absurdities blended with unexpected charm.", {
            cta: { text: "Read Sando ki Duniya Now ➜", url: "/details/66e133bb75ca77f98991b36e" },
            options: [
              { text: "📅 Check Manga Release Dates", action: "release_calendar" },
              { text: "⚡ What's New on ZealPlane", action: "whats_new" }
            ]
          });
        } else {
          // Action default
          addMessage("bot", "🏆 Your Tailored Match: KARMA + Solo Leveling!\n\n" +
            "• Indian Indie Pick: KARMA\n" +
            "Furious combat against ancient spiritual entities and broken cosmic orders.\n\n" +
            "• Mainstream Manga Companion: Solo Leveling & Kagurabachi\n" +
            "Unstoppable power progression and high-octane revenge.", {
            cta: { text: "Start Reading KARMA ➜", url: "/details/66fa7a6797ccce27918a5996" },
            options: [
              { text: "📅 Check Manga Release Dates", action: "release_calendar" },
              { text: "📺 Where to Watch Anime", action: "streaming_guide" }
            ]
          });
        }
        setLoading(false);
      }, 500);
    }

    // 6. WHAT'S NEW ON ZEALPLANE
    else if (actionType === "whats_new") {
      addMessage("user", "⚡ What's new on ZealPlane?");
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", "⚡ Fresh Drops & Updates Across ZealPlane:\n\n" +
          "1. 🇮🇳 Sando ki Duniya — New episodes drop every Sunday at 8:00 PM IST! Read Ch 1-8 free now.\n" +
          "2. ⚖️ Karma — Expanded story chapters & exclusive motion comic art in the VIP Vault.\n" +
          "3. 👻 Ghost in the Crowd & Chullu — Reader favorites with high dwell times.\n" +
          "4. 📰 Breaking News & Analysis — Daily editorial breakdowns on One Piece 1191/1192, Chainsaw Man, and Indian pop culture.", {
          options: [
            { text: "📖 Read Sando ki Duniya", action: "route_to_comic", payload: "66e133bb75ca77f98991b36e" },
            { text: "📖 Read Karma", action: "route_to_comic", payload: "66fa7a6797ccce27918a5996" },
            { text: "📰 Browse Latest News", action: "route_to_page", payload: "/news" },
            { text: "💎 Unlock VIP Vault", action: "pitch_tiers" }
          ]
        });
        setLoading(false);
      }, 400);
    }

    // 7. RECOMMENDATIONS
    else if (actionType === "recommend") {
      addMessage("user", "🔥 What's trending right now?");
      setLoading(true);
      try {
        const url = userId 
          ? `${apiBaseUrl}/behavior/recommendations?userId=${userId}`
          : `${apiBaseUrl}/behavior/recommendations`;
        
        const response = await axios.get(url);
        const list = response.data || [];
        
        if (list.length > 0) {
          addMessage("bot", "Here are the top-trending reader favorites right now! Click one to start reading instantly:", {
            recommendations: list.slice(0, 3)
          });
        } else {
          addMessage("bot", "Karma and Sando ki Duniya are the most-read series this week! Start Chapter 1 below:", {
            recommendations: [
              { _id: "66fa7a6797ccce27918a5996", name: "Karma", thumbnailImage: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1727715421/a084c03b-dff8-4905-a3be-3ffb8754a6db.jpg" },
              { _id: "66e133bb75ca77f98991b36e", name: "Sando ki Duniya", thumbnailImage: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1726051770/pivs18lxyq87z77fymn4.jpg" }
            ]
          });
        }
      } catch (err) {
        addMessage("bot", "Karma is blowing up right now! Check out Chapter 1:", {
          recommendations: [
            { _id: "66fa7a6797ccce27918a5996", name: "Karma", thumbnailImage: "https://res.cloudinary.com/dwyxugmw2/image/upload/v1727715421/a084c03b-dff8-4905-a3be-3ffb8754a6db.jpg" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    // 8. VIP ACCESS & CREATOR VAULT
    else if (actionType === "pitch_tiers") {
      addMessage("user", "💎 Tell me about VIP Access");
      setLoading(true);
      setTimeout(() => {
        addMessage("bot", "Supporting indie creators directly on ZealPlane unlocks the exclusive Vault!\n\n" +
          "• ₹1 Ultimate Tier: Full comic access, early chapter drops, 15% discount on physical hard copies, motion comics, and behind-the-scenes concept art.\n\n" +
          "Which project do you want to back today?", {
          options: [
            { text: "Support 'Karma'", action: "route_to_comic", payload: "66fa7a6797ccce27918a5996" },
            { text: "Support 'Sando ki Duniya'", action: "route_to_comic", payload: "66e133bb75ca77f98991b36e" }
          ]
        });
        setLoading(false);
      }, 400);
    }

    // 9. ROUTING HELPERS
    else if (actionType === "route_to_comic") {
      if (payload && payload !== "null" && payload !== "undefined") {
        navigate(`/details/${payload}`);
        setIsOpen(false);
      }
    } else if (actionType === "route_to_page") {
      if (payload) {
        navigate(payload);
        setIsOpen(false);
      }
    }
  };

  // --- NATURAL LANGUAGE PROCESSOR ---
  const processQuery = (rawQuery) => {
    if (!rawQuery || !rawQuery.trim()) return;
    const query = rawQuery.trim();
    addMessage("user", query);
    clearOptions();

    const lower = query.toLowerCase();
    setLoading(true);

    setTimeout(() => {
      // 1. Check for Chapter Release queries
      if (
        lower.includes("release") || 
        lower.includes("when does") || 
        lower.includes("when will") || 
        lower.includes("schedule") || 
        lower.includes("calendar") || 
        lower.includes("drop") || 
        lower.includes("out yet")
      ) {
        // Specific manga check
        const matchedManga = MANGA_SCHEDULE.find((m) => 
          m.searchTerms.some((term) => lower.includes(term))
        );

        if (matchedManga) {
          handleAction("filter_release", matchedManga.title);
        } else {
          handleAction("release_calendar");
        }
      }

      // 2. Check for Streaming / Watch queries
      else if (
        lower.includes("watch") || 
        lower.includes("stream") || 
        lower.includes("hindi dub") || 
        lower.includes("netflix") || 
        lower.includes("crunchyroll") || 
        lower.includes("hotstar") || 
        lower.includes("jiocinema") || 
        lower.includes("ott")
      ) {
        const matchedAnime = STREAMING_GUIDE.find((a) => 
          a.searchTerms.some((term) => lower.includes(term))
        );

        if (matchedAnime) {
          handleAction("check_stream", matchedAnime.title);
        } else {
          handleAction("streaming_guide");
        }
      }

      // 3. Check for specific popular series mentions directly
      else if (lower.includes("one piece") || lower.includes("luffy") || lower.includes("1191") || lower.includes("1192")) {
        handleAction("filter_release", "One Piece");
      }
      else if (lower.includes("chainsaw man") || lower.includes("denji") || lower.includes("reze")) {
        handleAction("filter_release", "Chainsaw Man");
      }
      else if (lower.includes("solo leveling") || lower.includes("jinwoo")) {
        handleAction("filter_release", "Solo Leveling: Ragnarok");
      }
      else if (lower.includes("demon slayer") || lower.includes("tanjiro")) {
        handleAction("check_stream", "Demon Slayer");
      }
      else if (lower.includes("jjk") || lower.includes("jujutsu") || lower.includes("gojo") || lower.includes("sukuna")) {
        handleAction("check_stream", "Jujutsu Kaisen");
      }
      else if (lower.includes("sando")) {
        handleAction("filter_release", "Sando ki Duniya (ZealPlane Original)");
      }
      else if (lower.includes("karma")) {
        handleAction("filter_release", "Karma (ZealPlane Original)");
      }

      // 4. Check for News / Spoilers / Articles
      else if (lower.includes("news") || lower.includes("spoiler") || lower.includes("article") || lower.includes("gta")) {
        const matchingNews = newsArticles.find((art) => {
          const t = (art.title || "").toLowerCase();
          const c = (art.content || "").toLowerCase();
          const words = lower.split(" ").filter(w => w.length > 3);
          return words.some(w => t.includes(w) || c.includes(w));
        });

        if (matchingNews) {
          addMessage("bot", `📰 Live ZealPlane Editorial Match:\n\n"${matchingNews.title}"\n\nOur editorial team has covered this in detail. Click below to read the full report:`, {
            cta: { text: "Read Full Article & Spoilers ➜", url: `/news/${matchingNews.slug || matchingNews._id}` },
            options: [
              { text: "📅 Check Manga Release Schedule", action: "release_calendar" },
              { text: "📺 Where to Watch Anime", action: "streaming_guide" }
            ]
          });
        } else {
          handleAction("whats_new");
        }
      }

      // 5. Check for Quiz / Recommendations
      else if (
        lower.includes("recommend") || 
        lower.includes("what should i read") || 
        lower.includes("suggest") || 
        lower.includes("bored") || 
        lower.includes("quiz") || 
        lower.includes("what to read")
      ) {
        handleAction("start_quiz");
      }

      // 6. Check for VIP / Tiers / Buy
      else if (
        lower.includes("buy") || 
        lower.includes("purchase") || 
        lower.includes("support") || 
        lower.includes("money") || 
        lower.includes("tier") || 
        lower.includes("vip") || 
        lower.includes("price")
      ) {
        handleAction("pitch_tiers");
      }

      // 7. Check for What's New
      else if (lower.includes("what's new") || lower.includes("whats new") || lower.includes("latest") || lower.includes("fresh")) {
        handleAction("whats_new");
      }

      // 8. Smart Default: Helpful Utility Portal
      else {
        addMessage("bot", `I hear you, adventurer! 🔮 I am Mimir — your anime and comic intelligence guide. How can I assist you right now?`, {
          options: [
            { text: "📅 Manga Release Calendar (IST)", action: "release_calendar" },
            { text: "🔮 'What Should I Read?' Quiz", action: "start_quiz" },
            { text: "📺 Where to Watch Anime in India", action: "streaming_guide" },
            { text: "⚡ What's New on ZealPlane", action: "whats_new" }
          ]
        });
      }
      setLoading(false);
    }, 450);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");
    processQuery(text);
  };

  return (
    <div className="tavernbot-wrapper">
      {isOpen && (
        <div className="tavernbot-window">
          {/* Header */}
          <div className="tavernbot-header">
            <div className="tavernbot-profile">
              <div className="avatar-glow"><span>🔮</span></div>
              <div className="bot-details">
                <h3>Mimir</h3>
                <span>Release Tracker & Comic Oracle</span>
              </div>
            </div>
            <button 
              className="tavernbot-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Mimir"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="tavernbot-logs">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-bubble">
                  <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>

                  {/* Schedule Cards Display */}
                  {msg.scheduleItems && (
                    <div className="tavernbot-schedule-list">
                      {msg.scheduleItems.slice(0, 3).map((item) => (
                        <div 
                          key={item.id} 
                          className="tavernbot-schedule-card"
                          onClick={() => handleAction("filter_release", item.title)}
                        >
                          <div className="card-top">
                            <span className="card-icon">{item.icon}</span>
                            <span className="card-title">{item.title}</span>
                            <span className="card-badge">{item.day}</span>
                          </div>
                          <div className="card-bottom">
                            <span className="timing"><FaClock size={10} /> {item.timeIST}</span>
                            <span className="chapter">{item.nextChapter}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Streaming Highlights Display */}
                  {msg.streamingHighlights && (
                    <div className="tavernbot-streaming-list">
                      {msg.streamingHighlights.map((stream, idx) => (
                        <div 
                          key={idx} 
                          className="tavernbot-streaming-card"
                          onClick={() => handleAction("check_stream", stream.title)}
                        >
                          <div className="stream-title">{stream.title}</div>
                          <div className="stream-badges">
                            {stream.platforms.map((p, pIdx) => (
                              <span key={pIdx} className="platform-tag">{p}</span>
                            ))}
                            {stream.dubs.some(d => d.includes("Hindi")) && (
                              <span className="dub-tag">🎙️ Hindi Dub</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comic Recommendations Display */}
                  {msg.recommendations && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                      {msg.recommendations.map((item) => (
                        <div 
                          key={item._id || item.projectId} 
                          className="chat-comic-card funnel-card" 
                          onClick={() => {
                            navigate(`/details/${item.projectId || item._id}`);
                            setIsOpen(false);
                          }}
                        >
                          <img src={item.thumbnailImage || item.image} alt={item.name} />
                          <div className="card-info">
                            <h4>{item.name}</h4>
                            <button className="read-now-btn">Start Reading <FaBookOpen size={10} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action CTA Button */}
                  {msg.cta && (
                    <button 
                      className="funnel-cta-btn" 
                      onClick={() => {
                        navigate(msg.cta.url);
                        setIsOpen(false);
                      }}
                    >
                      {msg.cta.text} <FaBolt />
                    </button>
                  )}

                  {/* Options List */}
                  {msg.options && (
                    <div className="tavernbot-quiz-options">
                      {msg.options.map((opt, i) => (
                        <button 
                          key={i} 
                          className="funnel-option-btn" 
                          onClick={() => handleAction(opt.action, opt.payload)}
                        >
                          <span>{opt.text}</span>
                          <span>➜</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            ))}
            
            {loading && (
              <div className="message-wrapper bot">
                <div className="message-bubble">
                  <span style={{ fontSize: "11px", color: "#00ffff", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaClock className="spin-icon" /> Mimir is consulting the multiverse archives...
                  </span>
                </div>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="tavernbot-quickactions">
            <div className="action-chip" onClick={() => handleAction("release_calendar")}>
              <FaCalendarAlt size={10} /> 📅 Releases
            </div>
            <div className="action-chip" onClick={() => handleAction("start_quiz")}>
              <FaQuestionCircle size={10} /> 🔮 Read Quiz
            </div>
            <div className="action-chip" onClick={() => handleAction("streaming_guide")}>
              <FaTv size={10} /> 📺 Where to Watch
            </div>
            <div className="action-chip" onClick={() => handleAction("whats_new")}>
              <FaFire size={10} /> ⚡ What's New
            </div>
            <div className="action-chip" onClick={() => handleAction("pitch_tiers")}>
              <FaCrown size={10} /> 💎 VIP Vault
            </div>
          </div>

          {/* Input Bar */}
          <form className="tavernbot-inputbar" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Ask: 'One piece release date', 'Where to watch demon slayer'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !inputText.trim()} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <div 
        className="tavernbot-launcher" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Mimir anime and comic guide"
      >
        <FaCommentDots className="tavernbot-icon" />
        <span className="tavernbot-hint">Release tracker & Comic guide 🔮</span>
      </div>
    </div>
  );
};

export default TavernBot;
