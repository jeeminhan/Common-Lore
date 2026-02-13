import FeedbackButton from './feedback/FeedbackButton';
import FeedbackModal from './feedback/FeedbackModal';
import VideoModal from './video/VideoModal';
import { useVideoStore } from '../stores/videoStore';

export default function GlobalOverlay() {
    const { isOpen: isVideoOpen, closeVideo, videoUrl } = useVideoStore();

    return (
        <>
            <FeedbackButton />
            <FeedbackModal />
            <VideoModal
                isOpen={isVideoOpen}
                onClose={closeVideo}
                videoUrl={videoUrl}
            />
        </>
    );
}
