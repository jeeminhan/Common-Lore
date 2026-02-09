import { create } from 'zustand';
import type { Session, SessionMoment, FinalReflection } from '@crossings/shared';

interface SessionStore {
  // State
  session: Session | null;
  isRecordingConsented: boolean;

  // Actions
  setSession: (session: Session) => void;
  addMoment: (moment: SessionMoment) => void;
  highlightMoment: (momentId: string) => void;
  unhighlightMoment: (momentId: string) => void;
  addReflection: (reflection: FinalReflection) => void;
  setRecordingConsent: (consented: boolean) => void;
  endSession: (endedAt: Date) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  isRecordingConsented: false,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  setSession: (session) => set({ session }),

  addMoment: (moment) => {
    const current = get().session;
    if (!current || !get().isRecordingConsented) return;
    set({
      session: {
        ...current,
        moments: [...current.moments, moment],
      },
    });
  },

  highlightMoment: (momentId) => {
    const current = get().session;
    if (!current) return;

    // Add to highlights array
    if (!current.highlights.includes(momentId)) {
      set({
        session: {
          ...current,
          highlights: [...current.highlights, momentId],
          moments: current.moments.map((m) =>
            m.id === momentId ? { ...m, isHighlighted: true } : m
          ),
        },
      });
    }
  },

  unhighlightMoment: (momentId) => {
    const current = get().session;
    if (!current) return;

    set({
      session: {
        ...current,
        highlights: current.highlights.filter((id) => id !== momentId),
        moments: current.moments.map((m) =>
          m.id === momentId ? { ...m, isHighlighted: false } : m
        ),
      },
    });
  },

  addReflection: (reflection) => {
    const current = get().session;
    if (!current) return;

    // Avoid duplicates
    if (current.finalReflections.some((r) => r.playerId === reflection.playerId)) {
      set({
        session: {
          ...current,
          finalReflections: current.finalReflections.map((r) =>
            r.playerId === reflection.playerId ? reflection : r
          ),
        },
      });
    } else {
      set({
        session: {
          ...current,
          finalReflections: [...current.finalReflections, reflection],
        },
      });
    }
  },

  setRecordingConsent: (consented) => set({ isRecordingConsented: consented }),

  endSession: (endedAt) => {
    const current = get().session;
    if (!current) return;

    const startedAt = new Date(current.startedAt);
    const duration = Math.floor(
      (endedAt.getTime() - startedAt.getTime()) / 60000
    ); // minutes

    set({
      session: {
        ...current,
        endedAt,
        duration,
      },
    });
  },

  reset: () => set(initialState),
}));

// Selectors
export const selectHighlightedMoments = (state: SessionStore) => {
  if (!state.session) return [];
  return state.session.moments.filter((m) => m.isHighlighted);
};

export const selectMomentsBySuit = (state: SessionStore, suit: string) => {
  if (!state.session) return [];
  return state.session.moments.filter((m) => m.card?.suit === suit);
};

export const selectSessionDuration = (state: SessionStore) => {
  return state.session?.duration ?? 0;
};
