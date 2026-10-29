import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics } from "../../../utils/deduplicateComics";

const HorrorCorner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchHorror = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        const horrorComics = (res.data || []).filter((p) => {
          if (!p.name || !p.thumbnailImage) return false;

          const nameLower = p.name.toLowerCase();
          const tagsLower = (p.tags || []).map((t) => t.toLowerCase());
          const subtagsLower = (p.subtags || []).map((s) => s.toLowerCase());

          const isHorrorTag =
            tagsLower.includes("horror") ||
            tagsLower.includes("mystery") ||
            tagsLower.includes("thriller") ||
            tagsLower.includes("supernatural") ||
            subtagsLower.includes("horror") ||
            subtagsLower.includes("mystery") ||
            subtagsLower.includes("thriller");

          const isHorrorName =
            nameLower.includes("karma") ||
            nameLower.includes("horror") ||
            nameLower.includes("khaufnaak") ||
            nameLower.includes("khoufnaak") ||
            nameLower.includes("ghost") ||
            nameLower.includes("cupboard") ||
            nameLower.includes("dupatta") ||
            nameLower.includes("scarf") ||
            nameLower.includes("kisse") ||
            nameLower.includes("anklets") ||
            nameLower.includes("bhoot") ||
            nameLower.includes("recliche") ||
            nameLower.includes("terror") ||
            nameLower.includes("chilling");

          return isHorrorTag || isHorrorName;
        });

        // Sort to prioritize chapters with actual pages and recent updates
        const sortedHorror = [...horrorComics].sort((a, b) => {
          const aPages = a.comicPages?.length || 0;
          const bPages = b.comicPages?.length || 0;
          if (aPages !== bPages) return bPages - aPages;
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
          return bTime - aTime;
        });

        setData(deduplicateComics(sortedHorror));
      } catch (error) {
        console.error("Error fetching horror comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorror();
  }, [apiBaseUrl]);

  if (!loading && data.length === 0) return null;

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="Horror, Mystery & Supernatural"
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default HorrorCorner;
