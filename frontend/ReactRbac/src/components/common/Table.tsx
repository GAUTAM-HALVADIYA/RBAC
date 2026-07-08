import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
}

export default function Table({ headers, data }: TableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data available</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {headers.map((header, i) => (
                  <td key={i}>{row[header.toLowerCase()] || row[Object.keys(row)[i]] || '-'}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}