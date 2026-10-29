// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import axios from "axios";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Autoplay, Pagination, Navigation } from "swiper/modules";
// // import Img from "../../../components/lazyLoadImage/Img";
// // import useFetch from "../../../hooks/useFetch";
// // import { MdThumbUp, MdShare } from "react-icons/md";
// // import { Modal } from "antd";
// // import {
// //   FacebookShareButton,
// //   TwitterShareButton,
// //   LinkedinShareButton,
// //   WhatsappShareButton,
// //   RedditShareButton,
// //   FacebookIcon,
// //   TwitterIcon,
// //   LinkedinIcon,
// //   WhatsappIcon,
// //   RedditIcon,
// // } from "react-share";
// // import "./style.scss";
// // import "swiper/css";
// // import "swiper/css/autoplay";
// // import "swiper/css/pagination";
// // import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";

// // // TruncatedDescription Component
// // const TruncatedDescription = ({ description, maxLength = 130 }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   const toggleReadMore = () => {
// //     setIsExpanded(!isExpanded);
// //   };

// //   return (
// //     <div className="description">
// //       {isExpanded ? description : `${description.substring(0, maxLength)}..`}
// //       {description.length > maxLength && (
// //         <span className="readMore" onClick={toggleReadMore}>
// //           {isExpanded ? " ." : " ..."}
// //         </span>
// //       )}
// //     </div>
// //   );
// // };

// // const HeroBanner = ({ selectedPosterUrl }) => {
// //   const [datas, setDatas] = useState([]);
// //   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
// //   const [selectedProject, setSelectedProject] = useState(null);
// //   const navigate = useNavigate(); // Hook for navigation
// //   const { url } = useSelector((state) => state.home);
// //   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// //   // Shuffle the array to show projects randomly
// //   const shuffleArray = (array) => {
// //     for (let i = array.length - 1; i > 0; i--) {
// //       const j = Math.floor(Math.random() * (i + 1));
// //       [array[i], array[j]] = [array[j], array[i]];
// //     }
// //     return array;
// //   };

// //   useEffect(() => {
// //     const fetchProjects = async () => {
// //       try {
// //         const res = await axios.get(`${apiBaseUrl}/projects`);
// //         console.log("response projects are:", res.data);

// //         const validProjects = res.data.filter(
// //           (project) =>
// //             project.thumbnailImage && project.thumbnailImages.length > 0
// //         );
// //         console.log("project data is", validProjects); // Removed `.data` as `validProjects` is already the filtered array
// //         setDatas(shuffleArray(validProjects)); // Shuffle the projects
// //       } catch (error) {
// //         console.error("Error fetching projects:", error);
// //       }
// //     };
// //     fetchProjects();
// //   }, []);

// //   const onProfileClick = (uniqueId) => {
// //     if (uniqueId) {
// //       navigate(`/profile/${uniqueId}`);
// //     } else {
// //       alert("uniqueId not available");
// //     }
// //   };

// //   const handleShareClick = (project) => {
// //     setSelectedProject(project);
// //     setIsShareModalVisible(true);
// //   };

// //   const handleCancel = () => {
// //     setIsShareModalVisible(false);
// //   };

// //   // Handle Like Button Click
// //   const handleLikeClick = (projectId) => {
// //     setDatas((prevData) =>
// //       prevData.map((project) =>
// //         project.projectId === projectId
// //           ? {
// //               ...project,
// //               likes: project.isLiked ? project.likes - 1 : project.likes + 1,
// //               isLiked: !project.isLiked, // Toggle like state
// //             }
// //           : project
// //       )
// //     );
// //   };

