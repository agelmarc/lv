import { useDrag } from "@use-gesture/react";
import { Graph } from "./Graph";
import { useLV } from "./LV";
import { playbackSpeedOptions, useControls } from "./common";

export function App() {
  const {
    playbackSpeed,
    setPlaybackSpeed,
    epsilon1,
    setEpsilon1,
    epsilon2,
    setEpsilon2,
    gamma1,
    setGamma1,
    gamma2,
    setGamma2,
    isPaused,
    setIsPaused,
    data,
    setData,
  } = useControls();

  const bindEpsilon1 = useDrag(
    (a) => {
      if (!(a.target instanceof Element)) return;
      const { x, width } = a.target.getBoundingClientRect();
      const percentage =
        (Math.min(Math.max(x, a.xy[0]), x + width) - x) / width;
      setEpsilon1(percentage * 0.02 + 0.01);
    },
    { axis: "x", filterTaps: true }
  );

  const bindEpsilon2 = useDrag(
    (a) => {
      if (!(a.target instanceof Element)) return;
      const { x, width } = a.target.getBoundingClientRect();
      const percentage =
        (Math.min(Math.max(x, a.xy[0]), x + width) - x) / width;
      setEpsilon2(percentage * 0.02 + 0.01);
    },
    { axis: "x", filterTaps: true }
  );

  const bindGamma1 = useDrag(
    (a) => {
      if (!(a.target instanceof Element)) return;
      const { x, width } = a.target.getBoundingClientRect();
      const percentage =
        (Math.min(Math.max(x, a.xy[0]), x + width) - x) / width;
      setGamma1(percentage * 0.0002 + 0.0001);
    },
    { axis: "x", filterTaps: true }
  );
  const bindGamma2 = useDrag(
    (a) => {
      if (!(a.target instanceof Element)) return;
      const { x, width } = a.target.getBoundingClientRect();
      const percentage =
        (Math.min(Math.max(x, a.xy[0]), x + width) - x) / width;
      setGamma2(percentage * 0.0002 + 0.0001);
    },
    { axis: "x", filterTaps: true }
  );

  useLV();

  return (
    <>
      <h1>Simulation der Lotka Volterra Regeln</h1>
      <div className="section">
        <p>
          Die Lotka-Volterra-Gleichungen beschreiben die Dynamik von Beute- und
          Räuberpopulationen in einem geschlossenen System. Sie zeigen, wie die
          Populationen sich gegenseitig beeinflussen und im Gleichgewicht stehen
          können.
        </p>
        <div>
          Die{" "}
          <span style={{ fontWeight: "bold", color: "var(--beute)" }}>
            Beutelebewesen
          </span>{" "}
          vermehren sich auf natürliche Weise (
          <div
            className="s"
            {...bindEpsilon1()}
            style={{
              "--x": `${(epsilon1 - 0.01) * 5000}%`,
              "--color": "var(--leben)",
            }}
          >
            Reproduktionsrate{" "}
            <span className="num">{(epsilon1 * 100).toFixed(1)}%</span>
          </div>
          ) und werden durch die Jäger bedroht (
          <div
            className="s"
            {...bindGamma1()}
            style={{
              "--x": `${(gamma1 - 0.0001) * 500000}%`,
              "--color": "var(--tod)",
            }}
          >
            Sterberate pro Jägerlebewesen{" "}
            <span className="num">{(gamma1 * 100).toFixed(3)}%</span>
          </div>
          ). Die{" "}
          <span style={{ fontWeight: "bold", color: "var(--jäger)" }}>
            Jägerlebewesen
          </span>{" "}
          hingegen sterben auf natürliche Weise (
          <div
            className="s"
            {...bindEpsilon2()}
            style={{
              "--x": `${(epsilon2 - 0.01) * 5000}%`,
              "--color": "var(--tod)",
            }}
          >
            Sterberate{" "}
            <span className="num">{(epsilon2 * 100).toFixed(1)}%</span>
          </div>
          ) und müssen sich durch Jagd auf die Beutelebewesen am Leben halten (
          <div
            className="s"
            {...bindGamma2()}
            style={{
              "--x": `${(gamma2 - 0.0001) * 500000}%`,
              "--color": "var(--leben)",
            }}
          >
            Reproduktionsrate pro Beutelebewesen{" "}
            <span className="num">{(gamma2 * 100).toFixed(3)}%</span>
          </div>
          ). Diese Simulation zeigt, wie sich die Populationen im Laufe der Zeit
          entwickeln und wie sie auf die verschiedenen Parameter reagieren. Zum
          Startzeitpunkt gibt es 80 Jägerlebewesen und 130 Beutelebewesen.
        </div>
      </div>

      <div className="section">
        <Graph data={data.slice(-1000)} />
      </div>
      <div className="section controls">
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M8 19V5l11 7z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M14 19V5h4v14zm-8 0V5h4v14z"></path>
            </svg>
          )}
        </button>

        <button
          className="playback-speed"
          onClick={() => {
            if (playbackSpeed == playbackSpeedOptions.NORMAL) {
              setPlaybackSpeed(playbackSpeedOptions.FAST);
            }
            if (playbackSpeed == playbackSpeedOptions.FAST) {
              setPlaybackSpeed(playbackSpeedOptions.SLOW);
            }
            if (playbackSpeed == playbackSpeedOptions.SLOW) {
              setPlaybackSpeed(playbackSpeedOptions.NORMAL);
            }
          }}
        >
          {playbackSpeed == playbackSpeedOptions.NORMAL
            ? "1×"
            : playbackSpeed == playbackSpeedOptions.FAST
            ? "2.5×"
            : "0.5×"}
        </button>
        <button
          onClick={() => {
            setData([{ hunter: 70, prey: 130, time: 1 }]);
            setIsPaused(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 22q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 13h2q0 2.925 2.038 4.963T12 20t4.963-2.037T19 13t-2.037-4.962T12 6h-.15l1.55 1.55L12 9L8 5l4-4l1.4 1.45L11.85 4H12q1.875 0 3.513.713t2.85 1.925t1.925 2.85T21 13t-.712 3.513t-1.925 2.85t-2.85 1.925T12 22"
            ></path>
          </svg>
        </button>
      </div>
    </>
  );
}
