export default function Login() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container d-flex justify-content-center">
        <div className="card glass-panel border-0 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--text-main)' }}>Welcome Back</h2>
            <p className="text-center text-muted mb-4">Please login to your RBAC account</p>
            <form>
              <div className="mb-4">
                <label className="form-label fw-medium text-muted small">Email Address</label>
                <input type="email" className="form-control form-control-lg" placeholder="admin@example.com" />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-muted small">Password</label>
                <input type="password" className="form-control form-control-lg" placeholder="••••••••" />
              </div>

              <button className="btn btn-primary w-100 btn-lg" type="submit">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}