import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const isBotOrPrerender = () => {
    if (typeof window === "undefined" || !window.navigator || !window.navigator.userAgent) {
        return false;
    }
    const userAgent = window.navigator.userAgent.toLowerCase();
    const botPatterns = [
        "prerender",
        "googlebot",
        "bingbot",
        "yandex",
        "baiduspider",
        "facebookexternalhit",
        "twitterbot",
        "rogersbot",
        "linkedinbot",
        "embedly",
        "quora link preview",
        "showyoubot",
        "outbrain",
        "pinterest/0.",
        "developers.google.com/+/web/snippet",
        "slackbot",
        "vkshare",
        "w3c_validator",
        "redditbot",
        "applebot",
        "whatsapp",
        "flipboard",
        "tumblr",
        "bitlybot",
        "skypeuripreview",
        "nuzzel",
        "discordbot",
        "google page speed",
        "qwantify",
        "pinterestbot",
        "telegrambot"
    ];
    return botPatterns.some(pattern => userAgent.includes(pattern));
};

const Img = ({ src, className, alt = "" }) => {
    if (isBotOrPrerender()) {
        return <img className={className || ""} src={src} alt={alt} />;
    }
    return (
        <LazyLoadImage
            className={className || ""}
            alt={alt}
            effect="blur"
            src={src}
        />
    );
};

export default Img;
