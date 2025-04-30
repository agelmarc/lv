interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  children?: React.ReactNode;
}

export function Slider({
  min,
  max,
  step,
  value,
  onChange,
  children,
}: SliderProps) {
  return (
    <div className="slider">
      {children}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}
