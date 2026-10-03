/**
 * VoIP Telecom Audio Engine
 * Provides authentic synthesized telecom audio feedback across call lifecycles:
 * - Dual-tone Ringback (440Hz + 480Hz) for calling party
 * - Harmonic Ringtone melody for receiving party
 * - Busy Tone (480Hz + 620Hz) for declined / busy calls
 * - Connected Chime (smooth ascending chord) on call pick-up
 * - Hangup Chime on call termination
 * - Mute/Unmute audio indicators
 */

class VoIPAudioEngine {
  private audioCtx: any = null;
  private currentInterval: any = null;
  private activeNodes: any[] = [];
  private isPlaying: boolean = false;

  private getContext(): any {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play Ringback tone (caller hearing 440Hz + 480Hz telecom tones while ringing)
   */
  playRingback(): void {
    this.stopAll();
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlaying = true;

    const playBurst = () => {
      if (!this.isPlaying) return;
      try {
        const now = ctx.currentTime;
        const duration = 1.6;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, now); // 440 Hz

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, now); // 480 Hz

        // Smooth envelope to avoid audio clicks
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        gainNode.gain.setValueAtTime(0.12, now + duration - 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);

        this.activeNodes.push(osc1, osc2, gainNode);
      } catch (_) {}
    };

    playBurst();
    this.currentInterval = setInterval(playBurst, 4000); // 1.6s on, 2.4s off
  }

  /**
   * Play Ringtone (receiver hearing melodic ringing chime)
   */
  playRingtone(): void {
    this.stopAll();
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlaying = true;

    // Harmonic ringtone notes: C5, E5, G5, B5, C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];

    const playMelody = () => {
      if (!this.isPlaying) return;
      try {
        const now = ctx.currentTime;
        notes.forEach((freq, idx) => {
          const noteTime = now + idx * 0.12;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.001, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.18, noteTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.3);
          this.activeNodes.push(osc, gain);
        });
      } catch (_) {}
    };

    playMelody();
    this.currentInterval = setInterval(playMelody, 2200);
  }

  /**
   * Play Busy tone (480Hz + 620Hz pulsed quickly: 0.4s on, 0.4s off)
   */
  playBusyTone(): void {
    this.stopAll();
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlaying = true;
    let bursts = 0;

    const playBurst = () => {
      if (!this.isPlaying || bursts >= 4) {
        this.stopAll();
        return;
      }
      bursts++;
      try {
        const now = ctx.currentTime;
        const duration = 0.38;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(480, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(620, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        gain.gain.setValueAtTime(0.12, now + duration - 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);

        this.activeNodes.push(osc1, osc2, gain);
      } catch (_) {}
    };

    playBurst();
    this.currentInterval = setInterval(playBurst, 750);
  }

  /**
   * Play Connected Chime (pleasant ascending chime when call is answered)
   */
  playConnectedChime(): void {
    this.stopAll();
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [587.33, 739.99, 880.0]; // D5, F#5, A5
      chords.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.15, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    } catch (_) {}
  }

  /**
   * Play Hangup Chime (gentle descending tone when call ends)
   */
  playHangupChime(): void {
    this.stopAll();
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [880.0, 659.25, 440.0]; // A5, E5, A4
      chords.forEach((freq, idx) => {
        const noteTime = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch (_) {}
  }

  /**
   * Play mute or unmute micro-feedback
   */
  playMuteFeedback(isMuted: boolean): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isMuted ? 320 : 640, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  /**
   * Stop all ongoing tones and intervals
   */
  stopAll(): void {
    this.isPlaying = false;
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    this.activeNodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (_) {}
    });
    this.activeNodes = [];
  }
}

export const voipAudioEngine = new VoIPAudioEngine();
