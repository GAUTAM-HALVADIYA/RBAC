import React from 'react';

export default function Pagination() {
  return (
    <div className="d-flex justify-content-between align-items-center py-3">
      <span className="text-muted small">Showing 1 to 10 of 50 entries</span>
      <ul className="pagination mb-0">
        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
        <li className="page-item active"><a className="page-link" href="#">1</a></li>
        <li className="page-item"><a className="page-link" href="#">2</a></li>
        <li className="page-item"><a className="page-link" href="#">3</a></li>
        <li className="page-item"><a className="page-link" href="#">Next</a></li>
      </ul>
    </div>
  );
}