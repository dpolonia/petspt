import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CONTRACT_TARGETS } from '../config/contractTargets';

export interface ContractData {
  ulsCode: string;
  ano: number;
  producao: Record<string, number | undefined>;
  indicadores: Record<string, number | undefined>;
  confianca: 'alta' | 'media' | 'baixa';
  fonte: 'pdf_extraido' | 'hardcoded' | 'projecao_oe';
}

export function useContractData(ano = 2024) {
  const [allData, setAllData] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'firestore' | 'hardcoded'>('hardcoded');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'contratos_programa'));
        const docs = snapshot.docs
          .filter(d => d.id.endsWith(`_${ano}`))
          .map(d => ({ ...d.data(), fonte: 'pdf_extraido' as const } as ContractData));

        if (docs.length > 0) {
          setAllData(docs);
          setSource('firestore');
        } else {
          // Fallback to hardcoded
          const hc = CONTRACT_TARGETS.flatMap(ct =>
            ct.contratos.filter(c => c.ano === ano).map(c => ({
              ulsCode: ct.ulsCode,
              ano: c.ano,
              producao: c.metas as Record<string, number | undefined>,
              indicadores: {} as Record<string, number | undefined>,
              confianca: 'media' as const,
              fonte: c.fonte as 'hardcoded' | 'projecao_oe',
            }))
          );
          setAllData(hc);
          setSource('hardcoded');
        }
      } catch {
        // Firestore may not be initialized — use hardcoded
        const hc = CONTRACT_TARGETS.flatMap(ct =>
          ct.contratos.filter(c => c.ano === ano).map(c => ({
            ulsCode: ct.ulsCode,
            ano: c.ano,
            producao: c.metas as Record<string, number | undefined>,
            indicadores: {} as Record<string, number | undefined>,
            confianca: 'media' as const,
            fonte: c.fonte as 'hardcoded' | 'projecao_oe',
          }))
        );
        setAllData(hc);
        setSource('hardcoded');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ano]);

  return { allData, loading, source };
}
