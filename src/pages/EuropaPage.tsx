import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import ChartWrapper from '../components/charts/ChartWrapper';

const COUNTRY_NAMES: Record<string, string> = {
  PT: 'Portugal', ES: 'Espanha', FR: 'Franca', IT: 'Italia', DE: 'Alemanha', EU27_2020: 'Media UE',
};

const STATIC_EUROSTAT = [
  { indicador: 'Despesa em saude (% PIB)', PT: 10.6, ES: 10.4, FR: 12.1, IT: 9.0, DE: 12.7, EU27_2020: 10.9, unidade: '% PIB' },
  { indicador: 'Camas hospitalares (por 100K hab.)', PT: 355, ES: 297, FR: 590, IT: 314, DE: 780, EU27_2020: 530, unidade: 'por 100K hab.' },
  { indicador: 'Taxa cesarianas (%)', PT: 33, ES: 26, FR: 21, IT: 32, DE: 31, EU27_2020: 27, unidade: '%' },
];

const COUNTRIES = ['PT', 'ES', 'FR', 'IT', 'DE', 'EU27_2020'] as const;

export default function EuropaPage() {
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);
  const [source, setSource] = useState<'static' | 'firestore'>('static');

  // Try loading from Firestore once (via button)
  const loadFromFirestore = async () => {
    try {
      const snap = await getDocs(collection(db, 'eurostat'));
      if (snap.docs.length > 0) setSource('firestore');
      setFirestoreLoaded(true);
    } catch { setFirestoreLoaded(true); }
  };

  if (!firestoreLoaded) loadFromFirestore();

  const data = STATIC_EUROSTAT;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">EU</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Comparacao Internacional</h1>
            <p className="text-sm text-gray-500">Portugal vs. Uniao Europeia — indicadores de saude (Eurostat)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8 overflow-x-auto">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Tabela Comparativa</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Indicador</th>
              {COUNTRIES.map(c => (
                <th key={c} className={`px-3 py-2 text-center text-xs font-medium ${c === 'PT' ? 'text-orange-600' : c === 'EU27_2020' ? 'text-blue-600' : 'text-gray-500'}`}>
                  {COUNTRY_NAMES[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(row => {
              const euVal = row.EU27_2020;
              return (
                <tr key={row.indicador} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-xs font-medium text-gray-700">{row.indicador}</td>
                  {COUNTRIES.map(c => {
                    const val = row[c];
                    const isPT = c === 'PT';
                    const isAboveEU = val > euVal;
                    return (
                      <td key={c} className={`px-3 py-3 text-center text-xs font-mono ${isPT ? (isAboveEU ? 'text-orange-600 font-bold' : 'text-green-600 font-bold') : 'text-gray-600'}`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3 text-[10px] text-gray-400">
          Fonte: Eurostat (2022-2023). Laranja = PT acima da media UE. Verde = PT abaixo.
          {source === 'firestore' && ' Dados Eurostat do Firestore.'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ChartWrapper titulo="Cesarianas" subtitulo="PT: 33% vs. Media UE: 27%" fonte="Eurostat + PETS" height={100}>
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">33% <span className="text-gray-400 text-sm">vs.</span> 27%</div>
              <div className="text-xs text-gray-500 mt-1">Meta PETS: &lt;30%. PT +6pp acima media UE.</div>
            </div>
          </div>
        </ChartWrapper>
        <ChartWrapper titulo="Camas Hospitalares" subtitulo="PT: 355 vs. Media UE: 530 por 100K" fonte="Eurostat" height={100}>
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">355 <span className="text-gray-400 text-sm">vs.</span> 530</div>
              <div className="text-xs text-gray-500 mt-1">PT tem 33% menos camas que a media UE.</div>
            </div>
          </div>
        </ChartWrapper>
        <ChartWrapper titulo="Despesa Saude" subtitulo="PT: 10.6% PIB vs. Media UE: 10.9%" fonte="Eurostat" height={100}>
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">10.6% <span className="text-gray-400 text-sm">vs.</span> 10.9%</div>
              <div className="text-xs text-gray-500 mt-1">PT proximo da media UE em despesa relativa.</div>
            </div>
          </div>
        </ChartWrapper>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 text-xs text-gray-500">
        <h4 className="font-semibold text-gray-700 mb-2">Metodologia</h4>
        <p>Dados Eurostat (2022-2023). Paises: PT, ES, FR, IT, DE, media UE-27. Indicadores seleccionados para correspondencia com eixos PETS. Fonte: ec.europa.eu/eurostat</p>
      </div>
    </div>
  );
}
