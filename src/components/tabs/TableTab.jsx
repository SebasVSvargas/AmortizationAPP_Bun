import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import { useCalculations } from '../../context/CalculationsContext';
import { useLoanContext } from '../../context/LoanContext';
import { formatCurrency } from '../../utils/formatters';

const TableTab = () => {
  const { optSchedule, baseline, optInterest } = useCalculations();
  const { loanAmount, interestRate, termMonths } = useLoanContext();

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

    // Header
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('Tabla de Amortización', 40, 50);

    const realTerm = optSchedule.length;
    const savedMonths = termMonths - realTerm;
    const savedInterest = baseline.totalInterest - optInterest;

    const plazoText = `Plazo inicial: ${termMonths} meses`;
    const plazoText2 = savedMonths > 0
      ? `Plazo con abonos: ${realTerm} meses    (ahorro: ${savedMonths} meses)`
      : "";
    const interesText = `Intereses iniciales: ${formatCurrency(baseline.totalInterest)}`;
    const interesText2 = savedInterest > 0
      ? `Intereses con abonos: ${formatCurrency(optInterest)} (ahorro: ${formatCurrency(savedInterest)})`
      : "";

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Monto: ${formatCurrency(loanAmount)}`, 40, 72);
    doc.text(`Tasa anual: ${interestRate}%`, 270, 72);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 430, 72);
    doc.text(plazoText, 40, 86);
    doc.text(plazoText2, 270, 86);
    doc.text(interesText, 40, 100);

    if(interesText2 !== ""){
      doc.text(interesText2, 270, 100);
    }

    const rows = optSchedule.map((row) => [
      row.month,
      formatCurrency(row.payment) + (row.extra > 0 ? ' *' : ''),
      formatCurrency(row.principal + row.extra),
      formatCurrency(row.interest),
      formatCurrency(row.balance),
    ]);

    autoTable(doc, {
      startY: 118,
      head: [['Mes', 'Cuota', 'Capital', 'Interés', 'Saldo']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 35 },
        1: { halign: 'right' },
        2: { halign: 'right', textColor: [5, 150, 105] },
        3: { halign: 'right', textColor: [244, 63, 94] },
        4: { halign: 'right' },
      },
      didParseCell: (data) => {
        const colAlign = ['center', 'right', 'right', 'right', 'right'];
        if (data.section === 'head') {
          data.cell.styles.halign = colAlign[data.column.index];
        }
        if (
          data.section === 'body' &&
          data.column.index === 1 &&
          typeof data.cell.raw === 'string' &&
          data.cell.raw.endsWith(' *')
        ) {
          data.cell.styles.textColor = [234, 88, 12];
        }
      },
      margin: { left: 40, right: 40 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `* Incluye abono extraordinario   |   Página ${i} de ${pageCount}`,
        40,
        doc.internal.pageSize.getHeight() - 20,
      );
    }

    doc.save(`amortizacion_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="relative">
      <button
        onClick={downloadPDF}
        title="Descargar PDF"
        className="absolute -top-7 right-5 z-10 w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex flex-col items-center justify-center gap-0.5 shadow-lg transition-all"
      >
        <Download size={16} />
        <span className="text-[10px] font-bold leading-none">PDF</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Mes</th>
                <th className="px-6 py-4 font-bold text-slate-600">Cuota</th>
                <th className="px-6 py-4 font-bold text-slate-600">Capital</th>
                <th className="px-6 py-4 font-bold text-slate-600">Interés</th>
                <th className="px-6 py-4 font-bold text-slate-600">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {optSchedule.map((row) => (
                <tr key={row.month} className={`hover:bg-slate-50 transition-colors ${row.extra > 0 ? 'bg-orange-50/30' : ''}`}>
                  <td className="px-6 py-3 text-slate-400">{row.month}</td>
                  <td className="px-6 py-3 font-black text-slate-800">
                    {formatCurrency(row.payment)}
                    {row.extra > 0 && <span className="block text-[8px] text-orange-600 font-bold uppercase">Incluye Abono</span>}
                  </td>
                  <td className="px-6 py-3 text-emerald-600 font-bold">{formatCurrency(row.principal + row.extra)}</td>
                  <td className="px-6 py-3 text-rose-500">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-3 font-bold text-slate-600">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableTab;
