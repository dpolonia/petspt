import { useState, useMemo } from 'react';
import { ULS_REGISTRY } from '../config/ulsRegistry';
import { useSNSData } from '../hooks/useSNSData';

function ComparisonCard({ label, valorA, valorB, unidade, inverso = false }: {
  label: string; valorA: number | null; valorB: number | null; unidade: string; inverso?: boolean;
}) {
  const diff = (valorA != null && valorB != null) ? valorA - valorB : null;
  const corA = diff === null ? 'text-gray-700' : (inverso ? (diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-gray-700') : (diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-700'));
  const corB = diff === null ? 'text-gray-700' : (inverso ? (diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-700') : (diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-gray-700'));
  const fmt = (v: number | null) => v != null ? v.toLocaleString('pt-PT') : '\u2014';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-xs text-gray-500 mb-2 text-center">{label}</div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className={`text-lg font-bold ${corA} text-center`}>{fmt(valorA)}</div>
        <div className="text-xs text-gray-400 text-center">{unidade}</div>
        <div className={`text-lg font-bold ${corB} text-center`}>{fmt(valorB)}</div>
      </div>
    </div>
  );
}

function extractLatestForInst(records: Record<string, unknown>[], instName: string, valueField: string): number | null {
  const matching = records.filter(r => {
    const inst = String(r.instituicao || r.aces || r.area_csp || '').toLowerCase();
    return inst.includes(instName.toLowerCase());
  });
  if (matching.length === 0) return null;
  // Get the latest period
  const sorted = matching.sort((a, b) => String(b.tempo || b.periodo || '').localeCompare(String(a.tempo || a.periodo || '')));
  const val = Number(sorted[0][valueField]);
  return isNaN(val) ? null : val;
}

