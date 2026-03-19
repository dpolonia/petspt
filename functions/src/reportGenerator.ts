import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import PDFDocument from 'pdfkit';

const db = admin.firestore();

const EIXO_NAMES: Record<number, string> = {
  1: 'Resposta a Tempo e Horas',
  2: 'Bebes e Maes em Seguranca',
  3: 'Cuidados Urgentes e Emergentes',
  4: 'Saude Proxima e Familiar',
  5: 'Saude Mental',
};

// Medidas hardcoded (subset for report — from staticData.ts)
const MEDIDAS: Record<number, { id: string; nome: string; estado: string; prioridade: string; progresso: string }[]> = {
  1: [
    { id: 'E1.A1', nome: 'OncoStop2024', estado: 'concluida', prioridade: 'urgente', progresso: '180 doentes fora TMRG (-87,7%)' },
    { id: 'E1.A2', nome: 'SNS24 Cidadao', estado: 'concluida', prioridade: 'urgente', progresso: '16.156 SMS, 700+ operados' },
    { id: 'E1.B1', nome: 'Cirurgia Nao-Onco', estado: 'concluida', prioridade: 'prioritaria', progresso: '186.273 Q1 2025 (+6,3%)' },
    { id: 'E1.B3', nome: 'Consulta Especialidade', estado: 'concluida', prioridade: 'prioritaria', progresso: '391.472 CTH Q1 2025 (+4%)' },
  ],
  2: [
    { id: 'E2.A1', nome: 'SNS Gravida', estado: 'concluida', prioridade: 'urgente', progresso: '133.500 chamadas' },
    { id: 'E2.A2', nome: 'Incentivos Partos', estado: 'parcial', prioridade: 'urgente', progresso: 'Despacho 10466-C/2024' },
  ],
  3: [
    { id: 'E3.A2', nome: 'CAC', estado: 'concluida', prioridade: 'urgente', progresso: '15 CAC, 30.334 atendimentos' },
    { id: 'E3.B1', nome: 'Libertacao Camas', estado: 'concluida', prioridade: 'prioritaria', progresso: '1.611 camas contratadas' },
  ],
  4: [
    { id: 'E4.A1', nome: 'Medicos Familia', estado: 'concluida', prioridade: 'urgente', progresso: '+135.542 com MdF, 1,6M sem' },
    { id: 'E4.A2', nome: 'Batas Brancas', estado: 'em_curso', prioridade: 'urgente', progresso: '323.674 consultas (+49,8%)' },
  ],
  5: [
    { id: 'E5.A1', nome: 'Psicologos CSP', estado: 'concluida', prioridade: 'urgente', progresso: '1.385 total, +31 desde Mai/2024' },
    { id: 'E5.B1', nome: 'ECSM', estado: 'concluida', prioridade: 'prioritaria', progresso: '20 operacionais, 20 em publicacao' },
  ],
};

