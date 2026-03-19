export type ChartView = 'mensal' | 'trimestral' | 'cumulativo';

interface ChartViewToggleProps {
  view: ChartView;
  onChange: (view: ChartView) => void;
}

export default function ChartViewToggle({ view, onChange }: ChartViewToggleProps) {
  const options: { value: ChartView; label: string }[] = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'cumulativo', label: 'Acumulado' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-md transition-colors ${
            view === opt.value ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
