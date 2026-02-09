import { motion } from 'framer-motion';
import { useFeedbackStore } from '../../stores/feedbackStore';

export default function FeedbackButton() {
  const { isOpen, openFeedback } = useFeedbackStore();

  if (isOpen) return null;

  return (
    <motion.button
      onClick={() => openFeedback()}
      className="fixed bottom-6 right-6 z-40 bg-purple text-white px-4 py-3 rounded-full shadow-lg hover:bg-purple-light transition-all flex items-center gap-3 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
      <span className="text-sm font-semibold whitespace-nowrap">Give Feedback</span>
    </motion.button>
  );
}
