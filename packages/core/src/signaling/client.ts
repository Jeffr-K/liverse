import { SignalingMessage } from './protocol';

export class SignalingClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((msg: SignalingMessage) => void)[] = [];

  constructor(private url: string) { }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 이미 연결된 경우 처리
      if (this.ws?.readyState === WebSocket.OPEN) {
        return resolve();
      }

      console.log(`📡 시그널링 서버 접속 시도: ${this.url}`);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ 시그널링 서버 연결 성공');
        resolve();
      };

      this.ws.onerror = (error) => {
        // 상세 에러 로깅
        console.error('❌ 시그널링 서버 연결 에러:', error);
        // 에러 객체를 구체화해서 reject
        reject(new Error(`시그널링 서버(${this.url})에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.`));
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: SignalingMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(msg));
        } catch (e) {
          console.error('❌ 메시지 파싱 에러:', e);
        }
      };

      this.ws.onclose = (event) => {
        console.warn(`⚠️ 연결 종료 (Code: ${event.code}). 재연결 로직이 필요합니다.`);
        this.ws = null;
        // Tip: 여기서 setTimeout을 이용한 Exponential Backoff 재연결을 시도할 수 있습니다.
      };
    });
  }

  onMessage(handler: (msg: SignalingMessage) => void) {
    this.messageHandlers.push(handler);
  }

  send(msg: SignalingMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn('❌ WebSocket이 열려있지 않아 메시지를 전송하지 못했습니다:', msg.type);
    }
  }

  // 연결 해제 메서드 (Cleanup용)
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
