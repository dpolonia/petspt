import { ReferenceArea } from 'recharts';
import { PERIODS, resolvePeriodEnd } from '../../config/periods';

/**
 * Componente que renderiza as 3 faixas cromáticas como ReferenceAreas do Recharts.
 * Usar dentro de qualquer <ComposedChart>, <LineChart>, <BarChart>, etc.
 *
 * Requisito: o eixo X do gráfico deve usar datas no formato 'YYYY-MM' ou 'YYYY-MM-DD'.
 *
 * Uso:
 *   <LineChart data={data}>
 *     <PeriodBackground />
 *     <Line ... />
 *   </LineChart>
 */
export default function PeriodBackground() {
  return (
    <>
      {PERIODS.map((period) => (
        <ReferenceArea
          key={period.id}
          x1={period.start}
          x2={resolvePeriodEnd(period.end)}
          fill={period.color}
          fillOpacity={period.opacity}
          label={{
            value: period.label,
            position: 'insideTopLeft',
            fontSize: 10,
            fill: '#666',
          }}
        />
      ))}
    </>
  );
}
