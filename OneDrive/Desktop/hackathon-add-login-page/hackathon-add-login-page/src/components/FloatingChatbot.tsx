import React, { useState, useEffect, useRef } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
};

type Props = {
    apiBase: string;
};

export default function FloatingChatbot({ apiBase }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m the FinanceOS Global Assistant. I know everything about this project. How can I help you?', timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

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
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            setMessages(prev => [...prev, data]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting to the brain.', timestamp: new Date().toISOString() }]);
        } finally {
            setIsTyping(false);
        }
    }

    return (
        <div className="floating-chatbot-container">
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window card">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="ai-avatar-pulse" style={{ width: '10px', height: '10px' }} />
                            <div style={{ fontWeight: 600 }}>FinanceOS Assistant</div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">×</button>
                    </div>

                    <div ref={scrollRef} className="chatbot-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbot-msg ${m.role}`}>
                                {m.content}
                            </div>
                        ))}
                        {isTyping && <div className="chatbot-typing">Assistant is thinking...</div>}
                    </div>

                    <form onSubmit={sendMessage} className="chatbot-input-form">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            autoFocus
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
