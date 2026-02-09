import { useCallback } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import { useRoomStore } from '@/stores/roomStore';

export function useSocket() {
  // Connect to socket
  const connect = useCallback(async (sessionToken?: string) => {
    useRoomStore.getState().setConnecting(true);
    useRoomStore.getState().setConnectionError(null);

    try {
      await connectSocket(sessionToken);
      useRoomStore.getState().setConnected(true);
    } catch (error) {
      useRoomStore.getState().setConnectionError(
        error instanceof Error ? error.message : 'Connection failed'
      );
      useRoomStore.getState().setConnected(false);
    }
  }, []);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    disconnectSocket();
    useRoomStore.getState().setConnected(false);
  }, []);

  // Emit functions
  const emit = useCallback(() => {
    const socket = getSocket();

    return {
      createRoom: (data: { hostName: string; roomName?: string }) => {
        console.log('Emitting room:create', data);
        socket.emit('room:create', data);
      },

      joinRoom: (data: { roomCode: string; playerName: string }) => {
        console.log('Emitting room:join', data);
        socket.emit('room:join', data);
      },

      leaveRoom: (roomCode: string) => {
        socket.emit('room:leave', { roomCode });
      },

      startGame: (roomCode: string) => {
        socket.emit('game:start', { roomCode });
      },

      playCard: (roomCode: string, cardId: string) => {
        socket.emit('game:play_card', { roomCode, cardId });
      },

      bridgePass: (roomCode: string, reason: 'pass' | 'under_construction') => {
        socket.emit('game:bridge_pass', { roomCode, reason });
      },

      answerComplete: (roomCode: string, highlight?: boolean) => {
        socket.emit('game:answer_complete', { roomCode, highlight });
      },

      actionReferral: (
        roomCode: string,
        targetPlayerId: string,
        cardId: string
      ) => {
        socket.emit('game:action_referral', { roomCode, targetPlayerId, cardId });
      },

      actionSharedTableComplete: (roomCode: string) => {
        socket.emit('game:action_shared_table_complete', { roomCode });
      },

      actionTranslatorComplete: (roomCode: string) => {
        socket.emit('game:action_translator_complete', { roomCode });
      },

      actionExperiment: (
        roomCode: string,
        choice: 'veto' | 'challenge',
        targetPlayerId?: string
      ) => {
        socket.emit('game:action_experiment', {
          roomCode,
          choice,
          targetPlayerId,
        });
      },

      submitReflection: (roomCode: string, reflection: string) => {
        socket.emit('game:final_reflection', { roomCode, reflection });
      },

      highlightMoment: (roomCode: string, momentId: string) => {
        socket.emit('session:highlight_moment', { roomCode, momentId });
      },

      facilitatorPause: (roomCode: string) => {
        socket.emit('facilitator:pause', { roomCode });
      },

      facilitatorResume: (roomCode: string) => {
        socket.emit('facilitator:resume', { roomCode });
      },

      facilitatorSkipTurn: (roomCode: string) => {
        socket.emit('facilitator:skip_turn', { roomCode });
      },
    };
  }, []);

  return {
    connect,
    disconnect,
    emit: emit(),
    isConnected: useRoomStore((state) => state.isConnected),
    isConnecting: useRoomStore((state) => state.isConnecting),
    connectionError: useRoomStore((state) => state.connectionError),
  };
}
