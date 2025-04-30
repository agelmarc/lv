import { useEffect } from "react";
import { Graph } from "./Graph";
import { useControls } from "./common";

export function LV() {
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
    const timestep = () => {
      setData((oldData) => {
        const lastData = oldData.at(-1);
        if (!lastData) return oldData;

        const oldPrey = lastData.prey;
        const oldHunter = lastData.hunter;
        const time = lastData.time;

        const newPrey = Math.max(
          0,
          oldPrey * (1 + epsilon1 - gamma1 * oldHunter)
        );

        const newHunter = Math.max(
          0,
          oldHunter * (1 - epsilon2 + gamma2 * oldPrey)
        );

        return [
          ...oldData,
          {
            hunter: newHunter,
            prey: newPrey,
            time: time + 1,
          },
        ];
      });
    };

    if (!isPaused) {
      const interval = setInterval(timestep, playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [epsilon1, epsilon2, gamma1, gamma2, setData, playbackSpeed, isPaused]);

  return <Graph data={data.slice(-1000)} />;
}
