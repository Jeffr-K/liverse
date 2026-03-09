import { LiverseProvider, usePublisher } from '@liverse/react';
import { useEffect, useRef } from 'react';

function Broadcaster() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, publish, stop, isPublishing } = usePublisher();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // 공통 스타일 객체들
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f172a', // 다크 네이비 배경
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    videoWrapper: {
      position: 'relative' as const,
      width: '100%',
      maxWidth: '800px',
      aspectRatio: '16 / 9',
      backgroundColor: '#000',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid #334155',
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    liveBadge: {
      position: 'absolute' as const,
      top: '20px',
      left: '20px',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
    },
    button: (isActive: boolean) => ({
      marginTop: '32px',
      padding: '16px 48px',
      borderRadius: '9999px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: isActive ? '#334155' : '#3b82f6',
      color: 'white',
      transition: 'all 0.2s ease',
      boxShadow: isActive ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
    }),
  };

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>Liverse SDK Demo</h1>
        <p style={{ color: '#94a3b8' }}>Real-time Live Commerce Streaming</p>
      </header>

      <div style={styles.videoWrapper}>
        <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
        {isPublishing && <div style={styles.liveBadge}>LIVE</div>}
      </div>

      <button
        style={styles.button(!!stream)}
        onClick={() => stream ? stop() : publish('room-1', 'token')}
      >
        {isPublishing ? 'Connecting...' : stream ? 'Stop Streaming' : 'Start Live Broadcast'}
      </button>
    </div>
  );
}

function App() {
  return (
    <LiverseProvider apiKey="dev-key" signalingUrl="ws://localhost:9090/ws">
      <Broadcaster />
    </LiverseProvider>
  );
}

export default App;
