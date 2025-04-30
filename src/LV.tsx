import { useEffect } from "react";
import { useControls } from "./common";

export function useLV() {
  const {
    data,
    setData,
    epsilon1,
    epsilon2,
    gamma1,
    gamma2,
    playbackSpeed,
    isPaused,
  } = useControls();

  useEffect(() => {
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

    const timestep = () => {
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
    };

    if (!isPaused) {
      const interval = setInterval(timestep, playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [epsilon1, epsilon2, gamma1, gamma2, setData, playbackSpeed, isPaused]);
}
