import { create } from 'zustand';

interface VideoState {
    isOpen: boolean;
    videoUrl: string;
    openVideo: (url?: string) => void;
    closeVideo: () => void;
}

// Default video URL (you can change this to your actual YouTube/Vimeo embed URL)
const DEFAULT_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

export const useVideoStore = create<VideoState>((set) => ({
    isOpen: true, // Open by default as per plan.md
    videoUrl: DEFAULT_VIDEO_URL,
    openVideo: (url) => set({ isOpen: true, videoUrl: url || DEFAULT_VIDEO_URL }),
    closeVideo: () => set({ isOpen: false }),
}));
