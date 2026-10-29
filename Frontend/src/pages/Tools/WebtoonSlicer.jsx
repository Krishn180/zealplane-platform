import React, { useState, useRef, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import {
  Upload,
  Scissors,
  Download,
  Layers,
  Settings2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Zap,
  Maximize2,
  FileArchive,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sliders,
  ExternalLink
} from "lucide-react";
import "./WebtoonSlicer.scss";

// Platform Presets
const PLATFORM_PRESETS = [
  {
    id: "webtoon",
    name: "LINE Webtoon",
    width: 800,
    maxHeight: 1280,
    format: "image/jpeg",
    ext: "jpg",
    quality: 0.9,
    description: "Official Webtoon Canvas format (800px × 1280px max). Files under 2MB."
  },
  {
    id: "tapas",
    name: "Tapas",
    width: 940,
    maxHeight: 1280,
    format: "image/jpeg",
    ext: "jpg",
    quality: 0.9,
    description: "Standard Tapas comic strip (940px width, max 1280px height)."
  },
  {
    id: "zealplane",
    name: "ZealPlane Originals",
    width: 800,
    maxHeight: 1280,
    format: "image/webp",
    ext: "webp",
    quality: 0.92,
    description: "Optimized for mobile-first scrolling with high-fidelity WebP compression."
  },
  {
    id: "instagram",
    name: "Instagram Story / Reel",
    width: 1080,
    maxHeight: 1920,
    format: "image/jpeg",
    ext: "jpg",
    quality: 0.95,
    description: "9:16 vertical slides (1080px × 1920px) for social media teasers."
  },
  {
    id: "custom",
    name: "Custom Dimensions",
    width: 800,
    maxHeight: 1280,
    format: "image/jpeg",
    ext: "jpg",
    quality: 0.9,
    description: "Specify your own custom target width, height, and file format."
  }
];

// SEO FAQs
const FAQ_ITEMS = [
  {
    q: "What is the official canvas size for LINE Webtoon episodes?",
    a: "LINE Webtoon requires images to be exactly 800 pixels wide and no taller than 1280 pixels per slice, with a maximum file size of 2MB per image in JPG or PNG format. Our tool automatically scales and slices your vertical canvas to comply with these strict specifications."
  },
  {
    q: "How does Smart Safe Cut prevent cutting through speech bubbles?",
    a: "Standard croppers blindly slice every 1280 pixels, which frequently splits dialog bubbles or character faces in half. Our Smart Safe Cut scans a ±60px gutter window around each cut point to find the lowest pixel variance (empty white or solid panel gutters), adjusting the split point dynamically so panels remain intact."
  },
  {
    q: "Is my artwork uploaded to any server or cloud database?",
    a: "No. The entire slicing and ZIP bundling process executes 100% locally inside your browser's HTML5 Canvas engine. Your high-resolution art never leaves your device, guaranteeing total creator privacy and zero bandwidth limits."
  },
  {
    q: "Why should I use WebP instead of JPG for Webtoon slices?",
    a: "WebP provides 25% to 40% smaller file sizes compared to standard JPEG while preserving crisper line art and cleaner gradients. Tapas and ZealPlane natively support WebP. For LINE Webtoon Canvas uploads, select the JPEG preset."
  },
  {
    q: "How do I publish my comic on ZealPlane?",
    a: "ZealPlane is India's premier creator platform for Manga, Webtoons, and Indian indie comics. You retain 100% of your intellectual property and copyright, access monetization through reader tips and coins, and reach tens of thousands of active readers across India and worldwide."
  }
];

const WebtoonSlicer = ({ embedded = false }) => {
  // Preset & Configuration State
  const [selectedPreset, setSelectedPreset] = useState("webtoon");
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetMaxHeight, setTargetMaxHeight] = useState(1280);
  const [outputFormat, setOutputFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [useSmartCut, setUseSmartCut] = useState(true);
  const [preserveOriginalWidth, setPreserveOriginalWidth] = useState(false);

  // File & Processing State
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [slicedImages, setSlicedImages] = useState([]);
  const [isZipping, setIsZipping] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [slicerAuthModal, setSlicerAuthModal] = useState(false);
  const [slicerEmailInput, setSlicerEmailInput] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  const fileInputRef = useRef(null);

  // Sync preset changes
  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PLATFORM_PRESETS.find((p) => p.id === presetId);
    if (preset && presetId !== "custom") {
      setTargetWidth(preset.width);
      setTargetMaxHeight(preset.maxHeight);
      setOutputFormat(preset.format);
      setQuality(Math.round(preset.quality * 100));
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/gif"];
    const imageFiles = files.filter((file) => validImageTypes.includes(file.type));

    if (imageFiles.length === 0) {
      alert("Please upload valid image files (JPG, PNG, WebP).");
      return;
    }

    const newFiles = imageFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      previewUrl: URL.createObjectURL(file),
      width: 0,
      height: 0,
      status: "pending"
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setSlicedImages([]);
  };

  const removeFile = (index, e) => {
    e.stopPropagation();
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (activeFileIndex >= updated.length) {
        setActiveFileIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
    setSlicedImages([]);
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    setSlicedImages([]);
    setProgress(0);
    setProgressStatus("");
  };

  // Smart Cut Algorithm: Look for empty horizontal gutter within a ±searchWindow margin
  const findOptimalCutPoint = (ctx, startY, targetHeight, totalHeight, imgWidth) => {
    const idealCutY = startY + targetHeight;
    if (idealCutY >= totalHeight) return totalHeight;

    const searchWindow = Math.min(60, Math.floor(targetHeight * 0.12));
    const minCutY = Math.max(startY + Math.floor(targetHeight * 0.7), idealCutY - searchWindow);
    const maxCutY = Math.min(totalHeight, idealCutY + searchWindow);

    try {
      const scanHeight = maxCutY - minCutY;
      if (scanHeight <= 2) return idealCutY;

      // Sample a subset across width for lightning fast client-side performance
      const sampleCols = 40;
      const stepX = Math.max(1, Math.floor(imgWidth / sampleCols));
      const imageData = ctx.getImageData(0, minCutY, imgWidth, scanHeight);
      const data = imageData.data;

      let bestY = idealCutY;
      let minRowVariance = Infinity;

      for (let relY = 0; relY < scanHeight; relY++) {
        let rowSumR = 0, rowSumG = 0, rowSumB = 0;
        let count = 0;

        for (let col = 0; col < sampleCols; col++) {
          const x = col * stepX;
          const pixelIndex = (relY * imgWidth + x) * 4;
          rowSumR += data[pixelIndex];
          rowSumG += data[pixelIndex + 1];
          rowSumB += data[pixelIndex + 2];
          count++;
        }

        const avgR = rowSumR / count;
        const avgG = rowSumG / count;
        const avgB = rowSumB / count;

        let variance = 0;
        for (let col = 0; col < sampleCols; col++) {
          const x = col * stepX;
          const pixelIndex = (relY * imgWidth + x) * 4;
          const dr = data[pixelIndex] - avgR;
          const dg = data[pixelIndex + 1] - avgG;
          const db = data[pixelIndex + 2] - avgB;
          variance += dr * dr + dg * dg + db * db;
        }

        // Favor empty solid color rows (low variance) and close to ideal cut
        const distancePenalty = Math.abs((minCutY + relY) - idealCutY) * 0.4;
        const totalScore = variance + distancePenalty;

        if (totalScore < minRowVariance) {
          minRowVariance = totalScore;
          bestY = minCutY + relY;
        }
      }

      return bestY;
    } catch (err) {
      console.warn("Smart cut fallback triggered:", err);
      return idealCutY;
    }
  };

  // Main Slicing Engine
  const processAndSliceImages = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProgress(5);
    setProgressStatus("Preparing canvas engine...");
    setSlicedImages([]);

    const allSlices = [];
    const totalFiles = uploadedFiles.length;

    try {
      for (let fIdx = 0; fIdx < totalFiles; fIdx++) {
        const item = uploadedFiles[fIdx];
        setProgressStatus(`Loading "${item.name}" (${fIdx + 1} of ${totalFiles})...`);

        // Load image into HTMLImageElement
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = (e) => reject(e);
          image.src = item.previewUrl;
        });

        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        // Calculate scaled dimensions
        const scaledWidth = preserveOriginalWidth ? origW : targetWidth;
        const scaleFactor = scaledWidth / origW;
        const scaledHeight = Math.round(origH * scaleFactor);

        setProgressStatus(`Rendering & scaling ${item.name} (${scaledWidth}×${scaledHeight}px)...`);

        // Create main high-density offscreen canvas
        const mainCanvas = document.createElement("canvas");
        mainCanvas.width = scaledWidth;
        mainCanvas.height = scaledHeight;
        const mainCtx = mainCanvas.getContext("2d", { willReadFrequently: true });

        // High quality bicubic scaling
        mainCtx.imageSmoothingEnabled = true;
        mainCtx.imageSmoothingQuality = "high";
        mainCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

        // Determine slices
        let currentY = 0;
        let sliceIndex = 1;
        const baseFilename = item.name.replace(/\.[^/.]+$/, "");
        const fileExt = outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg";

        while (currentY < scaledHeight) {
          let sliceHeight = targetMaxHeight;

          if (useSmartCut && (currentY + sliceHeight < scaledHeight)) {
            const cutY = findOptimalCutPoint(mainCtx, currentY, targetMaxHeight, scaledHeight, scaledWidth);
            sliceHeight = cutY - currentY;
          } else {
            sliceHeight = Math.min(targetMaxHeight, scaledHeight - currentY);
          }

          if (sliceHeight <= 0) break;

          // Create individual slice canvas
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = scaledWidth;
          sliceCanvas.height = sliceHeight;
          const sliceCtx = sliceCanvas.getContext("2d");

          // Draw the portion of the main image onto the slice canvas
          sliceCtx.drawImage(
            mainCanvas,
            0, currentY, scaledWidth, sliceHeight,
            0, 0, scaledWidth, sliceHeight
          );

          // Export as Blob
          const qualityRatio = quality / 100;
          const blob = await new Promise((resolve) => {
            sliceCanvas.toBlob((b) => resolve(b), outputFormat, qualityRatio);
          });

          const sliceUrl = URL.createObjectURL(blob);
          const formattedIndex = String(sliceIndex).padStart(3, "0");
          const sliceName = `${baseFilename}_slice_${formattedIndex}.${fileExt}`;

          allSlices.push({
            id: `${item.name}-${sliceIndex}`,
            sourceFileName: item.name,
            name: sliceName,
            url: sliceUrl,
            blob: blob,
            width: scaledWidth,
            height: sliceHeight,
            sizeKb: (blob.size / 1024).toFixed(1),
            index: sliceIndex
          });

          currentY += sliceHeight;
          sliceIndex++;

          // Update progress
          const overallProgress = Math.min(95, Math.round(((fIdx + (currentY / scaledHeight)) / totalFiles) * 90) + 5);
          setProgress(overallProgress);
          setProgressStatus(`Sliced ${sliceName} (${scaledWidth}×${sliceHeight}px)`);

          // Allow UI event loop breathing room
          await new Promise((r) => setTimeout(r, 10));
        }
      }

      setProgress(100);
      setProgressStatus(`Complete! Generated ${allSlices.length} optimized slices.`);
      setSlicedImages(allSlices);
    } catch (err) {
      console.error("Error slicing webtoon images:", err);
      alert("An error occurred during slicing. Please check console or try a smaller image.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Single Slice
  const downloadSingleSlice = (slice) => {
    const link = document.createElement("a");
    link.href = slice.url;
    link.download = slice.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download All as ZIP - Instant 1-Click Zero-Friction Download
  const downloadAllAsZip = () => {
    if (slicedImages.length === 0) return;
    executeZipDownload();
  };

  const executeZipDownload = async () => {
    if (slicedImages.length === 0) return;

    setIsZipping(true);
    setProgressStatus("Compressing all slices into ZIP archive...");

    try {
      const zip = new JSZip();
      const folderName = "ZealPlane_Webtoon_Slices";
      const folder = zip.folder(folderName);

      slicedImages.forEach((slice) => {
        folder.file(slice.name, slice.blob);
      });

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `ZealPlane_${uploadedFiles[0]?.name.replace(/\.[^/.]+$/, "") || "Webtoon"}_Slices.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      toast.success("🎉 ZIP Archive Downloaded Successfully!");
      setTimeout(() => {
        setSlicerAuthModal(true);
      }, 600);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("Failed to build ZIP archive. You can still download individual slices below.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleSlicerEmailSubmit = async (e) => {
    e.preventDefault();
    const email = slicerEmailInput.trim().toLowerCase();
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, {
          email,
          source: "webtoon_slicer_zip"
        });
      } catch (_) { }

      localStorage.setItem("zp_creator_email", email);
      setSlicerAuthModal(false);
      setSlicerEmailInput("");
      toast.success("🎉 ZIP Download Unlocked! Starting download...");
      executeZipDownload();
    } catch (err) {
      console.error("Slicer email submit error:", err);
      executeZipDownload();
    }
  };

  const handleSlicerGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) return;

      const decoded = jwtDecode(googleToken);
      const userEmail = decoded.email;

      try {
        const userRes = await axios.post(`${apiBaseUrl}/users/google-login`, { token: googleToken });
        if (userRes.data?.user) {
          const { id, username, token, profilePic } = userRes.data.user;
          localStorage.setItem("Id", id);
          localStorage.setItem("username", username);
          localStorage.setItem("token", token);
          if (profilePic) localStorage.setItem("profilePic", profilePic);
        }
      } catch (err) {
        console.warn("User google login:", err);
      }

      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, {
          email: userEmail,
          source: "webtoon_slicer_zip"
        });
      } catch (_) { }

      localStorage.setItem("zp_creator_email", userEmail);
      setSlicerAuthModal(false);
      setSlicerEmailInput("");
      toast.success(`🎉 Welcome, Creator! Downloading ZIP as ${userEmail}...`);
      executeZipDownload();
    } catch (err) {
      console.error("Slicer google auth error:", err);
      toast.error("Google login encountered an issue, starting download anyway...");
      executeZipDownload();
    }
  };

  // Toggle FAQ Accordion
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={`webtoon-slicer-page ${embedded ? "embedded-slicer-mode" : ""}`}>
      {!embedded && (
        <Helmet>
          <title>Free Webtoon Slicer & Image Splitter (LINE Webtoon & Tapas) | ZealPlane Tools</title>
          <meta
            name="description"
            content="Split long vertical manga and webtoon canvases into 800x1280 slices instantly. 100% free, private on-device processing with Smart Gutter Cut detection and 1-click ZIP download."
          />
          <meta
            name="keywords"
            content="webtoon slicer, croppy alternative, split webtoon canvas, webtoon image splitter, tapas comic slice tool, webtoon 800x1280 cropper, manga strip cutter, vertical comic slicer"
          />
          <meta name="google-adsense-platform-account" content="none" />
          <meta name="google-adsense-platform-domain" content="none" />
          <meta name="google-adsense-auto-ads" content="off" />
          <meta name="google-adsense-ads" content="none" />
          <meta name="monetization" content="none" />
          <link rel="canonical" href="https://zealplane.com/tools/webtoon-slicer" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ZealPlane Free Webtoon Slicer & Image Splitter",
              "url": "https://zealplane.com/tools/webtoon-slicer",
              "description": "Browser-based tool for comic and webtoon creators to slice vertical canvases to official LINE Webtoon (800x1280) and Tapas specifications with smart gutter detection.",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </script>
        </Helmet>
      )}

      {!embedded && <Header />}

      <main className={`slicer-main-container ${embedded ? "embedded-main" : ""}`}>
        {/* Hero Section */}
        {!embedded ? (
          <section className="slicer-hero-section">
            <div className="hero-content">
              <div className="badge-row">
                <span className="hero-badge studio-badge">
                  <Scissors size={14} /> ZealPlane Studio Suite
                </span>
                <span className="hero-badge privacy-badge">
                  <ShieldCheck size={14} /> 100% Client-Side · Zero Server Upload
                </span>
                <span className="hero-badge smart-badge">
                  <Sparkles size={14} /> Smart Safe-Cut Edge Detection
                </span>
              </div>

              <h1 className="hero-title">
                Free <span className="gradient-text">Webtoon Slicer</span> &amp; Strip Splitter
              </h1>
              <p className="hero-description">
                Turn long vertical canvas art into perfectly formatted <strong>800×1280 Webtoon</strong> and{" "}
                <strong>Tapas slices</strong> in seconds. Powered by smart gutter detection to avoid splitting dialogue bubbles,
                running 100% inside your browser for total privacy and speed.
              </p>
            </div>
          </section>
        ) : (
          <div className="embedded-slicer-header">
            <div className="badge-row">
              <span className="hero-badge privacy-badge">
                <ShieldCheck size={14} /> 100% Client-Side Processing
              </span>
              <span className="hero-badge smart-badge">
                <Sparkles size={14} /> Smart Safe-Cut Active
              </span>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="slicer-workspace-grid">
          {/* Controls Panel */}
          <div className="slicer-controls-card">
            <div className="card-header">
              <div className="title-wrap">
                <Sliders size={18} className="header-icon" />
                <h3>Slicing Configuration</h3>
              </div>
              <span className="preset-active-label">{PLATFORM_PRESETS.find(p => p.id === selectedPreset)?.name}</span>
            </div>

            {/* Presets Selector */}
            <div className="config-group">
              <label className="group-label">Platform Preset</label>
              <div className="presets-pill-list">
                {PLATFORM_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-btn ${selectedPreset === preset.id ? "active" : ""}`}
                    onClick={() => handlePresetChange(preset.id)}
                  >
                    <span className="preset-name">{preset.name}</span>
                    <span className="preset-dims">{preset.width} × {preset.maxHeight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Sliders / Inputs */}
            <div className="config-grid">
              <div className="config-field">
                <label>Target Width (px)</label>
                <input
                  type="number"
                  value={targetWidth}
                  disabled={selectedPreset !== "custom" && !preserveOriginalWidth}
                  onChange={(e) => setTargetWidth(Number(e.target.value))}
                  min="200"
                  max="4000"
                />
              </div>

              <div className="config-field">
                <label>Max Slice Height (px)</label>
                <input
                  type="number"
                  value={targetMaxHeight}
                  disabled={selectedPreset !== "custom"}
                  onChange={(e) => setTargetMaxHeight(Number(e.target.value))}
                  min="200"
                  max="4000"
                />
              </div>
            </div>

            {/* Smart Cut & Advanced Toggles */}
            <div className="toggles-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={useSmartCut}
                  onChange={(e) => setUseSmartCut(e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="toggle-info">
                  <strong>Smart Safe-Cut (Recommended)</strong>
                  <small>Scans ±60px around cut lines to split in blank panel gutters instead of cutting art.</small>
                </span>
              </label>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preserveOriginalWidth}
                  onChange={(e) => setPreserveOriginalWidth(e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="toggle-info">
                  <strong>Keep Original Canvas Width</strong>
                  <small>Only slices vertically without downscaling or resampling width.</small>
                </span>
              </label>
            </div>

            {/* Format & Compression */}
            <div className="format-quality-row">
              <div className="config-field format-field">
                <label>Export Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                >
                  <option value="image/jpeg">JPEG (Universal / Webtoon)</option>
                  <option value="image/png">PNG (Lossless High Quality)</option>
                  <option value="image/webp">WebP (Smallest File Size)</option>
                </select>
              </div>

              {outputFormat !== "image/png" && (
                <div className="config-field quality-field">
                  <div className="quality-label-row">
                    <label>Quality</label>
                    <span className="quality-value">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            {/* Action CTA */}
            <button
              type="button"
              className="slice-action-btn"
              disabled={uploadedFiles.length === 0 || isProcessing}
              onClick={processAndSliceImages}
            >
              {isProcessing ? (
                <>
                  <div className="spinner-dot"></div> Slicing Images...
                </>
              ) : (
                <>
                  <Scissors size={18} /> Slice {uploadedFiles.length > 0 ? `${uploadedFiles.length} Image(s)` : "Canvas"}
                </>
              )}
            </button>
          </div>

          {/* Upload & Dropzone Area */}
          <div className="slicer-upload-area">
            {uploadedFiles.length === 0 ? (
              <div
                className="dropzone-box"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/bmp"
                  style={{ display: "none" }}
                />
                <div className="dropzone-inner">
                  <div className="upload-icon-circle">
                    <Upload size={32} />
                  </div>
                  <h3>Drag &amp; Drop Your Webtoon Canvas Here</h3>
                  <p>Or click to browse from computer (supports PNG, JPG, WebP)</p>
                  <div className="spec-tags">
                    <span>Batch Multiple Chapters</span>
                    <span>No File Size Cap</span>
                    <span>100% Private (No Upload)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="uploaded-files-manager">
                <div className="manager-top-bar">
                  <div className="manager-title">
                    <ImageIcon size={18} />
                    <span>Uploaded Files ({uploadedFiles.length})</span>
                  </div>
                  <div className="manager-actions">
                    <button
                      type="button"
                      className="add-more-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} /> Add More
                    </button>
                    <button
                      type="button"
                      className="clear-all-btn"
                      onClick={clearAllFiles}
                    >
                      <Trash2 size={14} /> Clear
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInput}
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                {/* File Previews List */}
                <div className="file-pills-scroll">
                  {uploadedFiles.map((fileItem, idx) => (
                    <div
                      key={idx}
                      className={`file-pill-card ${activeFileIndex === idx ? "active" : ""}`}
                      onClick={() => setActiveFileIndex(idx)}
                    >
                      <img src={fileItem.previewUrl} alt={fileItem.name} className="pill-thumb" />
                      <div className="pill-meta">
                        <span className="file-name" title={fileItem.name}>{fileItem.name}</span>
                        <span className="file-size">{fileItem.size}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-pill-btn"
                        onClick={(e) => removeFile(idx, e)}
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Primary Preview Canvas / View */}
                {uploadedFiles[activeFileIndex] && (
                  <div className="active-preview-viewport">
                    <div className="viewport-header">
                      <span className="vp-name">{uploadedFiles[activeFileIndex].name}</span>
                      <span className="vp-hint">Ready for slicing</span>
                    </div>
                    <div className="vp-image-scroll">
                      <img
                        src={uploadedFiles[activeFileIndex].previewUrl}
                        alt="Canvas Preview"
                        className="full-strip-preview"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="processing-progress-card">
                <div className="progress-info">
                  <span className="status-text">{progressStatus}</span>
                  <span className="percentage-text">{progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slices Results Gallery */}
        {slicedImages.length > 0 && (
          <section className="slices-results-section">
            <div className="results-header-bar">
              <div className="results-meta">
                <h2>
                  Generated Slices <span className="highlight-count">({slicedImages.length})</span>
                </h2>
                <p>All slices formatted to {targetWidth}px wide and max {targetMaxHeight}px high.</p>
              </div>

              <div className="results-actions">
                <button
                  type="button"
                  className="download-zip-btn"
                  onClick={downloadAllAsZip}
                  disabled={isZipping}
                >
                  {isZipping ? (
                    <>Compressing ZIP...</>
                  ) : (
                    <>
                      <FileArchive size={18} /> Download All as ZIP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slices Grid */}
            <div className="slices-display-grid">
              {slicedImages.map((slice, index) => (
                <div key={slice.id} className="slice-item-card">
                  <div className="slice-thumb-wrapper">
                    <img src={slice.url} alt={slice.name} loading="lazy" />
                    <span className="slice-number-badge">#{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="slice-card-details">
                    <span className="slice-title" title={slice.name}>{slice.name}</span>
                    <div className="slice-metrics">
                      <span>{slice.width} × {slice.height}px</span>
                      <span>{slice.sizeKb} KB</span>
                    </div>
                    <button
                      type="button"
                      className="download-single-btn"
                      onClick={() => downloadSingleSlice(slice)}
                      title="Download this slice"
                    >
                      <Download size={14} /> Download Slice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creator Conversion Banner */}
        <section className="zealplane-creator-cta">
          <div className="cta-container">
            <div className="cta-content">
              <span className="cta-kicker">For Comic &amp; Webtoon Creators</span>
              <h2>Publish Your Comic on ZealPlane &amp; Build an Audience</h2>
              <p>
                Don't let your art stay locked behind restrictive creator contracts. On ZealPlane, you keep <strong>100% of your copyright</strong>,
                get featured in front of Indian &amp; global manga fans, and earn direct reader rewards.
              </p>
              <div className="cta-perks">
                <div className="perk-item">
                  <CheckCircle2 size={16} /> 100% Creator IP Ownership
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={16} /> Multi-language Hindi &amp; English Readers
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={16} /> Reader Coin Tips &amp; Upvotes
                </div>
              </div>
            </div>

            <div className="cta-button-wrap">
              <Link to="/forum/create-post" className="cta-primary-btn">
                Publish a Comic / Chapter <ExternalLink size={16} />
              </Link>
              <a href="https://zealplane.com" target="_blank" rel="noopener" className="cta-secondary-btn">
                Explore ZealPlane Originals <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* Educational / SEO Guide & Specifications Table */}
        {!embedded && (
          <section className="specs-guide-section">
            <div className="section-intro">
              <h2>Webtoon &amp; Comic Canvas Dimensions Guide (2026)</h2>
              <p>Compare the upload requirements across leading digital comic platforms:</p>
            </div>

            <div className="specs-table-container">
              <table className="specs-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Slice Width</th>
                    <th>Max Slice Height</th>
                    <th>File Limit</th>
                    <th>Formats</th>
                    <th>Gutter Slicing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>LINE Webtoon Canvas</strong></td>
                    <td>800 px (Strict)</td>
                    <td>1280 px</td>
                    <td>2.0 MB / slice</td>
                    <td>JPG, PNG</td>
                    <td>Required (10-30 slices/chapter)</td>
                  </tr>
                  <tr>
                    <td><strong>Tapas (Indie Creators)</strong></td>
                    <td>940 px</td>
                    <td>1280 – 4000 px</td>
                    <td>2.0 MB / slice</td>
                    <td>JPG, PNG, GIF</td>
                    <td>Flexible</td>
                  </tr>
                  <tr>
                    <td><strong>ZealPlane</strong></td>
                    <td>800 – 1080 px</td>
                    <td>1280 px</td>
                    <td>5.0 MB / slice</td>
                    <td>WebP, JPG, PNG</td>
                    <td>Smart Cut Supported</td>
                  </tr>
                  <tr>
                    <td><strong>Instagram Reels / Carousels</strong></td>
                    <td>1080 px</td>
                    <td>1920 px (9:16)</td>
                    <td>8.0 MB</td>
                    <td>JPG, PNG</td>
                    <td>Story format</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* In-Depth Creator Guide Callout Card (Internal Linking & SEO) */}
        {!embedded && (
          <section className="guide-deep-dive-card">
            <div className="guide-card-inner">
              <div className="guide-card-content">
                <span className="guide-badge">📚 Creator Masterclass 2026</span>
                <h2>The Ultimate Webtoon Canvas Size &amp; Slicing Guide</h2>
                <p>
                  Wondering why your art looks blurry on Webtoon Canvas? Want to know why you should <strong>never draw at 800px width</strong>,
                  and how professional manhwa studios set up canvases in Clip Studio Paint and Procreate?
                </p>
                <div className="guide-takeaways">
                  <span>✓ Official LINE Webtoon &amp; Tapas Dimensions</span>
                  <span>✓ Why Professional Artists Draw at 1600–2400px</span>
                  <span>✓ Smart Safe-Cut vs. Blind Slicing Breakdown</span>
                </div>
                <Link to="/news/webtoon-canvas-size-guide-slicing-formatting-tutorial" className="read-guide-btn">
                  Read Complete Sizing &amp; Slicing Guide &rarr;
                </Link>
              </div>
              <div className="guide-card-preview">
                <img
                  src="https://www.zealplane.com/news_assets/webtoon_slicing_guide_cover_2026.jpg"
                  alt="Webtoon Canvas Size Guide 2026"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        )}

        {/* SEO FAQ Accordion */}
        {!embedded && (
          <section className="slicer-faq-section">
            <div className="section-intro">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about webtoon slicing, canvas sizing, and export settings.</p>
            </div>

            <div className="faq-accordion-list">
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item-card ${openFaqIndex === index ? "open" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question-row">
                    <h3>{faq.q}</h3>
                    <span className="faq-chevron">
                      {openFaqIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                  {openFaqIndex === index && (
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── SUNK COST CREATOR DOWNLOAD MODAL ── */}
      {slicerAuthModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#161b26",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "32px 24px",
            maxWidth: "460px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            position: "relative"
          }}>
            <button
              onClick={() => {
                setSlicerAuthModal(false);
                // Even if closed, user still has the button to re-trigger
              }}
              style={{
                position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#888", fontSize: "20px", cursor: "pointer"
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "12px",
              border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
              ✓ {slicedImages.length} Slices Downloaded Successfully!
            </div>

            <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
              Your Comic Is Ready to Upload!
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              Formatted in official 800px Webtoon Canvas standard. Where will you share your story next?
            </p>

            {/* High Impact Primary CTA: Publish on ZealPlane */}
            <div style={{
              background: "linear-gradient(135deg, rgba(230, 57, 70, 0.18), rgba(255, 69, 0, 0.08))",
              border: "1px solid rgba(230, 57, 70, 0.35)",
              borderRadius: "14px",
              padding: "18px 16px",
              marginBottom: "20px",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>🚀</span>
                <span style={{ color: "#fff", fontWeight: "800", fontSize: "15px" }}>Publish on ZealPlane Originals</span>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px", lineHeight: "1.4" }}>
                Reach 20,000+ comic & manga readers (100K+ platform reads). 100% free creator hosting, zero commission, and instant publishing.
              </p>
              <Link
                to="/profile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#e63946",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "14px",
                  textDecoration: "none",
                  textAlign: "center"
                }}
              >
                Upload Chapter on ZealPlane (Free) →
              </Link>
            </div>

            {/* Optional Creator Newsletter / Community */}
            <div style={{
              display: "flex",
              alignItems: "center",
              margin: "14px 0",
              color: "#64748b",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.08em"
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ padding: "0 10px" }}>OPTIONAL: GET CREATOR UPDATES</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            </div>

            <form onSubmit={handleSlicerEmailSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="email"
                placeholder="Enter creator email..."
                value={slicerEmailInput}
                onChange={(e) => setSlicerEmailInput(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#3b82f6",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Subscribe
              </button>
            </form>

            <div style={{ fontSize: "12px", color: "#64748b" }}>
              🔒 Zero Spam · Weekly Creator Grants & Scaling Tips
            </div>
          </div>
        </div>
      )}

      {!embedded && <Footer />}
    </div>
  );
};

export default WebtoonSlicer;
