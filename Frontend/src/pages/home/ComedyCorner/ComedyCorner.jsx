import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics } from "../../../utils/deduplicateComics";

const ComedyCorner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchComedy = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        const comedyComics = (res.data || []).filter((p) => {
          if (!p.name || !p.thumbnailImage) return false;

          const nameLower = p.name.toLowerCase();
          const tagsLower = (p.tags || []).map((t) => t.toLowerCase());
          const subtagsLower = (p.subtags || []).map((s) => s.toLowerCase());

          const isComedyTag =
            tagsLower.includes("comedy") ||
            tagsLower.includes("humor") ||
            tagsLower.includes("digest") ||
            tagsLower.includes("gag") ||
            subtagsLower.includes("comedy");

          const isComedyName =
            nameLower.includes("chullu") ||
            nameLower.includes("pagla") ||
            nameLower.includes("sando") ||
            nameLower.includes("hittu") ||
            nameLower.includes("guddu") ||
            nameLower.includes("pepper") ||
            nameLower.includes("twelve labors") ||
            nameLower.includes("dadu") ||
            nameLower.includes("पगला") ||
            nameLower.includes("दादू") ||
            nameLower.includes("सांडो");

          return isComedyTag || isComedyName;
        });

        // Sort to prioritize chapters with actual pages
        const sortedComedy = [...comedyComics].sort((a, b) => {
          const aPages = a.comicPages?.length || 0;
          const bPages = b.comicPages?.length || 0;
          if (aPages !== bPages) return bPages - aPages;
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
          return bTime - aTime;
        });

        setData(deduplicateComics(sortedComedy));
      } catch (error) {
        console.error("Error fetching comedy comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComedy();
  }, [apiBaseUrl]);

  if (!loading && data.length === 0) return null;

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="Comedy & Classic Digest"
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default ComedyCorner;
