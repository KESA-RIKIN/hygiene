import React, { useState } from 'react';

type Props = {
  onLogin: (identifier: string) => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignup && !fullName) return;
    onLogin(fullName || email);
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-top">
          <div className="auth-logo" aria-hidden>
            <div className="brand-dot" />
          </div>
          <div className="auth-appname">FinanceOS</div>
        </div>

        <h1 className="auth-heading">{isSignup ? 'Create account' : 'Welcome back'}</h1>
        <p className="auth-sub">{isSignup ? 'Start your journey with Unified Finance' : 'Sign in to continue to your dashboard'}</p>

        <form className="auth-form" onSubmit={submit}>
          {isSignup && (
            <>
              <label className="auth-label">Full Name</label>
              <input
                className="auth-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </>
          )}

          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />

          <label className="auth-label">Password</label>
          <div className="auth-password-row">
            <input
              className="auth-input auth-input-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="auth-actions">
            {!isSignup && <a className="auth-forgot" href="#">Forgot password?</a>}
            <button className="auth-primary" type="submit" style={{ marginLeft: isSignup ? 'auto' : '0' }}>
              {isSignup ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-footer">
          <span>{isSignup ? 'Already have an account?' : 'Don’t have an account?'}</span>
          <button
            type="button"
            className="auth-signup"
            onClick={() => setIsSignup(!isSignup)}
            style={{ background: 'none', border: 'none', color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
