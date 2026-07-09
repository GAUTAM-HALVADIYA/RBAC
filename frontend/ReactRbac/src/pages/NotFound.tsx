export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light text-center">
      <div className="container">
        <h1 className="fw-bold" style={{ fontSize: '8rem', color: 'var(--border-color)' }}>404</h1>
        <h2 className="fw-semibold mt-4" style={{ color: 'var(--text-main)' }}>Page Not Found</h2>
        <p className="text-muted mt-2 mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <button className="btn btn-primary px-4 py-2" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}