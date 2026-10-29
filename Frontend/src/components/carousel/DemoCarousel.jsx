import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import "./style.scss";

const DemoCarousel = ({ title, data = [], loading = true }) => {
  const carouselContainer = useRef();
  const navigate = useNavigate();

  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const skItem = () => (
    <div className="skeletonItem">
      <div className="posterBlock skeleton"></div>
      <div className="textBlock">
        <div className="title skeleton"></div>
        <div className="date skeleton"></div>
      </div>
    </div>
  );

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => (
              <div
                key={item.id}
                className="carouselItem"
                onClick={() => navigate(`/viewer/${(item.projectId || item._id)}-${slugify(item.name)}`)}
              >
                <div className="posterBlock">
                  <Img src={item.thumbnailImage || PosterFallback} />
                  {item.isNewRelease && (
                    <div className="comic-new-badge">
                      NEW
                    </div>
                  )}
                  <img
                    src={item.userProfilePic}
                    alt=""
                    className="avatarImage"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/profile");
                    }}
                  />
                </div>
                <div className="textBlock" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                  <span className="title" style={{ flex: 1 }}>{item.name}</span>
                  <span 
                    className="infoBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/details/${(item.projectId || item._id)}-${slugify(item.name)}`);
                    }}
                    title="View Chapters & Comments"
                    style={{
                      fontSize: "10.5px",
                      color: "#cbd5e1",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    💬 Info
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>{skItem()}</React.Fragment>
            ))}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default DemoCarousel;