// //   return (
// //     <>
// //       <div className="heroBanner">
// //         <div className="overlayImageBox">
// //           <Swiper
// //             className="swiper-container"
// //             style={{
// //               "--swiper-navigation-color": "#fff",
// //               "--swiper-pagination-color": "#fff",
// //             }}
// //             autoplay={{ delay: 5500, disableOnInteraction: false }}
// //             pagination={{ clickable: true, dynamicBullets: true }}
// //             navigation={true}
// //             modules={[Autoplay, Pagination, Navigation]}
// //             breakpoints={{
// //               640: {
// //                 slidesPerView: 1,
// //                 spaceBetween: 10,
// //               },
// //               768: {
// //                 slidesPerView: 1,
// //                 spaceBetween: 20,
// //               },
// //               1024: {
// //                 slidesPerView: 1,
// //                 spaceBetween: 30,
// //               },
// //             }}
// //           >
// //             {datas.map((project) => (
// //               <SwiperSlide key={project.projectId}>
// //                 <div className="slideContent">
// // <div className="imageWrapper">
// //   <img
// //     src={project.thumbnailImage}
// //     alt={project.name}
// //     onClick={() => navigate(`/details/${project.projectId}`)} // Navigate on image click
// //     style={{ cursor: "pointer" }}
// //   />
// // </div>

// //                   {/* Title and Description in a separate div */}
// //                   <div className="titleDescriptionWrapper">
// //                     <div className="title">{project.name}</div>
// // <TruncatedDescription
// //   description={project.description}
// //   maxLength={window.innerWidth <= 768 ? 25 : 90}
// // />
// //                   </div>

// //                   {/* Static Content with User Info and Icons */}
// //                   <div className="staticContent">
// //                     <div className="userInfo">
// //                       {console.log(
// //                         "profilePic for this project:",
// //                         project.profilePic
// //                       )}
// // <img
// //   className="profilePicture"
// //   src={
// //     project.profilePic ? project.profilePic : Anonimous
// //   }
// //   alt={project.username || "Anonymous User"}
// //   onClick={() => onProfileClick(project.uniqueId)}
// // />
// //   <span
// //     className="username"
// //     onClick={() => onProfileClick(project.uniqueId)}
// //   >
// //     {project.username || "Anonymous User"}
// //   </span>
// // </div>

// //   <div className="icons">
// //     <MdThumbUp
// //       className="icon"
// //       style={{
// //         color: project.isLiked ? "blue" : "white",
// //       }}
// //       onClick={() => handleLikeClick(project.projectId)}
// //     />
// //     <span className="likeCount">
// //       {project.likes} {project.likes === 1 ? "Like" : "Likes"}
// //     </span>
// //     <MdShare
// //       className="icon"
// //       onClick={() => handleShareClick(project)}
// //     />
// //   </div>
// // </div>
// //           </div>
// //         </SwiperSlide>
// //       ))}
// //     </Swiper>
// //   </div>
// // </div>

// //       {/* Share Modal */}
// //       {selectedProject && (
// {
//   /* <Modal
//   title={<div className="modalTitle">Share {selectedProject.name}</div>}
//   visible={isShareModalVisible}
//   onCancel={handleCancel}
//   footer={null}
//   className="shareModal" // Add this class for styling
// >
//   <div className="shareOptions">
//     <FacebookShareButton
//       url={`${window.location.origin}/details/${selectedProject.projectId}`}
//     >
//       <FacebookIcon size={32} round />
//     </FacebookShareButton>
//     <TwitterShareButton
//       url={`${window.location.origin}/details/${selectedProject.projectId}`}
//     >
//       <TwitterIcon size={32} round />
//     </TwitterShareButton>
//     <LinkedinShareButton
//       url={`${window.location.origin}/details/${selectedProject.projectId}`}
//     >
//       <LinkedinIcon size={32} round />
//     </LinkedinShareButton>
//     <WhatsappShareButton
//       url={`${window.location.origin}/details/${selectedProject.projectId}`}
//     >
//       <WhatsappIcon size={32} round />
//     </WhatsappShareButton>
//     <RedditShareButton
//       url={`${window.location.origin}/details/${selectedProject.projectId}`}
//     >
//       <RedditIcon size={32} round />
//     </RedditShareButton>
//   </div>
// </Modal> */
// }
// //       )}
// //     </>
// //   );
// // };

