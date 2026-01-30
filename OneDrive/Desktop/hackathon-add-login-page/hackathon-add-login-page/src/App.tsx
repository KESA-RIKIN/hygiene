import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import ModeSelection from './components/ModeSelection';
import LoginPage from './components/LoginPage';
import PersonalDashboard from './components/PersonalDashboard';
import StartupDashboard from './components/StartupDashboard';
import AIChatPanel from './components/AIChatPanel';
import FloatingChatbot from './components/FloatingChatbot';
import TimeMachine from './components/TimeMachine';
import DecisionSimulator from './components/DecisionSimulator';
import FinancialDNA from './components/FinancialDNA';
import JudgeOverlay from './components/JudgeOverlay';

type Mode = 'unified' | 'personal' | 'startup';
type Theme = 'dark' | 'light';

type Snapshot = {
  balance: number;
  income: number;
  expense: number;
  startupCash: number;
  runwayDays?: number;
  activeAlerts?: number;
};

const SNAPSHOT_PRESETS: Record<Mode, { balance: number; income: number; expense: number; startupCash: number }> = {
  unified: { balance: 12450, income: 3200, expense: 3300, startupCash: 68200 },
  personal: { balance: 12450, income: 3200, expense: 5300, startupCash: 0 },
  startup: { balance: 68200, income: 15500, expense: 0, startupCash: 68200 },
};

