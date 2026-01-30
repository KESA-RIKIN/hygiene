

type Props = {
    timeState: 'past' | 'present' | 'future';
    setTimeState: (s: 'past' | 'present' | 'future') => void;
};

export default function TimeMachine({ timeState, setTimeState }: Props) {
    const states: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];

    return (
        <div className="card" style={{ padding: '12px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-soft)', minWidth: '100px' }}>
                Temporal Engine
            </div>
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--glass-border)', transform: 'translateY(-50%)', zIndex: 0 }} />
                {states.map((s) => (
                    <button
                        key={s}
                        onClick={() => setTimeState(s)}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            background: timeState === s ? 'var(--brand-gradient)' : 'var(--bg-elevated)',
                            border: timeState === s ? 'none' : '1px solid var(--glass-border)',
                            color: timeState === s ? 'white' : 'var(--text-soft)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: timeState === s ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                            textTransform: 'capitalize'
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--brand-blue)', fontWeight: 600 }}>
                {timeState === 'present' ? 'LIVE DATA' : 'SIMULATION MODE'}
            </div>
        </div>
    );
}
