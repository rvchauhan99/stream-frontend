"use client";

import { useRef } from "react";
import { HandThumbUpIcon, HandThumbDownIcon, HeartIcon, ChatBubbleLeftIcon, ShareIcon, DocumentTextIcon, FlagIcon } from "@heroicons/react/24/outline";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            ref={videoRef}
            src="https://iframe.mediadelivery.net/embed/410732/dec63cd9-c5d6-4e6a-8dbd-a7c618341ce5?token=0dbf2518b5fbfd57c22c95769ec4fb7bd524c9a29343f8903629a053ec0c9f66&expires=1745475869&autoplay=true&loop=false&muted=false&preload=true&responsive=true"
            loading="lazy"
            style={{ border: "0", position: "absolute", top: "0", height: "100%", width: "100%" }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen={true}
          />
        </div>
      </div>

      {/* Video Interaction Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Like/Dislike */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-l-full">
            <HandThumbUpIcon className="w-6 h-6" />
          </button>
          <span className="px-2 bg-[#1a1f25] text-[15px]">2,542 / 7</span>
          <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-r-full">
            <HandThumbDownIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Favorite */}
        <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <HeartIcon className="w-6 h-6" />
          <span className="text-[15px]">Favorite</span>
        </button>

        {/* Comments */}
        <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <ChatBubbleLeftIcon className="w-6 h-6" />
          <span className="text-[15px]">Comments 10</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <ShareIcon className="w-6 h-6" />
          <span className="text-[15px]">Share</span>
        </button>

        <div className="h-6 w-px bg-gray-700 mx-2" />

        {/* About */}
        <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <DocumentTextIcon className="w-6 h-6" />
          <span className="text-[15px]">About</span>
        </button>

        {/* Flag */}
        <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <FlagIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
