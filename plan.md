# Implementation Plan: Cinematic Video Integration & PiP Mode

This plan outlines how to integrate a high-engagement explainer video into a React-based web application with modern UX patterns like **Picture-in-Picture (PiP)** and **Persistent Playback**.

## 1. Overview
The goal is to provide context to new users immediately upon arrival without blocking their ability to start exploring. 
- **Auto-run**: The video modal opens by default on the first visit.
- **Picture-in-Picture**: Users can minimize the video to a corner while interacting with the main site.
- **Persistent Playback**: Switching between full-screen and mini-mode does NOT restart the video.
- **Intuitive Dismissal**: Clicking the backdrop or a prominent "Start Exploring" button minimizes the video rather than closing it.

## 2. Requirements
- **Framework**: React
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Transitions**: `tailwindcss-animate` (optional, for smooth fade/zoom)

## 3. The `VideoModal` Component
Create a new file `src/components/VideoModal.jsx`. This component handles the conditional styling for both "Full Screen" and "Mini Player" modes within a single render cycle to keep the `<iframe>` instance alive.

```javascript
import React, { useState } from "react";
import { X, PlayCircle, Minimize2, Maximize2, Map } from "lucide-react";

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) return null;

    // Handle backdrop click to minimize
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isMinimized) {
            setIsMinimized(true);
        }
    };

    return (
        <div 
            className={`fixed transition-all duration-500 ease-in-out z-[300] ${
                isMinimized 
                ? "bottom-6 right-6 w-72 sm:w-96 aspect-video shadow-2xl" 
                : "inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
            }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-stone-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-stone-800 transition-all duration-500 ${
                isMinimized ? "w-full h-full border-stone-700" : "w-full max-w-4xl aspect-video"
            }`}>
                
                {/* Internal Controls (Visible on Hover) */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity z-10">
                    <div className="flex items-center gap-2 text-white">
                        <PlayCircle size={20} className="text-yellow-400" />
                        <span className="font-bold tracking-tight uppercase text-xs">Explainer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isMinimized ? (
                            <button onClick={() => setIsMinimized(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><Minimize2 size={20} /></button>
                        ) : (
                            <button onClick={() => setIsMinimized(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><Maximize2 size={20} /></button>
                        )}
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><X size={20} /></button>
                    </div>
                </div>

                {/* Video Iframe (Persistent) */}
                <div className="flex-1 w-full relative">
                    <iframe src={videoUrl} className="absolute inset-0 w-full h-full border-0" allow="autoplay" />
                </div>

                {/* Prominent Action Button (Full Mode Only) */}
                {!isMinimized && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                            className="pointer-events-auto mt-60 bg-yellow-400 text-stone-900 px-8 py-4 rounded-full font-black text-lg shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 animate-bounce"
                        >
                            <Map size={24} /> START EXPLORING
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
```

## 4. App Integration
In your main `App.js` or `App.jsx`, manage the modal state and provide a way for users to re-trigger the video.

### A. State Management
```javascript
const [isVideoOpen, setIsVideoOpen] = useState(true); // Open by default
```

### B. Header Trigger
Add a button to your navigation bar so the "Explainer" is always accessible.
```javascript
<button onClick={() => setIsVideoOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-full border border-stone-200 shadow-sm transition-colors text-sm font-medium">
    <PlayCircle size={18} className="animate-pulse" />
    <span>Watch Intro</span>
</button>
```

### C. Modal Placement
Place the `VideoModal` at the bottom of your root component.
```javascript
<VideoModal 
    isOpen={isVideoOpen} 
    onClose={() => setIsVideoOpen(false)} 
    videoUrl="YOUR_VIDEO_PREVIEW_URL" 
/>
```

## 5. Key UX Details to Note
1.  **Keep the Iframe Alive**: The `VideoModal` should change its *container's* classes rather than using a different component for the mini-player. Removing the component from the DOM will kill the video stream and force a restart.
2.  **Pointer Events**: In "Full Mode", ensure the backdrop handles the `onClick` to minimize, but the `<iframe>` itself allows interaction (if needed).
3.  **Z-Index**: Ensure the `z-index` of the VideoModal is higher than your header (`z-[300]` recommended) to ensure it sits above all other UI elements.
