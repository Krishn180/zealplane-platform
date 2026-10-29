import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics, isHindiComic } from "../../../utils/deduplicateComics";

const NewlyReleased = ({ comicLang = "all" }) => {
  const [data, setData] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRecentProjects = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        const projects = res.data || [];
        
        // SORT STRICTLY BY NEWEST RELEASE / CREATED AT
        const sorted = [...projects]
          .filter(p => p.name && p.thumbnailImage)
          .sort((a, b) => {
            const dtA = new Date(a.createdAt || a.updatedAt || 0);
            const dtB = new Date(b.createdAt || b.updatedAt || 0);
            return dtB - dtA;
          });

        setRawProjects(sorted);
      } catch (error) {
        console.error("Error fetching Newly Released Comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (rawProjects.length === 0) return;

    let filtered = [...rawProjects];

    // Apply language filter
    if (comicLang === "hi") {
      filtered = filtered.filter((p) => isHindiComic(p));
    } else if (comicLang === "en") {
      filtered = filtered.filter((p) => !isHindiComic(p));
    }

    // Mark as newly released items
    const deduped = deduplicateComics(filtered).map(comic => ({
      ...comic,
      isNewRelease: true
    }));

    setData(deduped);
  }, [rawProjects, comicLang]);

  if (!loading && data.length === 0) return null;

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="🆕 Newly Released Comics & Chapters"
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default NewlyReleased;
