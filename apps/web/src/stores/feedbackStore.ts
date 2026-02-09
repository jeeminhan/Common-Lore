import { create } from 'zustand';

interface FeedbackState {
  isOpen: boolean;
  isAutoPopup: boolean;
  hasAutoPopupShown: boolean;
  timerStarted: boolean;
}

interface FeedbackActions {
  openFeedback: (isAuto?: boolean) => void;
  closeFeedback: () => void;
  startTimer: () => void;
}

export const useFeedbackStore = create<FeedbackState & FeedbackActions>(
  (set, get) => ({
    isOpen: false,
    isAutoPopup: false,
    hasAutoPopupShown: false,
    timerStarted: false,

    openFeedback: (isAuto = false) => {
      set({
        isOpen: true,
        isAutoPopup: isAuto,
        hasAutoPopupShown: true,
      });
    },

    closeFeedback: () => {
      set({ isOpen: false, isAutoPopup: false });
    },

    startTimer: () => {
      const { timerStarted } = get();
      if (timerStarted) return;
      set({ timerStarted: true });

      setTimeout(() => {
        const { hasAutoPopupShown } = get();
        if (!hasAutoPopupShown) {
          get().openFeedback(true);
        }
      }, 5 * 60 * 1000); // 5 minutes
    },
  })
);
