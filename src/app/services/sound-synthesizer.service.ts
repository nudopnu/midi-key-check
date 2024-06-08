import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundSynthesizerService {
  audioCtx: AudioContext;

  constructor() {
    this.audioCtx = new AudioContext();
  }

  playPianoKey(midiValue: number) {
    const frequency = this.midiToFrequency(midiValue);
    this.playFrequency(this.audioCtx, frequency, 800);
  }

  playFrequency(audioCtx: AudioContext, frequency: number, duration: number) {
    const attackTime = 0.01; // Very quick attack
    const decayTime = 0.4; // Longer decay
    const sustainLevel = 0.6; // Lower sustain level
    const releaseTime = 0.4; // Longer release

    // Create two oscillators: one for the fundamental and one for a harmonic
    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    oscillator1.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator2.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime); // an octave above

    // Create gain nodes for envelope control
    const gainNode1 = audioCtx.createGain();
    const gainNode2 = audioCtx.createGain();

    // Set initial gain (silence)
    gainNode1.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode2.gain.setValueAtTime(0, audioCtx.currentTime);

    // Attack
    gainNode1.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);
    gainNode2.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + attackTime); // Harmonic is quieter

    // Decay to sustain level
    gainNode1.gain.linearRampToValueAtTime(sustainLevel, audioCtx.currentTime + attackTime + decayTime);
    gainNode2.gain.linearRampToValueAtTime(sustainLevel * 0.5, audioCtx.currentTime + attackTime + decayTime);

    // Apply a low-pass filter to both oscillators
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime); // Lower cutoff to soften the sound
    filter.Q.setValueAtTime(1, audioCtx.currentTime); // A moderate Q value to avoid too much resonance

    // Connect oscillators to gain nodes, then to the filter, and finally to the destination
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(filter);
    gainNode2.connect(filter);
    filter.connect(audioCtx.destination);

    // Start the oscillators
    oscillator1.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);

    // Schedule stop for the oscillators
    oscillator1.stop(audioCtx.currentTime + duration / 1000 + releaseTime);
    oscillator2.stop(audioCtx.currentTime + duration / 1000 + releaseTime);

    // Schedule gain reduction for release phase
    gainNode1.gain.setValueAtTime(sustainLevel, audioCtx.currentTime + duration / 1000);
    gainNode1.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000 + releaseTime);
    gainNode2.gain.setValueAtTime(sustainLevel * 0.5, audioCtx.currentTime + duration / 1000);
    gainNode2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000 + releaseTime);
  }

  midiToFrequency(midiValue: number) {
    return 440 * Math.pow(2, (midiValue - 69) / 12);
  }
}
