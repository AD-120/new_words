
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Setup master chain
      this.compressor = this.ctx.createDynamicsCompressor();
      this.masterGain = this.ctx.createGain();
      
      this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(40, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createSimpleSynth(freq: number, type: OscillatorType, duration: number, volume: number = 0.2) {
    if (!this.ctx || !this.compressor) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() {
    this.init();
    // A bright, happy double-beep
    this.createSimpleSynth(523.25, 'triangle', 0.1, 0.3); // C5
    setTimeout(() => {
      this.createSimpleSynth(659.25, 'triangle', 0.15, 0.3); // E5
    }, 80);
  }

  playWrong() {
    this.init();
    // A soft, low-frequency "thud" - less annoying than a buzz
    this.createSimpleSynth(196.00, 'square', 0.2, 0.1); // G3
    setTimeout(() => {
      this.createSimpleSynth(146.83, 'square', 0.3, 0.1); // D3
    }, 50);
  }

  playStart() {
    this.init();
    // Friendly "Welcome" jingle (C-E-G)
    this.createSimpleSynth(261.63, 'sine', 0.1, 0.2);
    setTimeout(() => this.createSimpleSynth(329.63, 'sine', 0.1, 0.2), 100);
    setTimeout(() => this.createSimpleSynth(392.00, 'sine', 0.2, 0.2), 200);
  }

  playFinish() {
    this.init();
    // Celebration jingle (C-G-C)
    const notes = [523.25, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createSimpleSynth(freq, 'triangle', 0.2, 0.15);
      }, i * 120);
    });
  }
}

export const audioService = new AudioService();
