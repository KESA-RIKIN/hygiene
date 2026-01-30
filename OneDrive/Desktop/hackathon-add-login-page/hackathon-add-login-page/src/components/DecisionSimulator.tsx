import React from 'react';

type Decisions = {
    hireEmployees: boolean;
    increaseMarketing: boolean;
    delayTax: boolean;
};

type Props = {
    decisions: Decisions;
    setDecisions: React.Dispatch<React.SetStateAction<Decisions>>;
};

export default function DecisionSimulator({ decisions, setDecisions }: Props) {
    const toggle = (key: keyof Decisions) => {
        setDecisions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const decisionList = [
        { id: 'hireEmployees', label: 'Hire 3 Senior Engineers', impact: '+₹15k Burn, -25d Runway', icon: '👥' },
        { id: 'increaseMarketing', label: 'Aggressive Ad Campaign', impact: '+₹10k Burn, -15d Runway', icon: '📣' },
        { id: 'delayTax', label: 'Delay Compliance Filing', impact: '⚠️ Health Risk, +₹5k Interest', icon: '🏛️' },
    ];

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">What-If Decision Simulator</div>
                <div className="card-tag">Sandbox</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {decisionList.map((d) => (
                    <div key={d.id}
                        onClick={() => toggle(d.id as keyof Decisions)}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: decisions[d.id as keyof Decisions] ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-bg)',
                            border: `1px solid ${decisions[d.id as keyof Decisions] ? 'var(--brand-blue)' : 'var(--glass-border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <div style={{ fontSize: '1.2rem' }}>{d.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: decisions[d.id as keyof Decisions] ? 'var(--brand-blue)' : 'var(--text-main)' }}>
                                {d.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{d.impact}</div>
                        </div>
                        <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: '2px solid var(--glass-border)',
                            background: decisions[d.id as keyof Decisions] ? 'var(--brand-blue)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '10px'
                        }}>
                            {decisions[d.id as keyof Decisions] && '✓'}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '16px', padding: '10px', background: 'var(--glass-bg)', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--text-soft)', fontStyle: 'italic' }}>
                💡 Select decisions to see real-time impact on your runway and health score above.
            </div>
        </div>
    );
}
