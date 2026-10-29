import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics, isHindiComic } from "../../../utils/deduplicateComics";

const EditorsPicks = ({ comicLang = "all" }) => {
  const [data, setData] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchEditorsPicks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        const projects = res.data || [];
        setRawProjects(projects);
      } catch (error) {
        console.error("Error fetching Editor's Picks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditorsPicks();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (rawProjects.length === 0) return;

    // Curated list of high-quality flagship titles with Kaalverse and Billionaire side by side
    const priorityNames = [
      "karma",
      "kaalverse",
      "billionaire",
      "poor boy become billionaire",
      "chullu parilok me",
      "chullu aur lootera",
      "prana",
      "vajrayoddha",
      "the girl inside the cupboard",
      "pepper & carrot",
      "ghost in the crowd",
      "forgotten fragments",
      "when horror meets humour"
    ];

    let picked = [];
    const seenSlugs = new Set();

    for (const target of priorityNames) {
      const match = rawProjects.find((p) => {
        if (!p.name || !p.thumbnailImage) return false;
        return p.name.toLowerCase().includes(target);
      });

      if (match && !seenSlugs.has(match._id)) {
        seenSlugs.add(match._id);
        picked.push(match);
      }
    }

    // Apply language filter
    if (comicLang === "hi") {
      picked = picked.filter((p) => isHindiComic(p));
    } else if (comicLang === "en") {
      picked = picked.filter((p) => !isHindiComic(p));
    }

    setData(deduplicateComics(picked));
  }, [rawProjects, comicLang]);

  if (!loading && data.length === 0) return null;

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="Editor's Picks"
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default EditorsPicks;
