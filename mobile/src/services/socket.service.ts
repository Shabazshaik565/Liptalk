import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { secureStorage } from '../utils/secureStorage';

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;
  private interTabChannel: any = null;

  // Listeners for calling mesh
  private incomingCallListeners: Set<(data: any) => void> = new Set();
  private callAcceptedListeners: Set<(data: any) => void> = new Set();
  private callDeclinedListeners: Set<(data: any) => void> = new Set();
  private callCancelledListeners: Set<(data: any) => void> = new Set();
  private callBusyListeners: Set<(data: any) => void> = new Set();
  private callPeerMuteListeners: Set<(data: any) => void> = new Set();
  private callSignalListeners: Set<(data: any) => void> = new Set();
  private callEndedListeners: Set<(data: any) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.interTabChannel = new (window as any).BroadcastChannel('liptalk_call_mesh');
        this.interTabChannel.onmessage = (event: any) => {
          this.handleInterTabMessage(event.data);
        };
      } catch (_) {}
    }
  }

  private handleInterTabMessage(msg: any) {
    if (!msg || !msg.type) return;
    const currentUser = useAuthStore.getState().user;
    const currentUserId = currentUser?.id || 'usr_curr_01';

    switch (msg.type) {
      case 'call_initiate':
        if (msg.payload.receiverId === currentUserId) {
          this.incomingCallListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_accept':
        if (msg.payload.callerId === currentUserId) {
          this.callAcceptedListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_decline':
        if (msg.payload.callerId === currentUserId) {
          this.callDeclinedListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_cancel':
        if (msg.payload.receiverId === currentUserId) {
          this.callCancelledListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_signal':
        if (msg.payload.targetUserId === currentUserId) {
          this.callSignalListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_mute':
        if (msg.payload.targetUserId === currentUserId) {
          this.callPeerMuteListeners.forEach((cb) => cb(msg.payload));
        }
        break;
      case 'call_end':
        if (msg.payload.peerId === currentUserId) {
          this.callEndedListeners.forEach((cb) => cb(msg.payload));
        }
        break;
    }
  }

  async connect(): Promise<Socket> {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    this.isConnecting = true;
    const token = (await secureStorage.getToken()) || useAuthStore.getState().token;
    const user = useAuthStore.getState().user;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      auth: {
        token: token || '',
        userId: user?.id || 'usr_curr_01',
      },
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (err) => {
      this.isConnecting = false;
    });

    return this.socket;
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  sendMessage(data: {
    conversationId: string;
    senderId: string;
    text: string;
    clientTempId?: string;
  }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', data);
    }
  }

  emitTypingStart(conversationId: string, userId: string, userName?: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_start', { conversationId, userId, userName });
    }
  }

  emitTypingStop(conversationId: string, userId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_stop', { conversationId, userId });
    }
  }

  emitMessageRead(conversationId: string, messageId: string, readerId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message_read', { conversationId, messageId, readerId });
    }
  }

  onNewMessage(callback: (msg: any) => void) {
    if (this.socket) {
      this.socket.off('new_message');
      this.socket.on('new_message', callback);
    }
  }

  onUserTyping(callback: (data: { conversationId: string; userId: string; userName?: string }) => void) {
    if (this.socket) {
      this.socket.off('user_typing');
      this.socket.on('user_typing', callback);
    }
  }

  onUserStopTyping(callback: (data: { conversationId: string; userId: string }) => void) {
    if (this.socket) {
      this.socket.off('user_stop_typing');
      this.socket.on('user_stop_typing', callback);
    }
  }

  onPresenceUpdate(callback: (data: { userId: string; status: 'online' | 'offline' }) => void) {
    if (this.socket) {
      this.socket.off('presence_update');
      this.socket.on('presence_update', callback);
    }
  }

  // ==========================================
  // PHASE 6: PRESENCE & WEBRTC CALLING
  // ==========================================

  setPresence(status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'IN_CALL', userId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('presence_set', { userId, status });
    }
  }

  onPresenceStatus(callback: (data: { userId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.off('presence_status');
      this.socket.on('presence_status', callback);
    }
  }

  initiateCall(payload: {
    callerId: string;
    callerName: string;
    callerAvatar?: string;
    receiverId: string;
    callType: 'VOICE' | 'VIDEO';
  }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_initiate', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_initiate',
      payload: { ...payload, callId: 'call_' + Date.now() },
    });
  }

  acceptCall(payload: { callId: string; userId: string; callerId: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_accept', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_accept',
      payload,
    });
  }

  declineCall(payload: { callId: string; callerId: string; reason?: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_decline', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_decline',
      payload,
    });
  }

  cancelCall(payload: { callId: string; callerId: string; receiverId: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_cancel', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_cancel',
      payload,
    });
  }

  sendMuteState(payload: { callId: string; targetUserId: string; isMuted: boolean }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_mute', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_mute',
      payload,
    });
  }

  sendCallSignal(payload: { targetUserId: string; signal: any }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_signal', payload);
    }
    const currentUserId = useAuthStore.getState().user?.id || 'usr_curr_01';
    this.interTabChannel?.postMessage({
      type: 'call_signal',
      payload: { ...payload, senderId: currentUserId },
    });
  }

  endCall(payload: { callId: string; userId: string; peerId: string; durationSeconds?: number }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_end', payload);
    }
    this.interTabChannel?.postMessage({
      type: 'call_end',
      payload,
    });
  }

  onIncomingCall(callback: (data: any) => void) {
    this.incomingCallListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_incoming');
      this.socket.on('call_incoming', callback);
    }
  }

  onCallAccepted(callback: (data: any) => void) {
    this.callAcceptedListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_accepted');
      this.socket.on('call_accepted', callback);
    }
  }

  onCallDeclined(callback: (data: any) => void) {
    this.callDeclinedListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_declined');
      this.socket.on('call_declined', callback);
    }
  }

  onCallCancelled(callback: (data: any) => void) {
    this.callCancelledListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_cancelled');
      this.socket.on('call_cancelled', callback);
    }
  }

  onCallBusy(callback: (data: any) => void) {
    this.callBusyListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_busy');
      this.socket.on('call_busy', callback);
    }
  }

  onCallPeerMute(callback: (data: { isMuted: boolean }) => void) {
    this.callPeerMuteListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_peer_mute');
      this.socket.on('call_peer_mute', callback);
    }
  }

  onCallMissed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('call_missed');
      this.socket.on('call_missed', callback);
    }
  }

  onCallSignal(callback: (data: any) => void) {
    this.callSignalListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_signal');
      this.socket.on('call_signal', callback);
    }
  }

  onCallEnded(callback: (data: any) => void) {
    this.callEndedListeners.add(callback);
    if (this.socket) {
      this.socket.off('call_ended');
      this.socket.on('call_ended', callback);
    }
  }

  // ==========================================
  // PHASE 6: LIVE ROOMS
  // ==========================================

  joinLiveRoom(payload: { roomId: string; userId: string; userName: string; userAvatar?: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room_join', payload);
    }
  }

  leaveLiveRoom(payload: { roomId: string; userId: string; userName?: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room_leave', payload);
    }
  }

  sendLiveRoomMessage(payload: { roomId: string; senderId: string; text: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room_message', payload);
    }
  }

  raiseHandLiveRoom(payload: { roomId: string; userId: string; userName: string; userAvatar?: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room_raise_hand', payload);
    }
  }

  sendLiveRoomReaction(payload: { roomId: string; reaction: string; userId: string }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room_reaction', payload);
    }
  }

  onLiveRoomMessage(callback: (msg: any) => void) {
    if (this.socket) {
      this.socket.off('room_new_message');
      this.socket.on('room_new_message', callback);
    }
  }

  onLiveRoomReaction(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('room_reaction_triggered');
      this.socket.on('room_reaction_triggered', callback);
    }
  }

  onLiveRoomHandRaised(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('room_hand_raised');
      this.socket.on('room_hand_raised', callback);
    }
  }

  onLiveRoomUserJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('room_user_joined');
      this.socket.on('room_user_joined', callback);
    }
  }

  onLiveRoomUserLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('room_user_left');
      this.socket.on('room_user_left', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();

