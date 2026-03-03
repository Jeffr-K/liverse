export type SignalingMessage =
  | { type: 'join'; roomId: string; userId: string; token: string }
  | { type: 'offer'; sdp: string }
  | { type: 'answer'; sdp: string }
  | { type: 'candidate'; candidate: any }
  | { type: 'error'; message: string };
