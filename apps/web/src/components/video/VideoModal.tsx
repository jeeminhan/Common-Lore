import React, { useState } from "react";
import { X, PlayCircle, Minimize2, Maximize2, Map } from "lucide-react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) return null;

    // Handle backdrop click to minimize
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isMinimized) {
            setIsMinimized(true);
        }
    };

    return (
        <div
            className={`fixed transition-all duration-500 ease-in-out z-[300] ${isMinimized
                    ? "bottom-6 right-6 w-72 sm:w-96 aspect-video shadow-2xl"
                    : "inset-0 bg-navy-900/90 backdrop-blur-md flex items-center justify-center p-4"
                }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-navy-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-white/10 transition-all duration-500 ${isMinimized ? "w-full h-full border-white/20" : "w-full max-w-4xl aspect-video"
                }`}>

                {/* Internal Controls (Visible on Hover) */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity z-10 text-white">
                    <div className="flex items-center gap-2">
                        <PlayCircle size={20} className="text-purple" />
                        <span className="font-bold tracking-tight uppercase text-xs">How to Play</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isMinimized ? (
                            <button onClick={() => setIsMinimized(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Minimize2 size={20} /></button>
                        ) : (
                            <button onClick={() => setIsMinimized(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Maximize2 size={20} /></button>
                        )}
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Video Iframe (Persistent) */}
                <div className="flex-1 w-full relative">
                    <iframe
                        src={videoUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Prominent Action Button (Full Mode Only) */}
                {!isMinimized && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-16 pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                            className="pointer-events-auto bg-purple text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-base md:text-lg shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 animate-bounce"
                        >
                            <Map size={24} /> START EXPLORING
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoModal;
