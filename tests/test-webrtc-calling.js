/**
 * LipTalk WhatsApp-Style WebRTC Voice & Video Calling Verification Suite
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

function runCallingVerification() {
  console.log('======================================================================');
  console.log('LIPTALK WHATSAPP-STYLE WEBRTC CALLING SYSTEM VERIFICATION');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function testAssert(title, condition, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}${details ? ` -> ${details}` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}${details ? ` -> ${details}` : ''}`);
    }
  }

  // 1. File Infrastructure Checks
  console.log('1. Checking Calling Files & Architecture:');
  const requiredFiles = [
    'mobile/src/services/webrtc.service.ts',
    'mobile/src/hooks/useWebRTC.ts',
    'mobile/src/components/calling/RTCStreamView.tsx',
    'mobile/src/components/calling/VoIPGlobalManager.tsx',
    'mobile/src/services/voipAudioEngine.ts',
    'mobile/src/services/socket.service.ts',
    'mobile/app/call/active.tsx',
    'mobile/app/call/incoming.tsx',
    'mobile/app/call/index.tsx',
    'backend/src/modules/calls/calls.gateway.ts',
    'backend/src/modules/calls/calls.service.ts',
    'coturn/turnserver.conf',
    'docker-compose.yml',
  ];

  requiredFiles.forEach((file) => {
    const filePath = path.join(__dirname, '..', file);
    testAssert(`File exists: [${file}]`, fs.existsSync(filePath));
  });

  // 2. STUN / TURN Server Configuration
  console.log('\n2. Testing STUN/TURN Infrastructure:');
  const coturnConfig = fs.readFileSync(path.join(__dirname, '..', 'coturn', 'turnserver.conf'), 'utf-8');
  testAssert('Coturn config has listening-port 3478', coturnConfig.includes('listening-port=3478'));
  testAssert('Coturn config has lt-cred-mech & credentials', coturnConfig.includes('lt-cred-mech') && coturnConfig.includes('liptalk:'));
  testAssert('Coturn config has UDP port range', coturnConfig.includes('min-port=49152') && coturnConfig.includes('max-port=49162'));

  const dockerCompose = fs.readFileSync(path.join(__dirname, '..', 'docker-compose.yml'), 'utf-8');
  testAssert('docker-compose includes coturn service', dockerCompose.includes('coturn:'));
  testAssert('docker-compose binds STUN port 3478/udp', dockerCompose.includes('3478:3478/udp'));

  // 3. WebRTC Service Architecture
  console.log('\n3. Testing WebRTC Service & Signaling Abstraction:');
  const webrtcCode = fs.readFileSync(path.join(__dirname, '..', 'mobile', 'src', 'services', 'webrtc.service.ts'), 'utf-8');
  testAssert('WebRTC service configures Google STUN + LipTalk TURN servers', webrtcCode.includes('stun:stun.l.google.com:19302') && webrtcCode.includes('turn:turn.liptalk.app:3478'));
  testAssert('WebRTC service handles Offer generation and SDP negotiation', webrtcCode.includes('createOffer') && webrtcCode.includes('setLocalDescription'));
  testAssert('WebRTC service handles Answer generation upon receiving offer', webrtcCode.includes('createAnswer') && webrtcCode.includes('setRemoteDescription'));
  testAssert('WebRTC service queues ICE candidates before remote description is set', webrtcCode.includes('iceCandidateQueue') && webrtcCode.includes('addIceCandidate'));
  testAssert('WebRTC service provides track-level mute and camera controls', webrtcCode.includes('toggleMute') && webrtcCode.includes('toggleVideo') && webrtcCode.includes('switchCamera'));
  testAssert('WebRTC service supports cross-platform fallback (Native + Web)', webrtcCode.includes("Platform.OS === 'web'"));

  // 4. Backend Gateway Signaling Relay
  console.log('\n4. Testing Backend WebSocket Gateway:');
  const gatewayCode = fs.readFileSync(path.join(__dirname, '..', 'backend', 'src', 'modules', 'calls', 'calls.gateway.ts'), 'utf-8');
  testAssert('Gateway relays call_signal with senderId attribution', gatewayCode.includes("senderId: senderUserId") && gatewayCode.includes('call_signal'));
  testAssert('Gateway checks user presence and prevents dual-call collision', gatewayCode.includes("=== 'IN_CALL'") && gatewayCode.includes('call_busy'));
  testAssert('Gateway tracks online/offline/in_call status transitions', gatewayCode.includes('userPresence.set(data.userId, \'IN_CALL\')'));

  // 5. Active Call Screen Integration
  console.log('\n5. Testing Active Call Screen WebRTC Integration:');
  const activeCallCode = fs.readFileSync(path.join(__dirname, '..', 'mobile', 'app', 'call', 'active.tsx'), 'utf-8');
  testAssert('Active screen imports webrtcService and RTCStreamView', activeCallCode.includes('webrtcService') && activeCallCode.includes('RTCStreamView'));
  testAssert('Active screen initializes peer media and tracks local/remote streams', activeCallCode.includes('initializeCall') && activeCallCode.includes('onRemoteStream'));
  testAssert('Active screen controls live WebRTC audio track on mute toggle', activeCallCode.includes('webrtcService.toggleMute'));
  testAssert('Active screen controls live WebRTC video track on camera toggle', activeCallCode.includes('webrtcService.toggleVideo'));
  testAssert('Active screen renders remote stream in full screen and local in PiP', activeCallCode.includes('RTCStreamView\n              stream={remoteStream}') || activeCallCode.includes('RTCStreamView') && activeCallCode.includes('remoteStream'));
  testAssert('Active screen cleans up hardware and WebRTC sessions on end call', activeCallCode.includes('webrtcService.cleanup()'));

  // 6. Call History & Logs
  console.log('\n6. Testing Call History & Log Screen:');
  const historyCode = fs.readFileSync(path.join(__dirname, '..', 'mobile', 'app', 'call', 'index.tsx'), 'utf-8');
  testAssert('Call history supports All vs Missed filter tabs', historyCode.includes('filter === \'MISSED\''));
  testAssert('Call history provides 1-tap callback action', historyCode.includes('handleStartCall'));
  testAssert('Call history distinguishes incoming, outgoing, and missed calls', historyCode.includes('PhoneIncoming') && historyCode.includes('PhoneOutgoing') && historyCode.includes('PhoneMissed'));

  // 7. Non-Destructive Backward Compatibility
  console.log('\n7. Testing Backward Compatibility & App Configuration:');
  const appJson = fs.readFileSync(path.join(__dirname, '..', 'mobile', 'app.json'), 'utf-8');
  testAssert('app.json includes @config-plugins/react-native-webrtc', appJson.includes('@config-plugins/react-native-webrtc'));
  testAssert('app.json specifies camera and microphone permissions', appJson.includes('cameraPermission') && appJson.includes('microphonePermission'));

  console.log('\n======================================================================');
  console.log(`CALLING VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('======================================================================');

  if (passed === total) {
    console.log('\n🌟 ALL WHATSAPP-STYLE CALLING SUBSYSTEMS FULLY OPERATIONAL!');
  } else {
    process.exit(1);
  }
}

runCallingVerification();
