
'use client';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="bg-white rounded-xl p-1 shadow-sm">
      <div className="grid grid-cols-4 gap-1">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === period.value
                ? 'bg-teal-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
