// Âm thanh đảo tự tổng hợp bằng Web Audio, không tải file:
// - Sóng biển: tiếng ồn lọc trầm, to nhỏ chậm như sóng vỗ, cả ngày lẫn đêm.
// - Lửa trại: xèo nhẹ nền + tiếng tách tách ngẫu nhiên, có từ bậc 1.
// - Dế: hai con kêu từng cụm ba nhịp, lệch trái phải, chỉ buổi tối.
// - Mưa bão: mưa rào, gió to, sấm sau mỗi lần chớp; dế và lửa trại lặng đi.
// Trình duyệt chỉ cho phát sau khi người xem bấm, nên chỉ tạo khi bấm nút.

export interface EstateAudio {
  setNight: (isNight: boolean) => void;
  setStorm: (isStorm: boolean) => void;
  thunder: (delaySeconds: number, strength: number) => void;
  dispose: () => void;
}

interface EstateAudioOptions {
  isNight: boolean;
  isStorm: boolean;
  hasCampfire: boolean;
}

interface CricketVoice {
  frequency: number;
  pan: number;
  nextChirpAt: number;
}

const MASTER_VOLUME = 0.55;
const SCHEDULE_INTERVAL_MS = 100;
const SCHEDULE_AHEAD_SECONDS = 0.3;

function createNoiseBuffer(context: AudioContext, seconds: number): AudioBuffer {
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

  return buffer;
}

function startLoopingNoise(context: AudioContext, buffer: AudioBuffer, destination: AudioNode): AudioBufferSourceNode {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(destination);
  source.start();

  return source;
}

