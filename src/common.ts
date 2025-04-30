import { SetStateAction } from "react";
import { create } from "zustand";

export interface LVDataPoint {
  hunter: number;
  prey: number;

  time: number;
}

interface Controls {
  data: LVDataPoint[];
  setData: (data: SetStateAction<LVDataPoint[]>) => void;

  epsilon1: number;
  setEpsilon1: (epsilon1: number) => void;
  epsilon2: number;
  setEpsilon2: (epsilon2: number) => void;
  gamma1: number;
  setGamma1: (gamma1: number) => void;
  gamma2: number;
  setGamma2: (gamma2: number) => void;

  playbackSpeed: number;
  setPlaybackSpeed: (playbackSpeed: number) => void;

  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
}

export const playbackSpeedOptions = {
  SLOW: 50,
  NORMAL: 25,
  FAST: 10,
};

export const useControls = create<Controls>((set, get) => ({
  data: [{ hunter: 70, prey: 130, time: 1 }],
  setData(setStateAction) {
    if (setStateAction instanceof Function) {
      const newData = setStateAction(get().data);
      set({ data: newData });
    } else {
      set({ data: setStateAction });
    }
  },

  isPaused: true,
  setIsPaused(isPaused) {
    set({ isPaused });
  },

  epsilon1: 0.02,
  setEpsilon1(epsilon1) {
    set({ epsilon1 });
  },
  epsilon2: 0.02,
  setEpsilon2(epsilon2) {
    set({ epsilon2 });
  },
  gamma1: 0.0002,
  setGamma1(gamma1) {
    set({ gamma1 });
  },
  gamma2: 0.0002,
  setGamma2(gamma2) {
    set({ gamma2 });
  },

  playbackSpeed: playbackSpeedOptions.NORMAL,
  setPlaybackSpeed(playbackSpeed) {
    set({ playbackSpeed });
  },
}));
