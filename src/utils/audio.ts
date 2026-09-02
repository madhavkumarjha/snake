import { getSettings } from './settings';

class SoundManager {
  private ctx: AudioContext | null = null;

  private initCtx(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playEatSound(isGolden: boolean = false): void {
    const settings = getSettings();
    if (!settings.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = settings.volume;

    if (isGolden) {
      // Golden apple chime: multi-step rising arpeggio
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(vol * 0.4, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.12);
      });
    } else {
      // Standard food eat sound: snappy pitch jump (arcade pop)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(vol * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  public playGameOverSound(): void {
    const settings = getSettings();
    if (!settings.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = settings.volume;

    // Crash bass drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    gain.gain.setValueAtTime(vol * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playClickSound(): void {
    const settings = getSettings();
    if (!settings.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = settings.volume;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(vol * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const soundManager = new SoundManager();
