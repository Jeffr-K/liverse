/**
 * Liverse SDK 초기화 설정
 */
export interface LiverseConfig {
  /** 브리바에서 발급받은 프로젝트 API 키 */
  apiKey: string;

  /** * 시그널링 서버 주소 (기본값: ws://localhost:9090)
   * 개발/운영 환경에 따라 .env에서 주입받기 용이하게 설계
   */
  signalingUrl?: string;

  /** * WebRTC ICE 서버 설정 (STUN/TURN)
   * 기업 내부 망(Firewall) 환경 대응을 위해 커스텀 설정을 허용해야 함
   */
  iceServers?: RTCIceServer[];

  /** 로깅 레벨 (debug, info, warn, error) */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';

  /** 자동 재연결 시도 횟수 (기본값: 5) */
  maxRetries?: number;
}

/**
 * 사용자 정보 타입
 */
export interface LiverseUser {
  id: string;
  name?: string;
  metadata?: Record<string, any>;
}
