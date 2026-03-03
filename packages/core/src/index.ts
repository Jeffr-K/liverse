import { PeerManager } from './connection/peer';
import { SignalingClient } from './signaling/client';
import { LiverseConfig } from './types';

export class LiverseCore {
  private signaling: SignalingClient;
  private peer: PeerManager | null = null;
  private config: LiverseConfig;

  constructor(config: LiverseConfig) {
    // 기본값 처리: signalingUrl이 없을 경우를 대비
    this.config = {
      signalingUrl: 'ws://localhost:9090',
      ...config
    };

    this.signaling = new SignalingClient(this.config.signalingUrl!);
    this.setupSignaling();
  }

  private setupSignaling() {
    this.signaling.onMessage(async (msg) => {
      // 룸 조인 전이나 연결 시도 전에는 peer가 없을 수 있으므로 방어 로직 필요
      if (!this.peer) return;

      switch (msg.type) {
        case 'answer':
          await this.peer.setAnswer(msg.sdp);
          break;
        case 'candidate':
          await this.peer.addIceCandidate(msg.candidate);
          break;
      }
    });
  }

  /**
   * 룸에 접속 (시그널링 서버 연결 보장)
   */
  async joinRoom(roomId: string, token: string): Promise<void> {
    if (this.signaling) {
      await this.signaling.connect();
      this.signaling.send({
        type: 'join',
        roomId,
        userId: 'anonymous',
        token
      });
    }
  }

  /**
   * 미디어 송출 시작
   */
  async publish(stream: MediaStream) {
    // PeerManager 생성 시 config의 iceServers 전달 (기본값 처리)
    this.peer = new PeerManager(this.config.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }]);

    // ICE 발생 시 시그널링 전송
    this.peer.onIceCandidate((candidate) => {
      this.signaling.send({
        type: 'candidate',
        candidate: candidate.toJSON()
      });
    });

    // 트랙 추가 및 오퍼 생성
    this.peer.addTracks(stream);
    const offer = await this.peer.createOffer();

    // 시그널링을 통해 Offer 전송
    this.signaling.send({
      type: 'offer',
      sdp: offer.sdp!
    });
  }

  /**
   * 리소스 해제
   */
  leave() {
    this.peer?.close();
    this.peer = null;
    // 시그널링 소켓은 필요에 따라 유지하거나 닫음
  }
}
