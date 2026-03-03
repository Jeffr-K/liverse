import { useCallback, useState } from 'react';
import { useLiverse } from '../';

export const usePublisher = () => {
  const sdk = useLiverse();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // useCallback을 사용하여 불필요한 리렌더링 방지 (React 최적화)
  const publish = useCallback(async (roomId: string, token: string) => {
    try {
      setIsPublishing(true);

      // 1. 미디어 권한 획득
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);

      // 2. 시그널링 서버 접속 및 룸 조인 (core에서 정의한 이름은 joinRoom)
      await sdk.joinRoom(roomId, token);

      // 3. WebRTC 송출 시작
      await sdk.publish(mediaStream);

    } catch (error) {
      console.error('❌ Failed to publish stream:', error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, [sdk]);

  // 4. 스트림 중지 및 리소스 정리 기능 추가
  const stop = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    sdk.leave();
  }, [stream, sdk]);

  return { stream, publish, stop, isPublishing };
};
