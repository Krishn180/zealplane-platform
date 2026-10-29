import React, { useState, useEffect } from "react";
import axios from "axios";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import CarouselUser from "../../../components/carousel/CarouselUser";

const Curated = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/news`);
        const rawArticles = res.data?.articles || (Array.isArray(res.data) ? res.data : []);
        
        // SORT STRICTLY NEWEST FIRST
        const sorted = [...rawArticles].sort((a, b) => {
          const dtA = new Date(a.createdAt || a.date || 0);
          const dtB = new Date(b.createdAt || b.date || 0);
          return dtB - dtA;
        });

        setData(sorted);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiBaseUrl]);

  return (
    <div className="carouselSection">
      <CarouselUser 
        title="Latest Breaking News & Anime Drops" 
        data={data} 
        loading={loading} 
      />
    </div>
  );
};

export default Curated;
