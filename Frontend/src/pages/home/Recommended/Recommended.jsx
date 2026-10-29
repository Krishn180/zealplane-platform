import React, { useEffect, useState } from "react";
import axios from "axios";
import DemoCarousel from "../../../components/carousel/DemoCarousel";

const Recommended = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("Id");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const url = userId 
          ? `${apiBaseUrl}/behavior/recommendations?userId=${userId}`
          : `${apiBaseUrl}/behavior/recommendations`;
          
        const response = await axios.get(url);
        setRecommendations(response.data || []);
      } catch (error) {
        console.error("Error fetching recommended items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, apiBaseUrl]);

  if (!loading && recommendations.length === 0) {
    return null; // hide section if no recommendations are found
  }

  return (
    <div className="carouselSection" style={{ marginBottom: "30px" }}>
      <DemoCarousel
        title="Recommended For You ✨"
        data={recommendations}
        loading={loading}
      />
    </div>
  );
};

export default Recommended;
