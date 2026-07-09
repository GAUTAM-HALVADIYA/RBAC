import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

export default function Pagination() {
  return (
    <div className="d-flex justify-content-between align-items-center py-3">
      <span className="text-muted small">Showing 1 to 10 of 50 entries</span>
      <BootstrapPagination className="mb-0">
        <BootstrapPagination.Prev />
        <BootstrapPagination.Item active>{1}</BootstrapPagination.Item>
        <BootstrapPagination.Item>{2}</BootstrapPagination.Item>
        <BootstrapPagination.Item>{3}</BootstrapPagination.Item>
        <BootstrapPagination.Next />
      </BootstrapPagination>
    </div>
  );
}