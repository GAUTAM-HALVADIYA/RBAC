export default function VerifyOtp() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container d-flex justify-content-center">
        <div className="card glass-panel border-0 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-2 fw-bold" style={{ color: 'var(--text-main)' }}>Verify OTP</h2>
            <p className="text-center text-muted mb-4">Enter the 6-digit code sent to your email.</p>
            <form>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="123456" 
                  className="form-control form-control-lg text-center" 
                  style={{ letterSpacing: '0.5em', fontSize: '1.25rem' }}
                  maxLength={6} 
                />
              </div>

              <button className="btn btn-primary w-100 btn-lg" type="submit">
                Verify Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}