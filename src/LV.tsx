import { useCallback, useEffect, useRef } from "react";
import { useControls } from "./common";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

export function useLV() {
  const {
    setData,
    epsilon1,
    epsilon2,
    gamma1,
    gamma2,
    playbackSpeed,
    isPaused,
  } = useControls();

  const timestep = useCallback(() => {
    function timestepRK4(prey: number, hunter: number, h: number) {
      function f(prey: number, hunter: number) {
        return [
          epsilon1 * prey - gamma1 * prey * hunter,
          -epsilon2 * hunter + gamma2 * hunter * prey,
        ];
      }

      const [k1Prey, k1Hunter] = f(prey, hunter);
      const [k2Prey, k2Hunter] = f(
        prey + (h / 2) * k1Prey,
        hunter + (h / 2) * k1Hunter
      );
      const [k3Prey, k3Hunter] = f(
        prey + (h / 2) * k2Prey,
        hunter + (h / 2) * k2Hunter
      );
      const [k4Prey, k4Hunter] = f(prey + h * k3Prey, hunter + h * k3Hunter);

      const newPrey =
        prey + (h / 6) * (k1Prey + 2 * k2Prey + 2 * k3Prey + k4Prey);
      const newHunter =
        hunter + (h / 6) * (k1Hunter + 2 * k2Hunter + 2 * k3Hunter + k4Hunter);

      return [newPrey, newHunter];
    }

    setData((oldData) => {
      const lastData = oldData.at(-1);
      if (!lastData) return oldData;

      const h = 1; // Define the time step
      const [newPrey, newHunter] = timestepRK4(
        lastData.prey,
        lastData.hunter,
        h
      );

      const time = lastData.time;

      return [
        ...oldData,
        {
          hunter: newHunter,
          prey: newPrey,
          time: time + h,
        },
      ];
    });
    // fill the dependency array with the variables that are used in the function
  }, [epsilon1, epsilon2, gamma1, gamma2, setData]);

  useInterval(timestep, isPaused ? null : playbackSpeed);
}
