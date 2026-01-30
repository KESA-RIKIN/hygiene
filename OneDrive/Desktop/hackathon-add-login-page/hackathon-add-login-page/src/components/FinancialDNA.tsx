import React from 'react';

type Archetype = {
    name: string;
    strengths: string;
    weaknesses: string;
    habit: string;
    icon: string;
    color: string;
};

const archetypes: { [key: string]: Archetype } = {
    'Risk-Avoider': {
        name: 'The Guardian',
        strengths: 'Capital preservation, high discipline',
        weaknesses: 'Slow growth, excessive caution',
        habit: 'Allocate 5% to high-yield growth assets',
        icon: '🛡️',
        color: 'var(--success)'
    },
    'Growth-Aggressive': {
        name: 'The Maverick',
        strengths: 'Fast scaling, opportunity capture',
        weaknesses: 'High burn, volatility risk',
        habit: 'Build a 3-month secondary cash reserve',
        icon: '🚀',
        color: 'var(--brand-blue)'
    },
    'Balanced Strategist': {
        name: 'The Architect',
        strengths: 'Stable growth, risk management',
        weaknesses: 'Occasional analysis paralysis',
        habit: 'Automate weekly portfolio rebalancing',
        icon: '🏛️',
        color: 'var(--accent)'
    },
    'Goal-Driven Saver': {
        name: 'The Monk',
        strengths: 'Target efficiency, minimal waste',
        weaknesses: 'Missed opportunities during scale',
        habit: 'Diversify into passive income streams',
        icon: '🧘',
        color: 'var(--warn)'
    }
};

type Props = {
    activeDecisions: { [key: string]: boolean };
    onClassify: (name: string) => void;
};

export default function FinancialDNA({ activeDecisions, onClassify }: Props) {
    // Simple heuristic for demo
    let archetypeKey = 'Balanced Strategist';
    if (activeDecisions.hireEmployees && activeDecisions.increaseMarketing) archetypeKey = 'Growth-Aggressive';
    if (Object.values(activeDecisions).every(v => !v)) archetypeKey = 'Risk-Avoider';

    const dna = archetypes[archetypeKey];

    React.useEffect(() => {
        onClassify(archetypeKey);
    }, [archetypeKey]);

    return (
        <div className="card" style={{ background: `linear-gradient(135deg, ${dna.color}11, transparent)` }}>
            <div className="card-header">
                <div className="card-title">Financial DNA Profile</div>
                <div className="card-tag">Archetype Analysis</div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>{dna.icon}</div>
                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: dna.color }}>{dna.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: '4px' }}>Behavioral Class: {archetypeKey}</div>
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>STRENGTHS</div>
                    <div style={{ fontSize: '0.75rem' }}>{dna.strengths}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '4px' }}>WEAKNESSES</div>
                    <div style={{ fontSize: '0.75rem' }}>{dna.weaknesses}</div>
                </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-blue)', marginBottom: '4px' }}>RECOMMENDED HABIT</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{dna.habit}</div>
            </div>
        </div>
    );
}
