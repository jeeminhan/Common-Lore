import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedbackStore } from '../../stores/feedbackStore';

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdPBg6plGCeigKzhRRuNzFqRxxlGmnlKr9OWdK1tHP8mi93mg/viewform?embedded=true';

export default function FeedbackModal() {
  const { isOpen, isAutoPopup, closeFeedback } = useFeedbackStore();
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy-900/80 backdrop-blur-md"
            onClick={closeFeedback}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl h-[80vh] bg-card-face rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <h3 className="font-serif font-bold text-navy-900 text-lg">
                Common Lore Feedback
              </h3>
              <button
                onClick={closeFeedback}
                className="text-gray-400 hover:text-navy-900 p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Loading spinner */}
            {loading && (
              <div className="absolute inset-0 top-[57px] flex items-center justify-center bg-card-face z-10">
                <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={FORM_URL}
                className="w-full h-full border-0"
                onLoad={() => setLoading(false)}
                title="Common Lore Feedback Form"
              >
                Loading...
              </iframe>
            </div>

            {/* Auto-popup note */}
            {isAutoPopup && (
              <div className="p-3 bg-purple text-white text-xs text-center">
                Thank you for playing Common Lore! We'd love to hear your thoughts.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
