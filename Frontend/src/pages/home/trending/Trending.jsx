import React, { useState, useEffect } from "react";
import axios from "axios";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import DemoCarausel from "../../../components/carousel/DemoCarousel";
import { deduplicateComics } from "../../../utils/deduplicateComics";

const Trending = () => {
    const [endpoint, setEndpoint] = useState("day");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiBaseUrl}/projects`);
                const sorted = (res.data || [])
                    .filter(p => p.name && p.thumbnailImage)
                    .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)));

                // Use shared dedup — handles Episode X, Chapter X, Part X, #N, (English), etc.
                setData(deduplicateComics(sorted));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiBaseUrl]);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Day" ? "day" : "week");
    };

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
            </ContentWrapper>

            <DemoCarausel data={data} loading={loading} />
        </div>
    );
};

export default Trending;
