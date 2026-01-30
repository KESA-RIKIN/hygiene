import React, { useState, useEffect, useRef } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
};

type Props = {
    onClose: () => void;
    apiBase: string;
    context?: {
        timeState: string;
        decisions: { [key: string]: boolean };
        metrics: { runway: number; burn: number; health: number };
        crisisActive: boolean;
    };
};

export default function AIChatPanel({ onClose, apiBase, context }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        let initialGreeting = 'Hello! I am your AI Guardian. I\'ve analyzed your FinanceOS data. How can I help you today?';

        if (context?.crisisActive) {
            initialGreeting = '⚠️ [URGENT] I detect a critical runway risk. Your health score has dropped. We must prioritize cash preservation immediately.';
        } else if (context?.timeState === 'future') {
            initialGreeting = 'I am currently projecting your 90-day future. Some metrics look volatile based on your active decisions. What shall we simulate?';
        }

        setMessages([{ role: 'assistant', content: initialGreeting, timestamp: new Date().toISOString() }]);
    }, [context?.crisisActive, context?.timeState]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(`${apiBase}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, context })
            });
            const data = await res.json();
            setMessages(prev => [...prev, data]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I lost connection to the core. Please try again.', timestamp: new Date().toISOString() }]);
        } finally {
            setIsTyping(false);
        }
    }

    return (
        <div className="ai-panel-root">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="ai-avatar-pulse" />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>AI Guardian</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Online · Context Aware</div>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        background: m.role === 'user' ? 'var(--brand-blue)' : 'var(--glass-bg)',
                        border: m.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                        color: m.role === 'user' ? 'white' : 'var(--text-main)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        {m.content}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', background: 'var(--glass-bg)', padding: '12px 16px', borderRadius: '14px', fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                        Guardian is thinking...
                    </div>
                )}
            </div>

            <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about runway, budgets..."
                        style={{ flex: 1, background: 'none', border: 'none', padding: '10px', color: 'var(--text-main)', outline: 'none' }}
                    />
                    <button type="submit" style={{ background: 'var(--brand-blue)', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}>
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
