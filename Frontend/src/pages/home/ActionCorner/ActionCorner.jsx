import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics, isHindiComic } from "../../../utils/deduplicateComics";

const ActionCorner = ({ comicLang = "all" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAction = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        let actionComics = (res.data || []).filter((p) => {
          if (!p.name || !p.thumbnailImage) return false;

          const nameLower = p.name.toLowerCase();
          const tagsLower = (p.tags || []).map((t) => t.toLowerCase());
          const subtagsLower = (p.subtags || []).map((s) => s.toLowerCase());

          const isActionTag =
            tagsLower.includes("action") ||
            tagsLower.includes("shonen") ||
            tagsLower.includes("superhero") ||
            tagsLower.includes("martial arts") ||
            subtagsLower.includes("action") ||
            subtagsLower.includes("superhero");

          const isActionName =
            nameLower.includes("kaalverse") ||
            nameLower.includes("vajrayoddha") ||
            nameLower.includes("prana") ||
            nameLower.includes("vidyut") ||
            nameLower.includes("boy detective") ||
            nameLower.includes("spiderman") ||
            nameLower.includes("karate") ||
            nameLower.includes("billionaire") ||
            nameLower.includes("forgotten fragments");

          return isActionTag || isActionName;
        });

        // Language filter
        if (comicLang === "hi") {
          actionComics = actionComics.filter((p) => isHindiComic(p));
        } else if (comicLang === "en") {
          actionComics = actionComics.filter((p) => !isHindiComic(p));
        }

        // Sort to prioritize flagship action titles: Kaalverse, Billionaire, PRANA, etc.
        const sortedAction = [...actionComics].sort((a, b) => {
          const aName = (a.name || "").toLowerCase();
          const bName = (b.name || "").toLowerCase();
          
          // Boost Kaalverse and Billionaire to the top
          const aPriority = aName.includes("kaalverse") ? 100 : aName.includes("billionaire") ? 90 : aName.includes("prana") ? 80 : 0;
          const bPriority = bName.includes("kaalverse") ? 100 : bName.includes("billionaire") ? 90 : bName.includes("prana") ? 80 : 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;

          const aPages = a.comicPages?.length || 0;
          const bPages = b.comicPages?.length || 0;
          if (aPages !== bPages) return bPages - aPages;
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
          return bTime - aTime;
        });

        setData(deduplicateComics(sortedAction));
      } catch (error) {
        console.error("Error fetching action comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAction();
  }, [apiBaseUrl, comicLang]);

  if (!loading && data.length === 0) return null;

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="Action & Superhero Manga"
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default ActionCorner;