// // export default HeroBanner;

// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import axios from "axios";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Autoplay, Pagination, Navigation } from "swiper/modules";
// // import Img from "../../../components/lazyLoadImage/Img";
// // import useFetch from "../../../hooks/useFetch";
// // import { MdThumbUp, MdShare } from "react-icons/md";
// // import { Modal } from "antd";
// // import {
// //   FacebookShareButton,
// //   TwitterShareButton,
// //   LinkedinShareButton,
// //   WhatsappShareButton,
// //   RedditShareButton,
// //   FacebookIcon,
// //   TwitterIcon,
// //   LinkedinIcon,
// //   WhatsappIcon,
// //   RedditIcon,
// // } from "react-share";
// // import "./style.scss";
// // import "swiper/css";
// // import "swiper/css/autoplay";
// // import "swiper/css/pagination";
// // import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";

// // // TruncatedDescription Component
// // const TruncatedDescription = ({ description, maxLength = 130 }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   const toggleReadMore = () => {
// //     setIsExpanded(!isExpanded);
// //   };

// //   return (
// //     <div className="description">
// //       {isExpanded ? description : `${description.substring(0, maxLength)}..`}
// //       {description.length > maxLength && (
// //         <span className="readMore" onClick={toggleReadMore}>
// //           {isExpanded ? " ." : " ..."}
// //         </span>
// //       )}
// //     </div>
// //   );
// // };

// // const HeroBanner = ({ selectedPosterUrl }) => {
// //   const [datas, setDatas] = useState([]);
// //   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
// //   const [selectedProject, setSelectedProject] = useState(null);
// //   const navigate = useNavigate(); // Hook for navigation
// //   const { url } = useSelector((state) => state.home);
// //   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// //   // Shuffle the array to show projects randomly
// //   const shuffleArray = (array) => {
// //     for (let i = array.length - 1; i > 0; i--) {
// //       const j = Math.floor(Math.random() * (i + 1));
// //       [array[i], array[j]] = [array[j], array[i]];
// //     }
// //     return array;
// //   };

// //   useEffect(() => {
// //     const fetchProjects = async () => {
// //       try {
// //         const res = await axios.get(`${apiBaseUrl}/projects`);
// //         console.log("response projects are:", res.data);

// //         const validProjects = res.data.filter(
// //           (project) =>
// //             project.thumbnailImage && project.thumbnailImages.length > 0
// //         );
// //         console.log("project data is", validProjects); // Removed `.data` as `validProjects` is already the filtered array
// //         setDatas(shuffleArray(validProjects)); // Shuffle the projects
// //       } catch (error) {
// //         console.error("Error fetching projects:", error);
// //       }
// //     };
// //     fetchProjects();
// //   }, []);

// //   const onProfileClick = (uniqueId) => {
// //     if (uniqueId) {
// //       navigate(`/profile/${uniqueId}`);
// //     } else {
// //       alert("uniqueId not available");
// //     }
// //   };

// //   const handleShareClick = (project) => {
// //     setSelectedProject(project);
// //     setIsShareModalVisible(true);
// //   };

// //   const handleCancel = () => {
// //     setIsShareModalVisible(false);
// //   };

// //   // Handle Like Button Click
// //   const handleLikeClick = (projectId) => {
// //     setDatas((prevData) =>
// //       prevData.map((project) =>
// //         project.projectId === projectId
// //           ? {
// //               ...project,
// //               likes: project.isLiked ? project.likes - 1 : project.likes + 1,
// //               isLiked: !project.isLiked, // Toggle like state
// //             }
// //           : project
// //       )
// //     );
// //   };

