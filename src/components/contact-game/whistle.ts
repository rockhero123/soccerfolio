/**
 * The referee's whistle (spec 900 US-3 AC4), synthesised with the Web Audio
 * API, so there is no audio file: a short blast and a long one, a high tone
 * trilled by a fast wobble, like a pea whistle.
 */
export function blowWhistle(audio: AudioContext | null) {
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
  const start = audio.currentTime + 0.02;
  for (const [at, length] of [
    [0, 0.16],
    [0.24, 0.62],
  ] as const) {
    const t = start + at;
    const tone = audio.createOscillator();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(2750, t);
    const trill = audio.createOscillator();
    trill.frequency.setValueAtTime(32, t);
    const depth = audio.createGain();
    depth.gain.setValueAtTime(220, t);
    trill.connect(depth).connect(tone.frequency);
    const volume = audio.createGain();
    volume.gain.setValueAtTime(0, t);
    volume.gain.linearRampToValueAtTime(0.16, t + 0.025);
    volume.gain.setValueAtTime(0.16, t + length - 0.05);
    volume.gain.linearRampToValueAtTime(0, t + length);
    tone.connect(volume).connect(audio.destination);
    tone.start(t);
    trill.start(t);
    tone.stop(t + length + 0.02);
    trill.stop(t + length + 0.02);
  }
}

/** Creates the audio context inside the click that opens the game (browsers need a user gesture). */
export function createAudio(): AudioContext | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    return Ctor ? new Ctor() : null;
  } catch {
    return null;
  }
}
