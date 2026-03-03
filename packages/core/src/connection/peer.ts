export class PeerManager {
  private pc: RTCPeerConnection;

  constructor(iceServers: RTCIceServer[]) {
    this.pc = new RTCPeerConnection({ iceServers });
  }

  // 트랙 추가 및 스트림 바인딩
  addTracks(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream);
    });
  }

  // 로컬 Offer 생성
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  // 서버로부터 받은 Answer 설정
  async setAnswer(sdp: string) {
    await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
  }

  // ICE Candidate 처리
  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // 이벤트 바인딩 헬퍼
  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.pc.onicecandidate = (event) => {
      if (event.candidate) callback(event.candidate);
    };
  }

  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
    this.pc.onconnectionstatechange = () => callback(this.pc.connectionState);
  }

  close() {
    this.pc.close();
  }
}