// //   return (
// //     <>
// //       <div className="heroBanner">
// //         <div className="overlayImageBox">
// //           <Swiper
// //             className="swiper-container"
// //             style={{
// //               "--swiper-navigation-color": "#fff",
// //               "--swiper-pagination-color": "#fff",
// //             }}
// //             autoplay={{ delay: 5500, disableOnInteraction: false }}
// //             pagination={{ clickable: true, dynamicBullets: true }}
// //             navigation={true}
// //             modules={[Autoplay, Pagination, Navigation]}
// //             centeredSlides={true} // Center active slide
// //             slidesPerView={"auto"} // Dynamically adjust slide width
// //             spaceBetween={30} // Space between slides
// //             breakpoints={{
// //               640: {
// //                 slidesPerView: 1,
// //                 spaceBetween: 10,
// //               },
// //               768: {
// //                 slidesPerView: 1.5, // Adjust number of slides visible
// //                 spaceBetween: 20,
// //               },
// //               1024: {
// //                 slidesPerView: 2.5, // Adjust number of slides visible
// //                 spaceBetween: 30,
// //               },
// //             }}
// //           >
// //             {datas.map((project) => (
// //               <SwiperSlide key={project.projectId}>
// //                 <div className="slideContent">
// //                   <div className="imageWrapper">
// //                     <img
// //                       src={project.thumbnailImage}
// //                       alt={project.name}
// //                       onClick={() => navigate(`/details/${project.projectId}`)} // Navigate on image click
// //                       style={{ cursor: "pointer" }}
// //                     />
// //                   </div>

// //                   {/* Title and Description in a separate div */}
// //                   <div className="titleDescriptionWrapper">
// //                     <div className="title">{project.name}</div>
// //                     <TruncatedDescription
// //                       description={project.description}
// //                       maxLength={window.innerWidth <= 768 ? 25 : 90}
// //                     />
// //                   </div>

// //                   {/* Static Content with User Info and Icons */}
// //                   <div className="staticContent">
// //                     <div className="userInfo">
// //                       {console.log(
// //                         "profilePic for this project:",
// //                         project.profilePic
// //                       )}
// //                       <img
// //                         className="profilePicture"
// //                         src={
// //                           project.profilePic ? project.profilePic : Anonimous
// //                         }
// //                         alt={project.username || "Anonymous User"}
// //                         onClick={() => onProfileClick(project.uniqueId)}
// //                       />
// //                       <span
// //                         className="username"
// //                         onClick={() => onProfileClick(project.uniqueId)}
// //                       >
// //                         {project.username || "Anonymous User"}
// //                       </span>
// //                     </div>

// //                     <div className="icons">
// //                       <MdThumbUp
// //                         className="icon"
// //                         style={{
// //                           color: project.isLiked ? "blue" : "white",
// //                         }}
// //                         onClick={() => handleLikeClick(project.projectId)}
// //                       />
// //                       <span className="likeCount">
// //                         {project.likes} {project.likes === 1 ? "Like" : "Likes"}
// //                       </span>
// //                       <MdShare
// //                         className="icon"
// //                         onClick={() => handleShareClick(project)}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </SwiperSlide>
// //             ))}
// //           </Swiper>
// //         </div>
// //       </div>

// //       {/* Share Modal */}
// //       {selectedProject && (
// //         <Modal
// //           title={<div className="modalTitle">Share {selectedProject.name}</div>}
// //           visible={isShareModalVisible}
// //           onCancel={handleCancel}
// //           footer={null}
// //           className="shareModal" // Add this class for styling
// //         >
// //           <div className="shareOptions">
// //             <FacebookShareButton
// //               url={`${window.location.origin}/details/${selectedProject.projectId}`}
// //             >
// //               <FacebookIcon size={32} round />
// //             </FacebookShareButton>
// //             <TwitterShareButton
// //               url={`${window.location.origin}/details/${selectedProject.projectId}`}
// //             >
// //               <TwitterIcon size={32} round />
// //             </TwitterShareButton>
// //             <LinkedinShareButton
// //               url={`${window.location.origin}/details/${selectedProject.projectId}`}
// //             >
// //               <LinkedinIcon size={32} round />
// //             </LinkedinShareButton>
// //             <WhatsappShareButton
// //               url={`${window.location.origin}/details/${selectedProject.projectId}`}
// //             >
// //               <WhatsappIcon size={32} round />
// //             </WhatsappShareButton>
// //             <RedditShareButton
// //               url={`${window.location.origin}/details/${selectedProject.projectId}`}
// //             >
// //               <RedditIcon size={32} round />
// //             </RedditShareButton>
// //           </div>
// //         </Modal>
// //       )}
// //     </>
// //   );
// // };

