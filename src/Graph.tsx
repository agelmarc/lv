import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { LVDataPoint } from "./common";

interface GraphProps {
  data: LVDataPoint[];
}

const width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 40;

export function Graph({ data }: GraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const x = d3.scaleLinear([0, 1000], [marginLeft, width - marginRight]);

  const yMax = d3.max([
    d3.max(data, (data) => data.prey)!,
    d3.max(data, (data) => data.hunter)!,
  ])!;

  const y = d3.scaleLinear([0, yMax + 10], [height - marginBottom, marginTop]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const xaxis = svg.select<SVGGElement>(".xaxis");
    const yaxis = svg.select<SVGGElement>(".yaxis");
    xaxis.selectAll("*").remove();
    yaxis.selectAll("*").remove();
    xaxis.call(d3.axisBottom(x).tickSize(0).ticks([]));

    yaxis
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      );
  }, [x, y]);

  const line = d3.line((_, i) => x(i), y);

  return (
    <svg width={width} height={height} ref={svgRef} className="graph">
      <g
        className="xaxis"
        transform={`translate(0,${height - marginBottom})`}
      />
      <g className="yaxis" transform={`translate(${marginLeft},0)`} />
      <path
        fill="none"
        stroke="var(--beute)"
        strokeWidth={4}
        strokeLinecap="round"
        d={line(data.map((d) => d.prey)) ?? undefined}
      />
      <path
        fill="none"
        stroke="var(--jäger)"
        strokeWidth={4}
        strokeLinecap="round"
        d={line(data.map((d) => d.hunter)) ?? undefined}
      />
    </svg>
  );
}