export function createEstateAudio({ isNight, isStorm, hasCampfire }: EstateAudioOptions): EstateAudio {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(MASTER_VOLUME, context.currentTime + 1.5);
  master.connect(context.destination);
  const noiseBuffer = createNoiseBuffer(context, 3);
  const crackleBuffer = createNoiseBuffer(context, 0.04);
  const sources: AudioScheduledSourceNode[] = [];

  /* Sóng biển */
  const waveFilter = context.createBiquadFilter();
  waveFilter.type = "lowpass";
  waveFilter.frequency.value = 480;
  const waveGain = context.createGain();
  waveGain.gain.value = 0.09;
  const waveSwell = context.createOscillator();
  waveSwell.frequency.value = 0.09;
  const waveSwellDepth = context.createGain();
  waveSwellDepth.gain.value = 0.06;
  waveSwell.connect(waveSwellDepth).connect(waveGain.gain);
  waveFilter.connect(waveGain).connect(master);
  sources.push(startLoopingNoise(context, noiseBuffer, waveFilter), waveSwell);
  waveSwell.start();

  /* Mưa rào và gió: chỉ khi bão */
  const stormBus = context.createGain();
  stormBus.gain.value = isStorm ? 1 : 0;
  stormBus.connect(master);
  const rainHighpass = context.createBiquadFilter();
  rainHighpass.type = "highpass";
  rainHighpass.frequency.value = 900;
  const rainLowpass = context.createBiquadFilter();
  rainLowpass.type = "lowpass";
  rainLowpass.frequency.value = 7000;
  const rainGain = context.createGain();
  rainGain.gain.value = 0.16;
  rainHighpass.connect(rainLowpass).connect(rainGain).connect(stormBus);
  const windFilter = context.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 380;
  windFilter.Q.value = 0.8;
  const windGain = context.createGain();
  windGain.gain.value = 0.1;
  const gust = context.createOscillator();
  gust.frequency.value = 0.13;
  const gustDepth = context.createGain();
  gustDepth.gain.value = 0.07;
  gust.connect(gustDepth).connect(windGain.gain);
  windFilter.connect(windGain).connect(stormBus);
  sources.push(startLoopingNoise(context, noiseBuffer, rainHighpass), startLoopingNoise(context, noiseBuffer, windFilter), gust);
  gust.start();
  let isStormNow = isStorm;

  function getCalmLevel(isStormy: boolean): number {
    return isStormy ? 0.15 : 1;
  }

  /* Lửa trại: tối to hơn ngày */
  const fireBus = context.createGain();
  fireBus.gain.value = hasCampfire ? (isNight ? 1 : 0.45) * getCalmLevel(isStorm) : 0;
  fireBus.connect(master);
  const hissFilter = context.createBiquadFilter();
  hissFilter.type = "bandpass";
  hissFilter.frequency.value = 1400;
  hissFilter.Q.value = 0.6;
  const hissGain = context.createGain();
  hissGain.gain.value = 0.018;
  hissFilter.connect(hissGain).connect(fireBus);
  const rumbleFilter = context.createBiquadFilter();
  rumbleFilter.type = "lowpass";
  rumbleFilter.frequency.value = 160;
  const rumbleGain = context.createGain();
  rumbleGain.gain.value = 0.05;
  rumbleFilter.connect(rumbleGain).connect(fireBus);
  sources.push(startLoopingNoise(context, noiseBuffer, hissFilter), startLoopingNoise(context, noiseBuffer, rumbleFilter));
  const crackleFilter = context.createBiquadFilter();
  crackleFilter.type = "highpass";
  crackleFilter.frequency.value = 1800;
  crackleFilter.connect(fireBus);
  let nextCrackleAt = context.currentTime + 0.2;

  function scheduleCrackle(startAt: number): void {
    const source = context.createBufferSource();
    source.buffer = crackleBuffer;
    source.playbackRate.value = 0.6 + Math.random() * 0.9;
    const envelope = context.createGain();
    const peak = 0.08 + Math.random() * 0.22;
    envelope.gain.setValueAtTime(peak, startAt);
    envelope.gain.exponentialRampToValueAtTime(0.001, startAt + 0.03 + Math.random() * 0.05);
    source.connect(envelope).connect(crackleFilter);
    source.start(startAt);
    source.stop(startAt + 0.1);
  }

  /* Dế: chỉ buổi tối */
  const nightBus = context.createGain();
  nightBus.gain.value = isNight ? getCalmLevel(isStorm) : 0;
  nightBus.connect(master);
  const crickets: CricketVoice[] = [
    { frequency: 4300, pan: -0.6, nextChirpAt: context.currentTime + 0.4 },
    { frequency: 4750, pan: 0.55, nextChirpAt: context.currentTime + 1.1 },
  ];

  function scheduleChirp(cricket: CricketVoice, startAt: number): void {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = cricket.frequency;
    const envelope = context.createGain();
    envelope.gain.value = 0;
    const panner = context.createStereoPanner();
    panner.pan.value = cricket.pan;
    // Ba nhịp ngắn liền nhau thành một tiếng "rích".
    for (let pulse = 0; pulse < 3; pulse++) {
      const pulseAt = startAt + pulse * 0.055;
      envelope.gain.setValueAtTime(0, pulseAt);
      envelope.gain.linearRampToValueAtTime(0.022, pulseAt + 0.008);
      envelope.gain.linearRampToValueAtTime(0, pulseAt + 0.035);
    }
    oscillator.connect(envelope).connect(panner).connect(nightBus);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.2);
  }

  const scheduler = window.setInterval(() => {
    const horizon = context.currentTime + SCHEDULE_AHEAD_SECONDS;

    while (hasCampfire && nextCrackleAt < horizon) {
      scheduleCrackle(nextCrackleAt);
      nextCrackleAt += 0.05 + Math.random() * 0.35;
    }
    crickets.forEach((cricket) => {
      while (cricket.nextChirpAt < horizon) {
        scheduleChirp(cricket, cricket.nextChirpAt);
        cricket.nextChirpAt += 0.7 + Math.random() * 0.8;
      }
    });
  }, SCHEDULE_INTERVAL_MS);

  let isNightNow = isNight;

  function rampTo(gain: AudioParam, value: number, seconds: number): void {
    gain.setValueAtTime(gain.value, context.currentTime);
    gain.linearRampToValueAtTime(value, context.currentTime + seconds);
  }

  function applyMix(seconds: number): void {
    const calm = getCalmLevel(isStormNow);
    rampTo(nightBus.gain, isNightNow ? calm : 0, seconds);
    rampTo(fireBus.gain, hasCampfire ? (isNightNow ? 1 : 0.45) * calm : 0, seconds);
    rampTo(stormBus.gain, isStormNow ? 1 : 0, seconds * 1.5);
  }

  return {
    setNight(nextIsNight) {
      isNightNow = nextIsNight;
      applyMix(2);
    },
    setStorm(nextIsStorm) {
      isStormNow = nextIsStorm;
      applyMix(3);
    },
    // Sấm: tiếng ồn lọc trầm, nổ to rồi rền dài.
    thunder(delaySeconds, strength) {
      const startAt = context.currentTime + delaySeconds;
      const source = context.createBufferSource();
      source.buffer = noiseBuffer;
      source.playbackRate.value = 0.5;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 180 + strength * 140;
      const envelope = context.createGain();
      envelope.gain.setValueAtTime(0, startAt);
      envelope.gain.linearRampToValueAtTime(0.9 * strength, startAt + 0.08);
      envelope.gain.exponentialRampToValueAtTime(0.25 * strength, startAt + 0.6);
      envelope.gain.exponentialRampToValueAtTime(0.001, startAt + 3.2);
      source.connect(filter).connect(envelope).connect(master);
      source.start(startAt);
      source.stop(startAt + 3.4);
    },
    dispose() {
      window.clearInterval(scheduler);
      sources.forEach((source) => {
        try {
          source.stop();
        } catch {
          // Nguồn đã dừng sẵn thì bỏ qua.
        }
      });
      void context.close();
    },
  };
}
