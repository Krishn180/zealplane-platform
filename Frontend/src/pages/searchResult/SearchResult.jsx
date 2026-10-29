import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import axios from "axios";
import noResults from "../../assets/no-results.png"; // Optional image for no results
const dummyProfilePic = "/anonymous-profile-silhouette-b714qekh29tu1anb.png"; // Dummy profile pic
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import axiosInstance from "../../Auth/Axios";

const SearchResult = () => {
  const [data, setData] = useState([]); // Store combined user and project data
  const [loading, setLoading] = useState(false);
  const { query } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const slugify = (text) => {
    return text
      ? text
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "")
      : "";
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch creators
      const userRes = await axiosInstance.get(`/users/username/${query}`, { headers });
      const matchedCreators = (userRes.data || []).map(u => ({
        id: u.uniqueId,
        name: u.fullName || u.username,
        username: u.username,
        image: u.profilePic,
        role: u.jobRole || "Comic Creator",
        type: "creator"
      }));

      // Fetch projects
      const projectRes = await axiosInstance.get('/projects', { headers });
      const matchedProjects = (projectRes.data || [])
        .filter(p => p.name && p.name.toLowerCase().includes(query.toLowerCase()))
        .map(p => ({
          id: p.projectId || p._id,
          name: p.name,
          username: p.username || "Desi Creator",
          image: p.thumbnailImage,
          role: "Manga / Comic Book",
          type: "project"
        }));

      setData([...matchedCreators, ...matchedProjects]);
    } catch (error) {
      console.error("Error fetching search results", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [query]);

  const handleItemClick = (item) => {
    if (item.type === "project") {
      navigate(`/viewer/${item.id}-${slugify(item.name)}`);
    } else {
      navigate(`/profile/${item.id}`);
    }
  };

  return (
    <div className="searchResultsPage">
      <Header />
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <div className="pageTitle">
            {`Search results for `}
            <span style={{ color: "skyblue", fontWeight: "bold" }}>
              {`${query}`}
            </span>
          </div>

          {data.length === 0 ? (
            <div className="noResults">
              <img src={noResults} alt="No results found" />
              <p>No results found for '{query}'</p>
            </div>
          ) : (
            <div className="content">
              {data.map((item, idx) => (
                <div
                  className="userCard"
                  key={idx}
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.image || dummyProfilePic}
                    alt={item.name}
                    className="profilePic"
                  />
                  <div className="userInfo">
                    <p className="fullName">{item.name}</p>
                    <p className="username">
                      <strong></strong> {item.username}
                    </p>
                    <p className="jobRole">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default SearchResult;
