

type Props = {
    onClose: () => void;
};

export default function JudgeOverlay({ onClose }: Props) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 22, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 20000,
            padding: '40px',
            overflowY: 'auto',
            color: '#00ffcc',
            fontFamily: '"Fira Code", monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>SYSTEM ARCHITECTURE :: JUDGE_EXPLORATION_MODE</h1>
                <button onClick={onClose} style={{ background: 'none', border: '1px solid #00ffcc', color: '#00ffcc', cursor: 'pointer', padding: '5px 15px' }}>CLOSE_SESSION</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px' }}>01. DATA FLOW HIERARCHY</h3>
                    <pre style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                        {`[UI_LAYER] -> React Hooks (useContext/State)
    |
    |--- [TEMPORAL_ENGINE] -> State Warping Matrix
    |--- [SIMULATION_SANDBOX] -> Reactive Delta Calculators
    |
[LOGIC_LAYER] -> Context-Aware AI Guardian (Express)
    |
[API_LAYER] -> RESTful Mock Endpoints (Self-Healing)
    |
[DATABASE] -> Memory-Stored Mock Persistence`}
                    </pre>
                </div>

                <div>
                    <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px' }}>02. SECURITY PHILOSOPHY</h3>
                    <ul>
                        <li><strong>Zero-Trust Architecture:</strong> Every state transition is validated against a schema.</li>
                        <li><strong>Global Sync:</strong> Mock-WebSockets simulate real-time consistency.</li>
                        <li><strong>Privacy First:</strong> Metadata-only processing for AI Insights.</li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px' }}>03. COMPONENT TOPOLOGY</h3>
                    <p>The application is designed as a <strong>Micro-SPA</strong>. Each module (Runway, Budgets, AI) is self-contained with its own data-fetching logic but obeys the global <strong>Temporal Slider</strong>.</p>
                </div>

                <div>
                    <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px' }}>04. FINTECH DESIGN PRINCIPLES</h3>
                    <p>We use <strong>Glassmorphism</strong> not just for aesthetics, but to signify "Transparency" in financial data. The <strong>Crisis Mode</strong> color shift mimics high-availability production monitoring systems (SRE dashboards).</p>
                </div>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                Finance OS v2.1.0-intelligence-stable // Build: 2026-01-31 // Engineer: Antigravity
            </div>
        </div>
    );
}
