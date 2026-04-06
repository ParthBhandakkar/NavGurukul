'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    setLoading(true);
    localStorage.setItem('partnerhub_user', JSON.stringify({
      id: '1', full_name: 'Abhishek Gupta', role: 'admin', email: 'abhishek@navgurukul.org'
    }));
    setTimeout(() => router.push('/dashboard'), 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDemoLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">PH</div>
          <h1>PartnerHub</h1>
          <p>Partnership management for NavGurukul</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@navgurukul.org"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>

          <div className="login-divider">or</div>

          <button type="button" className="btn btn-secondary" onClick={handleDemoLogin}
            style={{ width: '100%', justifyContent: 'center' }}>
            Enter Demo Mode →
          </button>

          <div className="demo-notice">
            Demo mode uses sample NavGurukul partnership data. No account needed.
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)}
            style={{ color: 'var(--text-primary)', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit',
              fontWeight: 600, textDecoration: 'underline' }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