export default function ComparadorPage() {
  const [ulsACode, setUlsACode] = useState('');
  const [ulsBCode, setUlsBCode] = useState('');

  const ulsOptions = ULS_REGISTRY.filter(u => !u.code.startsWith('IPO'));
  const ulsA = ulsOptions.find(u => u.code === ulsACode);
  const ulsB = ulsOptions.find(u => u.code === ulsBCode);

  const bothSelected = !!ulsA && !!ulsB;

  // Fetch all datasets (latest records) when both selected
  const cirurgiaQuery = useMemo(() => bothSelected ? {
    dataset: 'intervencoes-cirurgicas',
    where: "tempo >= '2025-01'",
    limit: 100,
  } : null, [bothSelected]);

  const consultasQuery = useMemo(() => bothSelected ? {
    dataset: 'consultas-em-tempo-real',
    where: "tempo >= '2025-01'",
    limit: 100,
  } : null, [bothSelected]);

  const utentesQuery = useMemo(() => bothSelected ? {
    dataset: 'utentes-inscritos-em-cuidados-de-saude-primarios',
    where: "periodo >= '2025-01'",
    limit: 100,
  } : null, [bothSelected]);

  const partosQuery = useMemo(() => bothSelected ? {
    dataset: 'partos-e-cesarianas',
    where: "tempo >= '2025-01'",
    limit: 100,
  } : null, [bothSelected]);

  const urgenciasQuery = useMemo(() => bothSelected ? {
    dataset: 'atendimentos-por-tipo-de-urgencia-hospitalar-link',
    where: "tempo >= '2025-01'",
    limit: 100,
  } : null, [bothSelected]);

  const { data: cirurgiaData, loading: l1 } = useSNSData(cirurgiaQuery);
  const { data: consultasData, loading: l2 } = useSNSData(consultasQuery);
  const { data: utentesData, loading: l3 } = useSNSData(utentesQuery);
  const { data: partosData, loading: l4 } = useSNSData(partosQuery);
  const { data: urgenciasData, loading: l5 } = useSNSData(urgenciasQuery);

  const loading = l1 || l2 || l3 || l4 || l5;

  // Extract short names for fuzzy matching
  const nameA = ulsA?.nome.replace('ULS ', '').replace(', EPE', '') || '';
  const nameB = ulsB?.nome.replace('ULS ', '').replace(', EPE', '') || '';

  // Build comparison data (no useMemo — React Compiler handles this)
  const comparisons = !bothSelected ? [] : [
    { label: 'Cirurgias Programadas', valorA: extractLatestForInst(cirurgiaData, nameA, 'no_intervencoes_cirurgicas_programadas'), valorB: extractLatestForInst(cirurgiaData, nameB, 'no_intervencoes_cirurgicas_programadas'), unidade: 'cirurgias', inverso: false, eixo: 'E1' },
    { label: 'Cirurgias Urgentes', valorA: extractLatestForInst(cirurgiaData, nameA, 'no_intervencoes_cirurgicas_urgentes'), valorB: extractLatestForInst(cirurgiaData, nameB, 'no_intervencoes_cirurgicas_urgentes'), unidade: 'cirurgias', inverso: false, eixo: 'E1' },
    { label: 'Consultas CTH (total)', valorA: extractLatestForInst(consultasData, nameA, 'no_primeiras_ce_realizadas_com_registo_no_cth'), valorB: extractLatestForInst(consultasData, nameB, 'no_primeiras_ce_realizadas_com_registo_no_cth'), unidade: 'consultas', inverso: false, eixo: 'E1' },
    { label: 'Consultas dentro TMRG', valorA: extractLatestForInst(consultasData, nameA, 'no_primeiras_ce_prestadas_dentro_do_tmrg'), valorB: extractLatestForInst(consultasData, nameB, 'no_primeiras_ce_prestadas_dentro_do_tmrg'), unidade: 'consultas', inverso: false, eixo: 'E1' },
    { label: 'Partos', valorA: extractLatestForInst(partosData, nameA, 'no_de_partos'), valorB: extractLatestForInst(partosData, nameB, 'no_de_partos'), unidade: 'partos', inverso: false, eixo: 'E2' },
    { label: 'Cesarianas', valorA: extractLatestForInst(partosData, nameA, 'no_de_cesarianas'), valorB: extractLatestForInst(partosData, nameB, 'no_de_cesarianas'), unidade: 'cesarianas', inverso: true, eixo: 'E2' },
    { label: 'Total Urgencias', valorA: extractLatestForInst(urgenciasData, nameA, 'total_urgencias'), valorB: extractLatestForInst(urgenciasData, nameB, 'total_urgencias'), unidade: 'atendimentos', inverso: false, eixo: 'E3' },
    { label: 'Urgencias Pediatricas', valorA: extractLatestForInst(urgenciasData, nameA, 'urgencias_pediatricas'), valorB: extractLatestForInst(urgenciasData, nameB, 'urgencias_pediatricas'), unidade: 'atendimentos', inverso: false, eixo: 'E3' },
    { label: 'Utentes Inscritos CSP', valorA: extractLatestForInst(utentesData, nameA, 'utentes_inscritos_csp'), valorB: extractLatestForInst(utentesData, nameB, 'utentes_inscritos_csp'), unidade: 'utentes', inverso: false, eixo: 'E4' },
    { label: '% sem MdF', valorA: extractLatestForInst(utentesData, nameA, 'total_utentes_sem_mdf_atribuido0'), valorB: extractLatestForInst(utentesData, nameB, 'total_utentes_sem_mdf_atribuido0'), unidade: '%', inverso: true, eixo: 'E4' },
  ];

  // Group by eixo
  const grouped: Record<string, typeof comparisons> = {};
  for (const c of comparisons) {
    if (!grouped[c.eixo]) grouped[c.eixo] = [];
    grouped[c.eixo].push(c);
  }

  const eixoNames: Record<string, string> = {
    E1: 'Resposta a Tempo e Horas', E2: 'Bebes e Maes', E3: 'Urgencias', E4: 'Cuidados Primarios',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">&hArr;</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Comparador de ULS</h1>
            <p className="text-sm text-gray-500">Seleccione duas Unidades Locais de Saude para comparacao</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">ULS A</label>
          <select value={ulsACode} onChange={e => setUlsACode(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">Seleccionar ULS...</option>
            {ulsOptions.map(u => (
              <option key={u.code} value={u.code} disabled={u.code === ulsBCode}>{u.nome} ({u.regiao})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">ULS B</label>
          <select value={ulsBCode} onChange={e => setUlsBCode(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">Seleccionar ULS...</option>
            {ulsOptions.map(u => (
              <option key={u.code} value={u.code} disabled={u.code === ulsACode}>{u.nome} ({u.regiao})</option>
            ))}
          </select>
        </div>
      </div>

      {!bothSelected ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Seleccione duas ULS para iniciar a comparacao</p>
          <p className="text-sm mt-2">Os dados sao obtidos em tempo real de 5 datasets da API Transparencia SNS</p>
        </div>
      ) : loading ? (
        <div className="text-center py-16">
          <div className="animate-pulse text-gray-400">A carregar dados de 5 datasets...</div>
        </div>
      ) : (
        <div>
          {/* Header with ULS names */}
          <div className="grid grid-cols-3 gap-4 mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-sm font-bold text-indigo-600">{ulsA?.nome}</div>
              <div className="text-xs text-gray-400">{ulsA?.regiao}</div>
            </div>
            <div className="text-center text-xs text-gray-400 self-center">vs.</div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-600">{ulsB?.nome}</div>
              <div className="text-xs text-gray-400">{ulsB?.regiao}</div>
            </div>
          </div>

          {/* Comparison cards grouped by eixo */}
          {Object.entries(grouped).map(([eixo, cards]) => (
            <div key={eixo} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {eixo} — {eixoNames[eixo] || eixo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cards.map((c, i) => (
                  <ComparisonCard key={i} label={c.label} valorA={c.valorA} valorB={c.valorB} unidade={c.unidade} inverso={c.inverso} />
                ))}
              </div>
            </div>
          ))}

          {comparisons.every(c => c.valorA === null && c.valorB === null) && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Sem dados disponiveis para estas ULS nos datasets mais recentes.
              Os nomes das instituicoes na API podem diferir dos nomes no registo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
