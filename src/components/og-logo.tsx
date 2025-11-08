"use client";

import { useEffect } from "react";

export function OgLogo() {
  useEffect(() => {
    // Check if the meta tag already exists
    let metaTag = document.querySelector('meta[property="og:logo"]');
    
    if (!metaTag) {
      // Create and add the meta tag
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", "og:logo");
      metaTag.setAttribute("content", "https://www.soti.house/logo.png");
      document.head.appendChild(metaTag);
    } else {
      // Update existing tag
      metaTag.setAttribute("content", "https://www.soti.house/logo.png");
    }
  }, []);

  return null;
}

