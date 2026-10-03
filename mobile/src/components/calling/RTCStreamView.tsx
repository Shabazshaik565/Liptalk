import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

let NativeRTCView: any = null;
if (Platform.OS !== 'web') {
  try {
    const webrtc = require('react-native-webrtc');
    NativeRTCView = webrtc.RTCView;
  } catch (err) {
    console.warn('Native RTCView not available:', err);
  }
}

interface RTCStreamViewProps {
  stream: any;
  mirror?: boolean;
  objectFit?: 'cover' | 'contain';
  style?: any;
  isMuted?: boolean;
}

export const RTCStreamView: React.FC<RTCStreamViewProps> = ({
  stream,
  mirror = false,
  objectFit = 'cover',
  style,
  isMuted = false,
}) => {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy handled gracefully
        });
      }
    }
  }, [stream]);

  if (!stream) {
    return <View style={[styles.fallbackContainer, style]} />;
  }

  // Web Browser Platform Render
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            transform: mirror ? 'scaleX(-1)' : 'none',
            backgroundColor: '#000',
          }}
        />
      </View>
    );
  }

  // Native iOS / Android Render using react-native-webrtc RTCView
  if (NativeRTCView && stream) {
    const streamURL = typeof stream.toURL === 'function' ? stream.toURL() : '';
    if (streamURL) {
      return (
        <NativeRTCView
          streamURL={streamURL}
          style={[styles.container, style]}
          objectFit={objectFit}
          mirror={mirror}
          zOrder={mirror ? 1 : 0}
        />
      );
    }
  }

  return <View style={[styles.fallbackContainer, style]} />;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  fallbackContainer: {
    backgroundColor: '#111B21',
  },
});
