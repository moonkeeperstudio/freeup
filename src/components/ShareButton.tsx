"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createShareLinkFromLocalStorage, createShareLinkFromAllLocalStorage, copyToClipboard } from "@/utils/urlState";

interface ShareButtonProps {
  /** Specific localStorage keys to include in the share link. If not provided, shares all localStorage */
  localStorageKeys?: string[];
  variant?: "solid" | "outline" | "icon-text" | "icon-only";
  size?: "small" | "normal" | "large";
}

export function ShareButton({ 
  localStorageKeys, 
  variant = "outline", 
  size = "normal" 
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Create share link from localStorage
    const shareUrl = localStorageKeys 
      ? createShareLinkFromLocalStorage(localStorageKeys)
      : createShareLinkFromAllLocalStorage();
    
    const success = await copyToClipboard(shareUrl);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      leftIcon={
        copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        )
      }
    >
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}

