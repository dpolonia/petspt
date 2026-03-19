import { ScenarioParameter } from '../../services/forecast/scenarioEngine';

interface ScenarioSliderProps {
  parametro: ScenarioParameter;
  value: number;
  onChange: (value: number) => void;
}

export default function ScenarioSlider({ parametro, value, onChange }: ScenarioSliderProps) {
  const fmt = (v: number) => {
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toLocaleString('pt-PT');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{parametro.label}</label>
        <span className="text-sm font-bold text-indigo-600">{fmt(value)} {parametro.unit}</span>
      </div>
      <input
        type="range" min={parametro.min} max={parametro.max} step={parametro.step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{fmt(parametro.min)}</span>
        <span className="text-gray-500 italic truncate max-w-[60%] text-center">{parametro.descricao}</span>
        <span>{fmt(parametro.max)}</span>
      </div>
    </div>
  );
}
