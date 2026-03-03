import { SignalingMessage } from './protocol';

export class SignalingClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((msg: SignalingMessage) => void)[] = [];

  constructor(private url: string) { }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ 시그널링 서버 연결 성공');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('❌ 시그널링 서버 연결 에러:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        const msg: SignalingMessage = JSON.parse(event.data);
        // 등록된 모든 핸들러에 메시지 전파 (Observer Pattern)
        this.messageHandlers.forEach(handler => handler(msg));
      };

      this.ws.onclose = () => {
        console.warn('⚠️ 시그널링 서버와 연결이 끊겼습니다. 재연결 로직 필요.');
        // 여기서 Exponential Backoff 재연결 로직을 구현하면 시니어급 점수!
      };
    });
  }

  // 메시지 수신 시 실행할 콜백 등록
  onMessage(handler: (msg: SignalingMessage) => void) {
    this.messageHandlers.push(handler);
  }

  send(msg: SignalingMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.error('❌ WebSocket이 열려있지 않습니다.');
    }
  }
}