// // export default HeroBanner;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { MdShare } from "react-icons/md";
// import { FaHeart } from "react-icons/fa";
// import { Modal } from "antd";
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   WhatsappShareButton,
//   RedditShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   WhatsappIcon,
//   RedditIcon,
// } from "react-share";

// import "./style.scss";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/pagination";
// import Anonimous from "../../../../public/anonymous-profile-silhouette-b714qekh29tu1anb.png";
// import HeroBannerSkeleton from "./HeroBannerSkeleton";

// /* ===================== HELPERS ===================== */
// const TruncatedDescription = ({ description, maxLength = 100 }) => (
//   <div className="description">
//     <span
//       dangerouslySetInnerHTML={{
//         __html:
//           description.length > maxLength
//             ? `${description.substring(0, maxLength)}..`
//             : description,
//       }}
//     />
//   </div>
// );

// const HeroBanner = () => {
//   const navigate = useNavigate();
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//   const [editorsPick, setEditorsPick] = useState([]);
//   const [mostRecent, setMostRecent] = useState([]);
//   const [mostTalked, setMostTalked] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState("mostRecent");

//   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const swiperWrappedRef = useRef(null);

//   /* ===================== FETCH DATA ===================== */
//   useEffect(() => {
//     const fetchHeroBanner = async () => {
//       try {
//         const res = await axios.get(`${apiBaseUrl}/projects/hero-banner`);

//         console.log("🔥 Hero Banner API Response:", res.data);

//         setEditorsPick(res.data.editorsPick || []);
//         setMostRecent(res.data.mostRecent || []);
//         setMostTalked(res.data.mostTalked || []);
//       } catch (error) {
//         console.error("Error fetching hero banner projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHeroBanner();
//   }, []);

//   /* ===================== DERIVED DATA ===================== */
//   const activeProjects =
//     activeTab === "editorsPick"
//       ? editorsPick
//       : activeTab === "mostTalked"
//       ? mostTalked
//       : mostRecent;

//   const activeSetter =
//     activeTab === "editorsPick"
//       ? setEditorsPick
//       : activeTab === "mostTalked"
//       ? setMostTalked
//       : setMostRecent;

//   /* ===================== HANDLERS ===================== */
//   const onProfileClick = (uniqueId) => {
//     if (uniqueId) navigate(`/profile/${uniqueId}`);
//   };

//   const handleShareClick = (project) => {
//     setSelectedProject(project);
//     setIsShareModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsShareModalVisible(false);
//   };

//   const handleLikeClick = (projectId) => {
//     activeSetter((prev) =>
//       prev.map((project) =>
//         project.projectId === projectId
//           ? {
//               ...project,
//               likes: project.isLiked
//                 ? project.likes - 1
//                 : project.likes + 1,
//               isLiked: !project.isLiked,
//             }
//           : project
//       )
//     );
//   };

//   /* ===================== RENDER ===================== */
//   if (loading) return <HeroBannerSkeleton />;

//   if (!activeProjects || activeProjects.length === 0) return null;

//   return (
//     <div className="swiper-slider-container">

