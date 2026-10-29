import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import PosterFallback from "../../assets/no-poster.png";
import "./newsCarousel.scss";

const CarouselUser = ({ title, data = [], loading = true }) => {
  const carouselContainer = useRef();

  const navigation = (dir) => {
    const container = carouselContainer.current;
    if (!container) return;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth * 0.8)
        : container.scrollLeft + (container.offsetWidth * 0.8);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://www.zealplane.com${url}`;
    return `https://www.zealplane.com/${url}`;
  };

  const getItemCoverImage = (item) => {
    const raw = item.coverImage || item.image;
    if (raw && raw.trim() !== "" && !raw.includes("og-image.jpg")) {
      return getFullImageUrl(raw);
    }
    if (item.content) {
      const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return getFullImageUrl(match[1]);
      }
    }
    return getFullImageUrl(raw) || "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg";
  };

  const isRecent = (dateStr) => {
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - itemDate) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 72; // Within last 3 days
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return "Today";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="newsCarouselSection">
      <ContentWrapper>
        <div className="carouselHeader">
          {title && (
            <div className="carouselTitleGroup">
              <span className="carouselTitle">📰 {title}</span>
              <span className="liveUpdateBadge">
                <span className="liveDot"></span> Updated Daily
              </span>
            </div>
          )}
          <div className="carouselNavBtns">
            <BsFillArrowLeftCircleFill
              className="arrow leftNav"
              onClick={() => navigation("left")}
            />
            <BsFillArrowRightCircleFill
              className="arrow rightNav"
              onClick={() => navigation("right")}
            />
          </div>
        </div>

        {!loading ? (
          <div className="newsCarouselItems" ref={carouselContainer}>
            {data.map((item) => {
              const cover = getItemCoverImage(item);
              const isItemNew = isRecent(item.createdAt);
              
              return (
                <div key={item._id || item.slug || Math.random()} className="newsCarouselCard">
                  <Link to={`/news/${item.slug}`} className="newsCardLink">
                    <div className="newsCardCoverBlock">
                      <img
                        src={cover}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = PosterFallback;
                        }}
                      />
                      {isItemNew && (
                        <div className="newsNewReleaseBadge">
                          🔥 NEW
                        </div>
                      )}
                      <div className="newsDateTag">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>

                    <div className="newsCardMeta">
                      <div className="authorLine">
                        <span className="authorAvatar">
                          {(item.author || "Z")[0].toUpperCase()}
                        </span>
                        <span className="authorName">{(item.author || "Krishna Kumar").split(/[—|-]/)[0].trim()}</span>
                      </div>
                      <span className="readTime">{calculateReadTime(item.content)}</span>
                    </div>

                    <div className="newsCardTitleBlock">
                      <h3 className="newsCardTitle">{item.title}</h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="newsLoadingSkeleton">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="newsSkeletonCard">
                <div className="skeletonCover skeleton"></div>
                <div className="skeletonMeta skeleton"></div>
                <div className="skeletonTitle skeleton"></div>
              </div>
            ))}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default CarouselUser;