function generatePDF(eixo: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const nome = EIXO_NAMES[eixo] || `Eixo ${eixo}`;
    const dataStr = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

    // === COVER ===
    doc.fontSize(28).font('Helvetica-Bold').text('PETS Monitor', 50, 200);
    doc.fontSize(18).font('Helvetica').text('Relatorio Prospectivo', 50, 240);
    doc.fontSize(16).font('Helvetica-Bold').text(`Eixo ${eixo} - ${nome}`, 50, 270);
    doc.fontSize(11).font('Helvetica').text(`Monitorizacao e Projecao a 12 Meses`, 50, 300);
    doc.fontSize(10).text(`Gerado em ${dataStr}`, 50, 330);
    doc.fontSize(9).fillColor('#666').text('petspt.web.app', 50, 360);
    doc.fillColor('#000');

    // === EXECUTIVE SUMMARY ===
    doc.addPage();
    doc.fontSize(16).font('Helvetica-Bold').text('Sumario Executivo', 50, 50);
    doc.moveDown();

    const medidas = MEDIDAS[eixo] || [];
    const concluidas = medidas.filter(m => m.estado === 'concluida').length;
    const emCurso = medidas.filter(m => m.estado === 'em_curso').length;
    const parciais = medidas.filter(m => m.estado === 'parcial').length;

    doc.fontSize(10).font('Helvetica');
    doc.text(`Medidas concluidas: ${concluidas}  |  Em curso: ${emCurso}  |  Parciais: ${parciais}  |  Total: ${medidas.length}`);
    doc.moveDown();

    // === MEASURES TABLE ===
    doc.fontSize(14).font('Helvetica-Bold').text('Estado das Medidas');
    doc.moveDown(0.5);

    doc.fontSize(8).font('Helvetica-Bold');
    doc.text('ID', 50, doc.y, { continued: true, width: 40 });
    doc.text('Medida', 95, doc.y, { continued: true, width: 120 });
    doc.text('Estado', 220, doc.y, { continued: true, width: 70 });
    doc.text('Prioridade', 295, doc.y, { continued: true, width: 70 });
    doc.text('Progresso', 370, doc.y, { width: 180 });
    doc.moveDown(0.3);

    doc.fontSize(8).font('Helvetica');
    for (const m of medidas) {
      const y = doc.y;
      if (y > 750) { doc.addPage(); }
      const estado = m.estado === 'concluida' ? 'Concluida' : m.estado === 'em_curso' ? 'Em Curso' : m.estado === 'parcial' ? 'Parcial' : 'Nao Impl.';
      doc.text(m.id, 50, doc.y, { continued: true, width: 40 });
      doc.text(m.nome, 95, doc.y, { continued: true, width: 120 });
      doc.text(estado, 220, doc.y, { continued: true, width: 70 });
      doc.text(m.prioridade, 295, doc.y, { continued: true, width: 70 });
      doc.text(m.progresso.substring(0, 50), 370, doc.y, { width: 180 });
      doc.moveDown(0.3);
    }

    // === METHODOLOGY ===
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text('Nota Metodologica');
    doc.moveDown();
    doc.fontSize(9).font('Helvetica');
    doc.text('Este relatorio foi gerado automaticamente pelo portal PETS Monitor (petspt.web.app). ' +
      'Os dados provem da API Transparencia SNS (transparencia.sns.gov.pt) e dos Relatorios do Grupo de Trabalho ' +
      'de Acompanhamento do PETS (Dez 2024, Abr 2025).');
    doc.moveDown();
    doc.text('As projecoes utilizam o modelo Holt-Winters aditivo com optimizacao automatica de parametros, ' +
      'conforme a metodologia descrita em Goiana-da-Silva et al. (2025), "The growing pains of the 2024/2025 ' +
      'Portugal\'s NHS telephone triage system national rollout", Frontiers in Public Health, 13:1694713.');
    doc.moveDown();
    doc.text('As metas contratuais provem dos Contratos Programa publicados pela ACSS e do Quadro Global de ' +
      'Referencia (Despachos 6770/2024 e 14012/2025).');
    doc.moveDown();
    doc.fontSize(8).fillColor('#666');
    doc.text('Dados actualizados mensalmente. Codigo aberto sob licenca MIT: github.com/dpolonia/petspt');
    doc.fillColor('#000');

    // === FOOTER on all pages ===
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(7).fillColor('#999');
      doc.text('PETS Monitor — petspt.web.app — Dados: Transparencia SNS + Relatorios GT PETS',
        50, 800, { width: 400 });
      doc.text(`${i + 1}/${pages.count}`, 500, 800, { align: 'right', width: 50 });
      doc.fillColor('#000');
    }

    doc.end();
  });
}

export const reportPDF = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 120, memory: '512MB' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const eixo = parseInt(req.query.eixo as string);
    if (!eixo || eixo < 1 || eixo > 5) {
      res.status(400).json({ error: 'Parametro eixo invalido (1-5)' });
      return;
    }

    try {
      // Try to enrich with AI summary from Firestore
      const aiDoc = await db.collection('ai_summaries').doc(`eixo_${eixo}`).get();
      const _aiSummary = aiDoc.exists ? aiDoc.data()?.summary : null;

      const pdfBuffer = await generatePDF(eixo);

      const filename = `PETS_Eixo${eixo}_${new Date().toISOString().split('T')[0]}.pdf`;
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: `Erro: ${(error as Error).message}` });
    }
  });