//       {/* ===================== SINGLE SWIPER ===================== */}
//       <Swiper
//         className="theater-swiper"
//         grabCursor
//         centeredSlides
//         navigation={{
//           nextEl: ".custom-swiper-button-next",
//           prevEl: ".custom-swiper-button-prev",
//         }}
//         pagination={{
//           clickable: true,
//           dynamicBullets: true,
//           dynamicMainBullets: 3,
//         }}
//         loop
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         speed={800}
//         modules={[Pagination, Navigation, Autoplay]}
//         onSwiper={(swiper) => {
//           swiperWrappedRef.current = swiper.wrapperEl;
//         }}
//       >
//         {activeProjects.map((project) => (
//           <SwiperSlide key={project.projectId}>
//             <div className="slide-wrapper-top">
//               <div
//                 className="slide-bg"
//                 style={{
//                   backgroundImage: `url(${project.thumbnailImage})`,
//                 }}
//                 onClick={() =>
//                   navigate(`/details/${project.projectId}`)
//                 }
//               />

//               <img
//                 src={project.thumbnailImage}
//                 alt={project.name}
//                 className="slide-img"
//                 onClick={() =>
//                   navigate(`/details/${project.projectId}`)
//                 }
//               />

//               <div className="content-slider">
//                 <h1
//                   className="title-slider"
//                   onClick={() =>
//                     navigate(`/details/${project.projectId}`)
//                   }
//                 >
//                   {project.name}
//                 </h1>

//                 <div
//                   className="description-slider"
//                   onClick={() =>
//                     navigate(`/details/${project.projectId}`)
//                   }
//                 >
//                   <TruncatedDescription
//                     description={project.description}
//                   />
//                 </div>

//                 <div className="avtar-username">
//                   <div className="avtar-photo">
//                     <img
//                       src={project.profilePic || Anonimous}
//                       className="avatar"
//                       onClick={() =>
//                         onProfileClick(project.uniqueId)
//                       }
//                     />
//                     <span
//                       onClick={() =>
//                         onProfileClick(project.uniqueId)
//                       }
//                     >
//                       {project.username || "Anonymous User"}
//                     </span>
//                   </div>

//                   <div className="icon-group">
//                     <FaHeart
//                       className="heart-icon"
//                       style={{
//                         color: project.isLiked ? "red" : "white",
//                       }}
//                       onClick={() =>
//                         handleLikeClick(project.projectId)
//                       }
//                     />
//                     <span>{project.likes}</span>

//                     <MdShare
//                       onClick={() =>
//                         handleShareClick(project)
//                       }
//                     />

//                     <button
//                       className="read"
//                       onClick={() =>
//                         navigate(`/details/${project.projectId}`)
//                       }
//                     >
//                       Read More
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//             {/* ===================== TABS ===================== */}
//       <div className="hero-tabs">
//         {/* <button
//           className={activeTab === "editorsPick" ? "active" : ""}
//           onClick={() => setActiveTab("editorsPick")}
//         >
//           Editor’s Pick
//         </button> */}
//         <button
//           className={activeTab === "mostRecent" ? "active" : ""}
//           onClick={() => setActiveTab("mostRecent")}
//         >
//           Most Recent
//         </button>
//         <button
//           className={activeTab === "mostTalked" ? "active" : ""}
//           onClick={() => setActiveTab("mostTalked")}
//         >
//           Most Discussed
//         </button>
//       </div>

//       <div className="custom-swiper-button-prev">&#8592;</div>
//       <div className="custom-swiper-button-next">&#8594;</div>

//       {selectedProject && (
//         <Modal
//           title={
//             <div className="modalTitle">
//               Share {selectedProject.name}
//             </div>
//           }
//           open={isShareModalVisible}
//           onCancel={handleCancel}
//           footer={null}
//           className="shareModal"
//         >
//           <div className="shareOptions">
//             <FacebookShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <FacebookIcon size={32} round />
//             </FacebookShareButton>

//             <TwitterShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <TwitterIcon size={32} round />
//             </TwitterShareButton>

//             <LinkedinShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <LinkedinIcon size={32} round />
//             </LinkedinShareButton>

//             <WhatsappShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <WhatsappIcon size={32} round />
//             </WhatsappShareButton>

//             <RedditShareButton
//               url={`${window.location.origin}/details/${selectedProject.projectId}`}
//             >
//               <RedditIcon size={32} round />
//             </RedditShareButton>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default HeroBanner;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { MdShare } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { Modal } from "antd";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  RedditIcon,
} from "react-share";