function App() {
  const [mode, setMode] = useState<Mode>('unified');
  const [theme, setTheme] = useState<Theme>('dark');

  // live snapshot state
  const [snapshotData, setSnapshotData] = useState<Snapshot | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const apiBase = (import.meta.env.VITE_API_BASE as string) ?? '/v1';


  useEffect(() => {
    const stored = window.localStorage.getItem('financeos-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // show mode selection AFTER login
    // keep a flag to auto-redirect if user previously chose default mode
    const saved = window.localStorage.getItem('financeos-default-mode');
    if (saved && loggedInUser) {
      // if user already picked a default earlier, go there automatically
      setMode(saved === 'startup' ? 'startup' : 'unified');
      setRoute(saved === 'startup' ? 'dashboard_startup' : 'dashboard_personal');
    }
  }, []);

  const [route, setRoute] = useState<'dashboard' | 'budgets' | 'investments' | 'startup' | 'dashboard_personal' | 'dashboard_startup' | 'goals' | 'compliance' | 'settings'>('dashboard');
  const [budgets, setBudgets] = useState<Array<any> | null>(null);
  const [investments, setInvestments] = useState<Array<any> | null>(null);
  const [startupInfo, setStartupInfo] = useState<any | null>(null);
  const [goals, setGoals] = useState<any | null>(null);
  const [compliance, setCompliance] = useState<any | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const [healthScore, setHealthScore] = useState<{ score: number; status: string } | null>(null);

  // --- Intelligence System State ---
  const [timeState, setTimeState] = useState<'past' | 'present' | 'future'>('present');
  const [activeDecisions, setActiveDecisions] = useState<{ [key: string]: boolean }>({
    hireEmployees: false,
    increaseMarketing: false,
    delayTax: false,
  });
  const [crisisActive, setCrisisActive] = useState(false);
  const [dnaArchetype, setDnaArchetype] = useState<string | null>(null);
  const [showJudgeMode, setShowJudgeMode] = useState(false);

  // Dynamic Metrics Calculation
  const calculateDynamicMetrics = () => {
    const runwayObj = startupInfo?.runway || { monthlyBurn: 85000, runwayDays: 150 };
    let baseBurn = runwayObj.monthlyBurn;
    let baseRunway = runwayObj.runwayDays;
    let baseHealth = healthScore?.score || 82;

    // Apply Decisions
    if (activeDecisions.hireEmployees) {
      baseBurn += 15000;
      baseRunway -= 25;
      baseHealth += 5; // Growth positive
    }
    if (activeDecisions.increaseMarketing) {
      baseBurn += 10000;
      baseRunway -= 15;
      baseHealth += 2;
    }
    if (activeDecisions.delayTax) {
      baseHealth -= 15; // Compliance risk
    }

    // Apply Time Machine
    if (timeState === 'future') {
      baseRunway -= 90;
      baseHealth -= 10;
    } else if (timeState === 'past') {
      baseRunway += 30;
      baseHealth += 5;
    }

    return {
      runway: Math.max(0, baseRunway),
      burn: baseBurn,
      health: Math.min(100, Math.max(0, baseHealth))
    };
  };

  const dynamicMetrics = calculateDynamicMetrics();

  // Crisis Detection
  useEffect(() => {
    if (dynamicMetrics.runway < 45 || dynamicMetrics.health < 60) {
      if (!crisisActive) setCrisisActive(true);
    } else {
      if (crisisActive) setCrisisActive(false);
    }
  }, [dynamicMetrics, crisisActive]);

  // Keyboard shortcut for Judge Mode (Ctrl + Shift + J)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        setShowJudgeMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // login & role modal
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('financeos-theme', theme);
  }, [theme]);

  // Fetch live snapshot from backend
  useEffect(() => {
    let mounted = true;
    async function loadSnapshot() {
      setLoadingSnapshot(true);
      try {
        const res = await fetch(`${apiBase}/dashboard/snapshot`);
        if (!res.ok) throw new Error(`Snapshot request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setSnapshotData(json as Snapshot);
      } catch (err) {
        console.error('Failed to load snapshot', err);
      } finally {
        if (mounted) setLoadingSnapshot(false);
      }
    }
    loadSnapshot();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  // Fetch budgets when route is budgets
  useEffect(() => {
    let mounted = true;
    async function loadBudgets() {
      if (route !== 'budgets') return;
      try {
        const res = await fetch(`${apiBase}/budgets`);
        if (!res.ok) throw new Error(`Budgets request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setBudgets(json);
      } catch (err) {
        console.error('Failed to load budgets', err);
      }
    }
    loadBudgets();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);

  // Fetch investments when route is investments
  useEffect(() => {
    let mounted = true;
    async function loadInvestments() {
      if (route !== 'investments') return;
      try {
        const res = await fetch(`${apiBase}/investments`);
        if (!res.ok) throw new Error(`Investments request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setInvestments(json);
      } catch (err) {
        console.error('Failed to load investments', err);
      }
    }
    loadInvestments();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);

  // Fetch startup info (runway + forecast) when route is startup
  useEffect(() => {
    let mounted = true;
    async function loadStartup() {
      if (route !== 'startup') return;
      try {
        const [runwayRes, forecastRes] = await Promise.all([
          fetch(`${apiBase}/runway`),
          fetch(`${apiBase}/cashflow/forecast`),
        ]);
        const runway = await runwayRes.json();
        const forecast = await forecastRes.json();
        if (mounted) setStartupInfo({ runway, forecast });
      } catch (err) {
        console.error('Failed to load startup info', err);
      }
    }
    loadStartup();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);

  // Fetch goals when route is goals
  useEffect(() => {
    let mounted = true;
    async function loadGoals() {
      if (route !== 'goals') return;
      try {
        const res = await fetch(`${apiBase}/goals`);
        if (!res.ok) throw new Error(`Goals request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setGoals(json);
      } catch (err) {
        console.error('Failed to load goals', err);
      }
    }
    loadGoals();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);

  // Fetch compliance when route is compliance
  useEffect(() => {
    let mounted = true;
    async function loadCompliance() {
      if (route !== 'compliance') return;
      try {
        const res = await fetch(`${apiBase}/compliance`);
        if (!res.ok) throw new Error(`Compliance request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setCompliance(json);
      } catch (err) {
        console.error('Failed to load compliance', err);
      }
    }
    loadCompliance();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);

  // Fetch settings when route is settings
  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      if (route !== 'settings') return;
      try {
        const res = await fetch(`${apiBase}/settings`);
        if (!res.ok) throw new Error(`Settings request failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setSettings(json);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, [apiBase, route]);


  // prefer live snapshot when available, otherwise fall back to presets per mode
  const mergedSnapshot: Snapshot = { ...SNAPSHOT_PRESETS[mode], ...(snapshotData ?? {}) };
  const snapshot = mergedSnapshot;

  // Sync route with mode for dashboard views
  useEffect(() => {
    if (route === 'dashboard' || route === 'dashboard_personal' || route === 'dashboard_startup') {
      if (mode === 'startup') setRoute('dashboard_startup');
      else if (mode === 'personal') setRoute('dashboard_personal');
      else setRoute('dashboard');
    }
  }, [mode]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  async function handleModeChoose(role: 'personal' | 'startup') {
    setMode(role === 'startup' ? 'startup' : 'personal');
    setShowModeSelection(false);
    window.localStorage.setItem('financeos-default-mode', role);

    // Persist the chosen mode to the backend for this user
    try {
      await fetch(`${apiBase}/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultMode: role }),
      });
    } catch (err) {
      console.error('Failed to save default mode to backend', err);
    }

    // navigate to the selected dashboard
    setRoute(role === 'startup' ? 'dashboard_startup' : 'dashboard_personal');
  }

  async function handleLogin(username: string) {
    setLoggedInUser(username);
    setShowLogin(false);
    setShowModeSelection(true);

    // Potentially load defaults in the background, but wait for user to confirm mode
    try {
      const res = await fetch(`${apiBase}/users/profile`);
      if (res.ok) {
        const json = await res.json();
        if (json?.defaultMode) {
          setMode(json.defaultMode);
        }
      }
    } catch (err) {
      console.error('Failed to read profile on login', err);
    }
  }

  // Fetch Health & Transactions
  useEffect(() => {
    async function loadPremiumData() {
      try {
        const [hRes, tRes] = await Promise.all([
          fetch(`${apiBase}/health-metrics`),
          fetch(`${apiBase}/transactions`)
        ]);
        setHealthScore(await hRes.json());
        setTransactions(await tRes.json());
      } catch (e) {
        console.error('Premium data load failed', e);
      }
    }
    loadPremiumData();
  }, [apiBase]);

  if (showLogin) return <LoginPage onLogin={handleLogin} />;
  if (showModeSelection) return <ModeSelection onChoose={handleModeChoose} />;

  return (
    <div className={`finance-root ${crisisActive ? 'crisis-active' : ''} ${timeState}-mode`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-pill">
            <span className="brand-dot" />
            <div>
              <div className="brand-text-main">FinanceOS</div>
              <div className="brand-text-sub">Unified Finance</div>
            </div>
          </div>
        </div>

        <div>
          <div className="sidebar-section-label">main</div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${route === 'dashboard' ? 'nav-active' : ''}`} onClick={() => setRoute('dashboard')}>
              <span>
                <span className="nav-item-dot" />
                <span>Dashboard</span>
              </span>
              <span>⌘1</span>
            </button>
            <button className={`nav-item ${route === 'budgets' ? 'nav-active' : ''}`} onClick={() => setRoute('budgets')}>
              <span>
                <span className="nav-item-dot" />
                <span>Budgets</span>
              </span>
              <span>⌘2</span>
            </button>
            <button className={`nav-item ${route === 'investments' ? 'nav-active' : ''}`} onClick={() => setRoute('investments')}>
              <span>
                <span className="nav-item-dot" />
                <span>Investments</span>
              </span>
              <span>⌘3</span>
            </button>
            <button className={`nav-item ${route === 'startup' ? 'nav-active' : ''}`} onClick={() => setRoute('startup')}>
              <span>
                <span className="nav-item-dot" />
                <span>Startup Finance</span>
              </span>
              <span>⌘4</span>
            </button>
          </nav>
        </div>

        <div>
          <div className="sidebar-section-label">system</div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${route === 'goals' ? 'nav-active' : ''}`} onClick={() => setRoute('goals')}>
              <span>
                <span className="nav-item-dot" />
                <span>Goals</span>
              </span>
            </button>
            <button className={`nav-item ${route === 'compliance' ? 'nav-active' : ''}`} onClick={() => setRoute('compliance')}>
              <span>
                <span className="nav-item-dot" />
                <span>Compliance</span>
              </span>
            </button>
            <button className={`nav-item ${route === 'settings' ? 'nav-active' : ''}`} onClick={() => setRoute('settings')}>
              <span>
                <span className="nav-item-dot" />
                <span>Settings</span>
              </span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div onClick={() => setShowAIChat(true)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="ai-avatar-pulse" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>AI Guardian active</span>
            </div>
            <div className="sidebar-footer-cta">
              <div style={{ fontSize: '0.78rem', marginBottom: 4 }}>Ask for advice</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 500 }}>Optimize your runway</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div>
            <div className="mode-switcher">
              <button
                className={`mode-pill ${mode === 'unified' ? 'mode-active' : ''}`}
                onClick={() => setMode('unified')}
              >
                Unified
              </button>
              <button
                className={`mode-pill ${mode === 'personal' ? 'mode-active' : ''}`}
                onClick={() => setMode('personal')}
              >
                Personal
              </button>
              <button
                className={`mode-pill ${mode === 'startup' ? 'mode-active' : ''}`}
                onClick={() => setMode('startup')}
              >
                Startup
              </button>
            </div>
          </div>

          <div className="topbar-right">
            {healthScore && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
                <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--glass-border)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--brand-blue)" strokeWidth="3" strokeDasharray={`${dynamicMetrics.health}, 100`} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.7rem', fontWeight: 700 }}>{dynamicMetrics.health}</div>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: crisisActive ? 'var(--danger)' : 'var(--text-main)' }}>
                  {crisisActive ? 'CRITICAL RISK' : `Health: ${healthScore.status}`}
                </div>
              </div>
            )}
            <div className="chip-neutral">Global Sync Active</div>
            <button
              className={`theme-toggle ${theme === 'dark' ? 'theme-toggle-dark' : ''}`}
              onClick={toggleTheme}
            >
              <span className="theme-toggle-knob" />
              <span>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
            </button>
            <div className="user-badge">
              <div className="user-avatar" />
              <div>
                <div className="user-text-main">You</div>
                <div className="user-text-sub">FinanceOS Core</div>
              </div>
            </div>
          </div>
        </header>

        <div className="headline-row">
          <div>
            <div className="headline-title">
              {route === 'budgets' ? 'Budgets' :
                route === 'investments' ? 'Investments' :
                  route === 'goals' ? 'Goals' :
                    route === 'compliance' ? 'Compliance' :
                      route === 'settings' ? 'Settings' :
                        mode === 'startup' ? 'Startup Finance' :
                          mode === 'personal' ? 'Personal Dashboard' :
                            'Unified Dashboard'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: 4 }}>
              {route.includes('dashboard') ? 'Live snapshot · All accounts synced · Threat detection active' : ''}
            </div>
          </div>
          <div className="headline-status-pill">
            <span className="headline-status-dot" />
            <span>Real-time monitoring</span>
          </div>
        </div>

        {showAIChat && (
          <AIChatPanel
            onClose={() => setShowAIChat(false)}
            apiBase={apiBase}
            context={{
              timeState,
              decisions: activeDecisions,
              metrics: dynamicMetrics,
              crisisActive
            }}
          />
        )}
        {showJudgeMode && <JudgeOverlay onClose={() => setShowJudgeMode(false)} />}
        <FloatingChatbot apiBase={apiBase} />

        {crisisActive && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--danger)', zIndex: 1000, boxShadow: '0 0 10px var(--danger)' }} />
        )}

        <section className="grid-main">
          {route === 'dashboard' && (
            <>
              <div>
                <TimeMachine timeState={timeState} setTimeState={setTimeState} />
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Financial Snapshot</div>
                    <div className="card-tag">{loadingSnapshot ? 'Loading…' : 'Live · Last 24h'}</div>
                  </div>
                  <div className="snapshot-grid">
                    <div className="snapshot-tile">
                      <div className="snapshot-label">Balance</div>
                      <div className="snapshot-amount">₹{(snapshot.balance * (timeState === 'future' ? 1.15 : timeState === 'past' ? 0.85 : 1)).toLocaleString('en-IN')}</div>
                      <div className="snapshot-subtext">{timeState === 'present' ? 'Includes savings, current and UPI wallets.' : `Projected balance for ${timeState} window.`}</div>
                      <div className="snapshot-trend">{timeState === 'future' ? 'Trend: Projected' : '+3.2% vs last month'}</div>
                    </div>
                    <div className="snapshot-tile">
                      <div className="snapshot-label">Income</div>
                      <div className="snapshot-amount">₹{snapshot.income.toLocaleString('en-IN')}</div>
                      <div className="snapshot-subtext">Committed inflows this month.</div>
                      <div className="snapshot-trend">On track</div>
                    </div>
                    <div className="snapshot-tile">
                      <div className="snapshot-label">Expense</div>
                      <div className="snapshot-amount">₹{dynamicMetrics.burn.toLocaleString('en-IN')}</div>
                      <div className="snapshot-subtext">Current monthly burn rate.</div>
                      <div className="snapshot-trend" style={{ color: dynamicMetrics.burn > 100000 ? 'var(--danger)' : 'var(--success)' }}>
                        {dynamicMetrics.burn > 100000 ? '🚨 HIGH BURN' : 'Burn stable'}
                      </div>
                    </div>
                    <div className="snapshot-tile">
                      <div className="snapshot-label">Startup Cash</div>
                      <div className="snapshot-amount">₹{snapshot.startupCash.toLocaleString('en-IN')}</div>
                      <div className="snapshot-subtext">Operating runway: {dynamicMetrics.runway} days.</div>
                      <div className="snapshot-trend" style={{ color: crisisActive ? 'var(--danger)' : 'var(--accent)' }}>
                        {crisisActive ? 'CRITICAL RISK' : 'Safe zone'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: 16, marginTop: 14 }}>
                  <div className="card card-subtle">
                    <div className="card-header">
                      <div className="card-title">Budget vs Spending</div>
                      <div className="card-tag">3 active alerts</div>
                    </div>
                    <div className="budget-list">
                      <div className="budget-row">
                        <div className="budget-main">
                          <div className="budget-label">Food & Dining</div>
                          <div className="budget-meta">₹9,025 / ₹12,000</div>
                          <div className="budget-bar-outer">
                            <div className="budget-bar-inner" style={{ width: '75%' }} />
                          </div>
                        </div>
                        <div className="budget-chip">75% used</div>
                      </div>
                      <div className="budget-row">
                        <div className="budget-main">
                          <div className="budget-label">Rent & EMI</div>
                          <div className="budget-meta">₹35,000 / ₹40,000</div>
                          <div className="budget-bar-outer">
                            <div className="budget-bar-inner" style={{ width: '88%' }} />
                          </div>
                        </div>
                        <div className="budget-chip" style={{ color: 'var(--warn)' }}>88% used</div>
                      </div>
                      <div className="budget-row">
                        <div className="budget-main">
                          <div className="budget-label">Startup Burn</div>
                          <div className="budget-meta">₹85,000 / ₹1,50,000</div>
                          <div className="budget-bar-outer">
                            <div className="budget-bar-inner" style={{ width: '56%' }} />
                          </div>
                        </div>
                        <div className="budget-chip">56% used</div>
                      </div>
                    </div>
                  </div>

                  <div className="card card-subtle">
                    <div className="card-header">
                      <div className="card-title">{mode === 'startup' ? 'Startup Income vs Expense' : 'Market Trends'}</div>
                      <div className="card-tag">Simulated · Visual only</div>
                    </div>
                    <div className="chart-placeholder">
                      <div className="chart-line" />
                      <div className="chart-path" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Activity & Intel</div>
                    <div className="card-tag">Live Feed</div>
                  </div>
                  <div style={{ padding: '0 12px 12px' }}>
                    {transactions ? transactions.map(tx => (
                      <div key={tx.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{tx.merchant}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{tx.category} • {tx.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: tx.amount < 0 ? 'var(--text-main)' : 'var(--success)' }}>
                            {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                          </div>
                          {tx.status === 'flagged' && <div style={{ fontSize: '0.65rem', color: 'var(--danger)', fontWeight: 700 }}>VERIFY REASON</div>}
                        </div>
                      </div>
                    )) : <div style={{ padding: 12, color: 'var(--text-soft)' }}>Scanning transactions...</div>}
                  </div>
                </div>

                <DecisionSimulator decisions={activeDecisions as any} setDecisions={setActiveDecisions as any} />
                <FinancialDNA activeDecisions={activeDecisions} onClassify={setDnaArchetype} />

                <div className="card card-subtle">
                  <div className="card-header">
                    <div className="card-title">What FinanceOS is watching</div>
                    <div className="card-tag">Explainable AI (DNA: {dnaArchetype})</div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: 8 }}>• Budget breach probability in next 30 days based on your last 90 days of behaviour.</li>
                    <li style={{ marginBottom: 8 }}>• EMI contribution balance between partners and likelihood of future conflict.</li>
                    <li>• Liquidity risk if you commit to new high-ticket decisions this month (car, rent, team hires).</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {route === 'dashboard_personal' && (
            <PersonalDashboard />
          )}

          {route === 'dashboard_startup' && (
            <StartupDashboard />
          )}

          {route === 'budgets' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Budgets</div>
                    <div className="card-tag">{budgets === null ? 'Loading…' : `${budgets.length} budgets`}</div>
                  </div>
                  <div className="budget-list">
                    {budgets && budgets.length > 0 ? (
                      budgets.map((b) => {
                        const pct = Math.round((b.spent / b.allocated) * 100);
                        return (
                          <div className="budget-row" key={b.id}>
                            <div className="budget-main">
                              <div className="budget-label">{b.name}</div>
                              <div className="budget-meta">₹{b.spent.toLocaleString('en-IN')} / ₹{b.allocated.toLocaleString('en-IN')}</div>
                              <div className="budget-bar-outer">
                                <div className="budget-bar-inner" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <div className="budget-chip">{pct}% used</div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: 16, color: 'var(--text-soft)' }}>No budgets found.</div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Create Budget (example)</div>
                    </div>
                    <div style={{ padding: 12 }}>
                      <em>Use POST /v1/budgets to create a budget (backend supports mock create).</em>
                    </div>
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Budget Alerts</div>
                    <div className="card-tag">AI · Explainable</div>
                  </div>
                  <div style={{ padding: 12 }}>Watchlist: Food & Dining, Rent & EMI</div>
                </div>
              </div>
            </>
          )}

          {route === 'investments' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Investments</div>
                    <div className="card-tag">{investments === null ? 'Loading…' : `${investments.length} items`}</div>
                  </div>
                  <div style={{ padding: 12 }}>
                    {investments && investments.length > 0 ? (
                      investments.map((it) => (
                        <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{it.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Value: ₹{it.value.toLocaleString('en-IN')}</div>
                          </div>
                          <div style={{ color: it.changePercent >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{it.changePercent}%</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--text-soft)', padding: 12 }}>No investments found.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Portfolio Summary</div>
                  </div>
                  <div style={{ padding: 12 }}>Total invested: ₹{(investments || []).reduce((s, it) => s + (it?.value || 0), 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </>
          )}

          {route === 'startup' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Startup Overview</div>
                    <div className="card-tag">{startupInfo ? 'Live' : 'Loading…'}</div>
                  </div>
                  <div style={{ padding: 12 }}>
                    {startupInfo ? (
                      <div>
                        <div style={{ marginBottom: 8 }}>Runway: <strong>{startupInfo.runway.runwayDays} days</strong></div>
                        <div style={{ marginBottom: 8 }}>Next 90-day forecast: {startupInfo.forecast.horizonDays} days</div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-soft)' }}>Loading startup data…</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Runway Guard</div>
                  </div>
                  <div style={{ padding: 12 }}>Keep runway above 90 days · Current: {snapshotData?.runwayDays ?? 'N/A'}</div>
                </div>
              </div>
            </>
          )}

          {route === 'goals' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Financial Goals</div>
                    <div className="card-tag">{goals === null ? 'Loading…' : `${goals?.goals?.length || 0} goals`}</div>
                  </div>
                  <div style={{ padding: 12 }}>
                    {goals && goals.goals && goals.goals.length > 0 ? (
                      goals.goals.map((goal: any) => {
                        const progress = Math.round((goal.current / goal.target) * 100);
                        return (
                          <div key={goal.id} style={{ marginBottom: 16, padding: 12, background: 'var(--card-bg)', borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div style={{ fontWeight: 600 }}>{goal.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Due: {goal.deadline}</div>
                            </div>
                            <div style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 8 }}>
                              ₹{goal.current.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
                            </div>
                            <div className="budget-bar-outer">
                              <div className="budget-bar-inner" style={{ width: `${progress}%` }} />
                            </div>
                            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-soft)' }}>{progress}% complete</div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: 'var(--text-soft)', padding: 12 }}>No goals found.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Goal Insights</div>
                  </div>
                  <div style={{ padding: 12, fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                    Track your financial goals and milestones. Set targets and monitor progress toward achieving them.
                  </div>
                </div>
              </div>
            </>
          )}

          {route === 'compliance' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Compliance & Regulations</div>
                    <div className="card-tag">{compliance ? compliance.status : 'Loading…'}</div>
                  </div>
                  <div style={{ padding: 12 }}>
                    {compliance && compliance.items && compliance.items.length > 0 ? (
                      compliance.items.map((item: any) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, marginBottom: 8, background: 'var(--card-bg)', borderRadius: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.type}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Due: {item.dueDate}</div>
                          </div>
                          <div>
                            <span className={`chip-neutral`} style={{
                              color: item.status === 'completed' ? 'var(--success)' :
                                item.status === 'pending' ? 'var(--warn)' : 'var(--info)'
                            }}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--text-soft)', padding: 12 }}>No compliance items found.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Compliance Status</div>
                  </div>
                  <div style={{ padding: 12, fontSize: '0.85rem' }}>
                    Overall Status: <strong style={{ color: 'var(--success)' }}>{compliance?.status || 'N/A'}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {route === 'settings' && (
            <>
              <div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Settings</div>
                    <div className="card-tag">{settings === null ? 'Loading…' : 'Preferences'}</div>
                  </div>
                  <div style={{ padding: 16 }}>
                    {settings ? (
                      <div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Theme</div>
                          <div style={{ color: 'var(--text-soft)' }}>{settings.theme}</div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Notifications</div>
                          <div style={{ color: 'var(--text-soft)' }}>{settings.notifications ? 'Enabled' : 'Disabled'}</div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Currency</div>
                          <div style={{ color: 'var(--text-soft)' }}>{settings.currency}</div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Language</div>
                          <div style={{ color: 'var(--text-soft)' }}>{settings.language}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-soft)' }}>Loading settings…</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Preferences</div>
                  </div>
                  <div style={{ padding: 12, fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                    Manage your account settings and preferences here.
                  </div>
                </div>
              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}

export default App;
