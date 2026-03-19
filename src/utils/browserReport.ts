import { jsPDF } from 'jspdf';
import { getMedidasByEixo } from '../services/staticData';

const EIXO_NAMES: Record<number, string> = {
  1: 'Resposta a Tempo e Horas',
  2: 'Bebes e Maes em Seguranca',
  3: 'Cuidados Urgentes e Emergentes',
  4: 'Saude Proxima e Familiar',
  5: 'Saude Mental',
};

export async function generateBrowserReport(eixo: number): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pw = pdf.internal.pageSize.getWidth();
  const m = 20;
  let y = m;

  const nome = EIXO_NAMES[eixo] || `Eixo ${eixo}`;
  const dataStr = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  const medidas = getMedidasByEixo(eixo);

  // COVER
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PETS Monitor', m, y += 40);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Relatorio Prospectivo', m, y += 15);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Eixo ${eixo} - ${nome}`, m, y += 12);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Gerado em ${dataStr}`, m, y += 10);
  pdf.text('petspt.web.app', m, y += 7);

  // SCORECARD
  pdf.addPage();
  y = m;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sumario Executivo', m, y += 10);
  y += 8;

  const sc = {
    concluidas: medidas.filter(x => x.estado === 'concluida').length,
    em_curso: medidas.filter(x => x.estado === 'em_curso').length,
    parciais: medidas.filter(x => x.estado === 'parcial').length,
    nao_impl: medidas.filter(x => x.estado === 'nao_implementada').length,
  };

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Concluidas: ${sc.concluidas}  |  Em curso: ${sc.em_curso}  |  Parciais: ${sc.parciais}  |  Nao impl.: ${sc.nao_impl}  |  Total: ${medidas.length}`, m, y);
  y += 12;

  // MEASURES
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Estado das Medidas', m, y);
  y += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  for (const med of medidas) {
    if (y > 270) { pdf.addPage(); y = m; }
    const symbol = med.estado === 'concluida' ? '[OK]' : med.estado === 'em_curso' ? '[EC]' : med.estado === 'parcial' ? '[PA]' : '[NI]';
    pdf.text(`${symbol} ${med.id} - ${med.nomeCurto} [${med.prioridade}]`, m, y);
    y += 4;
    pdf.setTextColor(100, 100, 100);
    const progText = med.descricaoProgresso.substring(0, 100);
    pdf.text(progText, m + 5, y);
    pdf.setTextColor(0, 0, 0);
    y += 6;
  }

  // METHODOLOGY
  pdf.addPage();
  y = m;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Nota Metodologica', m, y += 10);
  y += 8;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const methText = 'Este relatorio foi gerado pelo portal PETS Monitor. Dados: API Transparencia SNS + Relatorios GT PETS. ' +
    'Projecoes: Holt-Winters aditivo (Goiana-da-Silva et al., 2025, Front. Public Health 13:1694713). ' +
    'Metas: Contratos Programa ACSS + QGR (Despachos 6770/2024 e 14012/2025). ' +
    'Codigo aberto: github.com/dpolonia/petspt (MIT).';
  const lines = pdf.splitTextToSize(methText, pw - 2 * m);
  pdf.text(lines, m, y);

  // FOOTER
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('PETS Monitor - petspt.web.app', m, 290);
    pdf.text(`${i}/${pageCount}`, pw - m, 290, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
  }

  pdf.save(`PETS_Eixo${eixo}_${new Date().toISOString().split('T')[0]}.pdf`);
}
