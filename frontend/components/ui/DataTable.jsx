'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Download } from 'lucide-react';
import { SparklineChart } from './SparklineChart';

export function DataTable({ columns, data, filename = "export.csv" }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = sortedData.map(row => 
      columns.map(c => {
        let val = row[c.key];
        if (Array.isArray(val)) val = val.join('|');
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-slate-200/80 rounded-2xl bg-white shadow-xs">
        <p className="text-slate-400 text-sm font-medium">No data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-3">
        <button
          onClick={handleExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all border border-slate-200/90 text-xs font-semibold shadow-xs hover:shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/90 text-slate-600 font-semibold text-xs tracking-wider uppercase border-b border-slate-200/80">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="px-5 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-[#2563eb]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#2563eb]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/70 transition-colors group">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 whitespace-nowrap text-slate-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
