import React from 'react';

export default function Pagination() {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-gray-600">Showing 1 to 10 of 50 entries</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded hover:bg-gray-100">Prev</button>
        <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
      </div>
    </div>
  );
}