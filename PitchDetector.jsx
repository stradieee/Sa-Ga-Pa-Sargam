import { useEffect, useRef, useState } from "react";

const NOTE_NAMES = ["Sa", "Re", "Ga", "Ma", "Pa", "Dha", "Ni"];

const OCTAVE_MAP = {
  3: [146.83, 164.81, 185.0, 196.0, 220.0, 246.94, 277.18],
  4: [293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 554.37],
  5: [587.33, 659.25, 739.99, 783.99, 880.0, 987.77, 1108.73],
};

export default function PitchDetector({ compact = false }) {
  const [micEnabled, setMicEnabled] = useState(false);
  const [octave, setOctave] = useState(4);
  const [targetIndex, setTargetIndex] = useState(0);
  const [targetHz, setTargetHz] = useState(OCTAVE_MAP[4][0]);
  const [detectedHz, setDetectedHz] = useState(0);
  const [cents, setCents] = useState(0);
  const [visualBars, setVisualBars] = useState(Array(32).fill(18));
  const [guidance, setGuidance] = useState(
    "Enable the microphone and match the selected swara."
  );

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const previousFrequencyRef = useRef(0);
  const toneTimeoutRef = useRef(null);

  useEffect(() => {
    setTargetHz(OCTAVE_MAP[octave][targetIndex]);
  }, [octave, targetIndex]);

  useEffect(() => {
    return () => stopMic();
  }, []);

  const clearToneTimeout = () => {
    if (toneTimeoutRef.current) {
      clearTimeout(toneTimeoutRef.current);
      toneTimeoutRef.current = null;
    }
  };

  const playTone = (frequency) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const calculateFrequency = (buffer, sampleRate) => {
    const size = buffer.length;
    let sum = 0;

    for (let i = 0; i < size; i++) {
      sum += buffer[i] * buffer[i];
    }

    const rms = Math.sqrt(sum / size);
    if (rms < 0.02) return 0;

    let bestLag = 0;
    let bestCorrelation = 0;

    for (let lag = 1; lag < size / 2; lag++) {
      let correlation = 0;
      for (let i = 0; i < size - lag; i++) {
        correlation += buffer[i] * buffer[i + lag];
      }
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    if (!bestLag) return 0;

    const frequency = sampleRate / bestLag;
    if (frequency < 80 || frequency > 1200) return 0;
    return frequency;
  };

  const updateBars = (freq, centValue) => {
    const bars = Array.from({ length: 32 }, (_, i) => {
      const wave = Math.sin((i / 32) * 9 + freq / 30) * 0.5 + 0.5;
      const h = Math.max(14, (wave * 100) * (0.3 + freq / 1200));
      return Math.min(100, h);
    });

    setVisualBars(bars);

    if (Math.abs(centValue) <= 15) {
      setGuidance(`Excellent! ${NOTE_NAMES[targetIndex]} is aligned.`);
    } else if (centValue < 0) {
      setGuidance(
        `Raise the pitch: ${NOTE_NAMES[targetIndex]} is flat by ${Math.round(Math.abs(centValue))}¢`
      );
    } else {
      setGuidance(
        `Lower the pitch: ${NOTE_NAMES[targetIndex]} is sharp by ${Math.round(Math.abs(centValue))}¢`
      );
    }
  };

  const loop = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const sampleRate = audioContextRef.current.sampleRate;
    const data = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(data);

    const rawFreq = calculateFrequency(data, sampleRate);

    if (rawFreq > 0) {
      const smoothed =
        previousFrequencyRef.current === 0
          ? rawFreq
          : previousFrequencyRef.current * 0.8 + rawFreq * 0.2;

      previousFrequencyRef.current = smoothed;

      const target = OCTAVE_MAP[octave][targetIndex];
      const centDiff = target > 0 ? 1200 * Math.log2(smoothed / target) : 0;

      setDetectedHz(smoothed);
      setCents(Math.round(centDiff));
      updateBars(smoothed, centDiff);

      if (Math.abs(centDiff) <= 15) {
        clearToneTimeout();
        toneTimeoutRef.current = setTimeout(() => {
          playTone(target);
        }, 180);
      }
    } else {
      setDetectedHz(0);
      setCents(0);
      setGuidance("No stable pitch yet. Keep singing steadily.");
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  const startMic = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setGuidance("Microphone access is not supported in this browser.");
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      analyserRef.current = analyser;
      sourceRef.current = source;
      streamRef.current = stream;

      setMicEnabled(true);
      setGuidance("Pitch analysis active. Sustain the target note.");
      previousFrequencyRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    } catch (error) {
      console.error(error);
      setGuidance("Microphone access was denied. Please allow permission and retry.");
    }
  };

  const stopMic = () => {
    clearToneTimeout();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    previousFrequencyRef.current = 0;

    setMicEnabled(false);
    setDetectedHz(0);
    setCents(0);
    setGuidance("Microphone stopped. Start again to continue.");
  };

  const toggleMic = async () => {
    if (micEnabled) {
      stopMic();
    } else {
      await startMic();
    }
  };

  return (
    <div className={compact ? "pitch-panel compact" : "pitch-panel"}>
      <div className="panel-header">
        <div>
          <span className="tiny-label">Live tuner</span>
          <h3>{NOTE_NAMES[targetIndex]}</h3>
        </div>
        <button className="primary-btn small" type="button" onClick={toggleMic}>
          {micEnabled ? "Stop mic" : "Enable mic"}
        </button>
      </div>

      <div className="meter-wrap">
        <div className="meter">
          <div
            className="pitch-bar"
            style={{
              width: `${Math.min(100, Math.max(0, 100 - Math.abs(cents) * 1.5))}%`,
            }}
          />
        </div>
      </div>

      <div className="voice-stats">
        <div className="stat-box">
          <span>Detected</span>
          <strong>{detectedHz ? `${detectedHz.toFixed(2)} Hz` : "0.00 Hz"}</strong>
        </div>
        <div className="stat-box">
          <span>Target</span>
          <strong>{targetHz.toFixed(2)} Hz</strong>
        </div>
        <div className="stat-box">
          <span>Cents</span>
          <strong>{`${cents}¢`}</strong>
        </div>
      </div>

      <div className="visualizer">
        {visualBars.map((height, index) => (
          <span
            key={index}
            className="bar"
            style={{
              height: `${Math.max(16, height)}%`,
              background:
                Math.abs(cents) <= 15
                  ? "linear-gradient(180deg, #18c38a, #7ae8bf)"
                  : "linear-gradient(180deg, #7e73ff, #67d5ff)",
            }}
          />
        ))}
      </div>

      <div className="note-grid">
        {[3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`octave-btn ${octave === value ? "active" : ""}`}
            onClick={() => setOctave(value)}
          >
            {value === 3 ? "Low" : value === 4 ? "Practice" : "High"}
          </button>
        ))}
      </div>

      <div className="scale-grid">
        {OCTAVE_MAP[octave].map((freq, index) => (
          <button
            key={`${octave}-${index}`}
            type="button"
            className={`note-card ${targetIndex === index ? "active" : ""}`}
            onClick={() => setTargetIndex(index)}
          >
            <span>{NOTE_NAMES[index]}</span>
            <small>{freq.toFixed(2)}Hz</small>
          </button>
        ))}
      </div>

      <div className="guidance">{guidance}</div>
    </div>
  );
}