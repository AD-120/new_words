
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.3), 100); // E5
  }

  playWrong() {
    this.playTone(220, 'sawtooth', 0.3, 0.05); // A3
    this.playTone(200, 'sawtooth', 0.3, 0.05);
  }

  playStart() {
    this.playTone(440, 'triangle', 0.1);
    setTimeout(() => this.playTone(880, 'triangle', 0.2), 100);
  }

  playFinish() {
    this.playTone(523.25, 'sine', 0.1);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(783.99, 'sine', 0.1), 200);
    setTimeout(() => this.playTone(1046.50, 'sine', 0.5), 300);
  }
}

export const audioService = new AudioService();