import "./style.scss";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
const Anonimous = "/anonymous-profile-silhouette-b714qekh29tu1anb.png";
import HeroBannerSkeleton from "./HeroBannerSkeleton";

/* ===================== HELPERS ===================== */
// OPTIMIZATION: Wrapped in React.memo to prevent unnecessary text re-renders during slide changes
const TruncatedDescription = React.memo(({ description, maxLength = 100 }) => (
  <div className="description">
    <span
      dangerouslySetInnerHTML={{
        __html:
          description.length > maxLength
            ? `${description.substring(0, maxLength)}..`
            : description,
      }}
    />
  </div>
));
TruncatedDescription.displayName = "TruncatedDescription";

const HeroBanner = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [editorsPick, setEditorsPick] = useState([]);
  const [mostRecent, setMostRecent] = useState([]);
  const [mostTalked, setMostTalked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editorsPick");
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const swiperWrappedRef = useRef(null);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    // OPTIMIZATION: Added an AbortController to cleanly cancel the request if the component unmounts
    const controller = new AbortController();
    
    const fetchHeroBanner = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/projects/hero-banner`, {
          signal: controller.signal
        });

        let recent = res.data.mostRecent || [];
        let picks = res.data.editorsPick || [];
        let talked = res.data.mostTalked || [];

        const extractSeriesKey = (name = "") => {
          let clean = (name || "").toLowerCase().trim();
          clean = clean.split(/[-–—]/)[0];
          clean = clean.replace(/\(.*\)/g, "");
          clean = clean.replace(/#\d+/g, "");
          clean = clean.replace(/chapter \d+/gi, "");
          clean = clean.replace(/episode \d+/gi, "");
          return clean.trim() || name.toLowerCase().trim();
        };

        const dedup = (arr) => {
          const seen = new Set();
          return (arr || []).filter(p => {
            if (!p.name) return false;
            const key = extractSeriesKey(p.name);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        };

        recent = dedup(recent);
        picks = dedup(picks);
        talked = dedup(talked);

        setEditorsPick(picks);
        setMostRecent(recent);
        setMostTalked(talked);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching hero banner projects:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanner();
    
    return () => controller.abort();
  }, [apiBaseUrl]);

  /* ===================== DERIVED DATA ===================== */
  const activeProjects =
    activeTab === "editorsPick"
      ? editorsPick
      : activeTab === "mostTalked"
      ? mostTalked
      : mostRecent;

  const activeSetter =
    activeTab === "editorsPick"
      ? setEditorsPick
      : activeTab === "mostTalked"
      ? setMostTalked
      : setMostRecent;

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  /* ===================== HANDLERS ===================== */
  const onProfileClick = (uniqueId) => {
    if (uniqueId) navigate(`/profile/${uniqueId}`);
  };

  const handleShareClick = (project) => {
    setSelectedProject(project);
    setIsShareModalVisible(true);
  };

  const handleCancel = () => {
    setIsShareModalVisible(false);
  };

  const handleLikeClick = (projectId) => {
    activeSetter((prev) =>
      prev.map((project) =>
        (project.projectId || project._id) === projectId
          ? {
              ...project,
              likes: project.isLiked
                ? project.likes - 1
                : project.likes + 1,
              isLiked: !project.isLiked,
            }
          : project
      )
    );
  };

  /* ===================== RENDER ===================== */
  if (loading) return <HeroBannerSkeleton />;
  if (!activeProjects || activeProjects.length === 0) return null;

  return (
    <div className="swiper-slider-container" style={{ transform: "translate3d(0,0,0)" }}>
      {/* ===================== SINGLE SWIPER ===================== */}
      <Swiper
        className="theater-swiper"
        grabCursor
        centeredSlides
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={800}
        modules={[Pagination, Navigation, Autoplay]}
        onSwiper={(swiper) => {
          swiperWrappedRef.current = swiper.wrapperEl;
        }}
      >
        {activeProjects.map((project, index) => (
          <SwiperSlide key={project.projectId || project._id}>
            <div className="slide-wrapper-top">
              <div
                className="slide-bg"
                style={{
                  backgroundImage: `url(${project.thumbnailImage})`,
                }}
                onClick={() => navigate(`/viewer/${(project.projectId || project._id)}-${slugify(project.name)}`)}
              />

              <img
                src={project.thumbnailImage}
                alt={project.name}
                className="slide-img"
                // OPTIMIZATION: Eager load the very first slide image and give it high fetch priority to fix your LCP score
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "low"}
                onClick={() => navigate(`/viewer/${(project.projectId || project._id)}-${slugify(project.name)}`)}
              />

              <div className="content-slider">
                <h1
                  className="title-slider"
                  onClick={() => navigate(`/viewer/${(project.projectId || project._id)}-${slugify(project.name)}`)}
                >
                  {project.name}
                </h1>

                <div
                  className="description-slider"
                  onClick={() => navigate(`/viewer/${(project.projectId || project._id)}-${slugify(project.name)}`)}
                >
                  <TruncatedDescription description={project.description} />
                </div>

                <div className="avtar-username">
                  <div className="avtar-photo">
                    <img
                      src={project.profilePic || Anonimous}
                      className="avatar"
                      alt="Profile"
                      loading="lazy"
                      width="40"
                      height="40"
                      onClick={() => onProfileClick(project.uniqueId)}
                    />
                    <span onClick={() => onProfileClick(project.uniqueId)}>
                      {project.username || "Anonymous User"}
                    </span>
                  </div>

                  <div className="icon-group">
                    <FaHeart
                      className="heart-icon"
                      style={{
                        color: project.isLiked ? "red" : "white",
                      }}
                      onClick={() => handleLikeClick(project.projectId || project._id)}
                    />
                    <span>{project.likes}</span>

                    <MdShare onClick={() => handleShareClick(project)} />

                    <button
                      className="read"
                      onClick={() => navigate(`/viewer/${(project.projectId || project._id)}-${slugify(project.name)}`)}
                    >
                      Read Now
                    </button>

                    <button
                      className="details-opt"
                      onClick={() => navigate(`/details/${(project.projectId || project._id)}-${slugify(project.name)}`)}
                      title="View Details, Chapters & Comments"
                      style={{
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        color: "#e2e8f0",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s"
                      }}
                    >
                      💬 Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ===================== TABS ===================== */}
      <div className="hero-tabs">
        <button
          className={activeTab === "mostRecent" ? "active" : ""}
          onClick={() => setActiveTab("mostRecent")}
        >
          Most Recent
        </button>
        <button
          className={activeTab === "mostTalked" ? "active" : ""}
          onClick={() => setActiveTab("mostTalked")}
        >
          Most Discussed
        </button>
      </div>

      <div className="custom-swiper-button-prev">&#8592;</div>
      <div className="custom-swiper-button-next">&#8594;</div>

      {selectedProject && (
        <Modal
          title={<div className="modalTitle">Share {selectedProject.name}</div>}
          open={isShareModalVisible}
          onCancel={handleCancel}
          footer={null}
          className="shareModal"
        >
          <div className="shareOptions">
            <FacebookShareButton url={`${window.location.origin}/details/${(selectedProject.projectId || selectedProject._id)}-${slugify(selectedProject.name)}`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={`${window.location.origin}/details/${(selectedProject.projectId || selectedProject._id)}-${slugify(selectedProject.name)}`}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <LinkedinShareButton url={`${window.location.origin}/details/${(selectedProject.projectId || selectedProject._id)}-${slugify(selectedProject.name)}`}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={`${window.location.origin}/details/${(selectedProject.projectId || selectedProject._id)}-${slugify(selectedProject.name)}`}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <RedditShareButton url={`${window.location.origin}/details/${(selectedProject.projectId || selectedProject._id)}-${slugify(selectedProject.name)}`}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HeroBanner;
