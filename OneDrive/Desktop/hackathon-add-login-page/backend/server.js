import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user profile storage
let userProfile = {
  defaultMode: null
};

// Mock data
const mockSnapshot = {
  balance: 12450,
  income: 3200,
  expense: 3300,
  startupCash: 68200,
  runwayDays: 150,
  activeAlerts: 3
};

const mockBudgets = [
  { id: 1, name: 'Food & Dining', spent: 9025, allocated: 12000 },
  { id: 2, name: 'Rent & EMI', spent: 35000, allocated: 40000 },
  { id: 3, name: 'Startup Burn', spent: 85000, allocated: 150000 },
  { id: 4, name: 'Transportation', spent: 3500, allocated: 5000 },
  { id: 5, name: 'Entertainment', spent: 2200, allocated: 3000 }
];

const mockInvestments = [
  { id: 1, name: 'Stocks Portfolio', value: 125000, changePercent: 8.5 },
  { id: 2, name: 'Mutual Funds', value: 85000, changePercent: 12.3 },
  { id: 3, name: 'Fixed Deposits', value: 200000, changePercent: 6.5 },
  { id: 4, name: 'Crypto', value: 45000, changePercent: -15.2 }
];

const mockRunway = {
  runwayDays: 150,
  monthlyBurn: 85000,
  currentCash: 68200
};

const mockForecast = {
  horizonDays: 90,
  projectedCash: 45000,
  recommendation: 'Maintain current burn rate'
};

// API Routes

// Dashboard snapshot
app.get('/v1/dashboard/snapshot', (req, res) => {
  res.json(mockSnapshot);
});

// Budgets
app.get('/v1/budgets', (req, res) => {
  res.json(mockBudgets);
});

app.post('/v1/budgets', (req, res) => {
  const newBudget = {
    id: mockBudgets.length + 1,
    name: req.body.name || 'New Budget',
    spent: req.body.spent || 0,
    allocated: req.body.allocated || 0
  };
  mockBudgets.push(newBudget);
  res.status(201).json(newBudget);
});

// Investments
app.get('/v1/investments', (req, res) => {
  res.json(mockInvestments);
});

// Startup runway
app.get('/v1/runway', (req, res) => {
  res.json(mockRunway);
});

// Cashflow forecast
app.get('/v1/cashflow/forecast', (req, res) => {
  res.json(mockForecast);
});

// User profile
app.get('/v1/users/profile', (req, res) => {
  res.json(userProfile);
});

app.post('/v1/users/profile', (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json(userProfile);
});

// Goals endpoint
app.get('/v1/goals', (req, res) => {
  res.json({
    goals: [
      { id: 1, name: 'Emergency Fund', target: 500000, current: 125000, deadline: '2026-12-31' },
      { id: 2, name: 'Vacation', target: 150000, current: 45000, deadline: '2026-06-30' },
      { id: 3, name: 'New Car', target: 800000, current: 200000, deadline: '2027-03-31' }
    ]
  });
});

// Compliance endpoint
app.get('/v1/compliance', (req, res) => {
  res.json({
    status: 'compliant',
    items: [
      { id: 1, type: 'Tax Filing', status: 'completed', dueDate: '2026-07-31' },
      { id: 2, type: 'GST Return', status: 'pending', dueDate: '2026-02-20' },
      { id: 3, type: 'Annual Report', status: 'in-progress', dueDate: '2026-03-31' }
    ]
  });
});

// Settings endpoint
app.get('/v1/settings', (req, res) => {
  res.json({
    theme: 'dark',
    notifications: true,
    currency: 'INR',
    language: 'en'
  });
});

app.post('/v1/settings', (req, res) => {
  res.json({ success: true, settings: req.body });
});

// Health metrics
app.get('/v1/health-metrics', (req, res) => {
  res.json({
    score: 82,
    status: 'Optimal',
    factors: [
      { label: 'Savings Rate', score: 95, color: 'var(--success)' },
      { label: 'Debt-to-Income', score: 88, color: 'var(--success)' },
      { label: 'Investment Diversification', score: 62, color: 'var(--warn)' }
    ]
  });
});

// Detailed Transactions
app.get('/v1/transactions', (req, res) => {
  res.json([
    { id: 'tx1', merchant: 'AWS Cloud Services', category: 'Startup', amount: -12450, date: 'Today, 2:15 PM', status: 'verified' },
    { id: 'tx2', merchant: 'Salary Credit', category: 'Income', amount: 85000, date: 'Yesterday', status: 'verified' },
    { id: 'tx3', merchant: 'Uber India', category: 'Transport', amount: -450, date: 'Yesterday', status: 'verified' },
    { id: 'tx4', merchant: 'Zomato', category: 'Food', amount: -890, date: '2 days ago', status: 'flagged' },
    { id: 'tx5', merchant: 'Zerodha Mutual Fund', category: 'Investment', amount: -5000, date: '3 days ago', status: 'verified' }
  ]);
});

// AI Chat Logic (Enhanced with Simulation Context)
app.post('/v1/ai/chat', (req, res) => {
  const { message, context } = req.body;
  const msg = message.toLowerCase();

  // Project Knowledge Base
  const projectDetails = {
    name: "FinanceOS",
    purpose: "A unified financial platform designed for both personal and startup scale.",
    features: [
      "Dashboard: Real-time financial snapshot and health monitoring.",
      "Budgets: Tracking and alerting for spending limits.",
      "Investments: Portfolio tracking and performance metrics.",
      "Startup Finance: Runway calculation and cashflow forecasting.",
      "Goals: Long-term financial target tracking.",
      "Compliance: Tax and regulatory oversight.",
      "AI Guardian: Constant financial monitoring and security."
    ],
    tech: "React, TypeScript, Vite, Express, and Node.js.",
    usp: "AI-driven insights, glassmorphism UI, and zero-trust security architecture."
  };

  let response = "I've analyzed your current financial snapshot. How can I help you optimize further?";

  // Handle Crisis Context
  if (context?.crisisActive) {
    if (msg.includes('help') || msg.includes('do')) {
      response = `⚠️ CRITICAL: Your runway is at ${context.metrics.runway} days. Immediate actions required: 1. Halt all non-essential hiring. 2. Cut discretionary marketing spend by 50%. 3. Review SaaS subscriptions for redundant tools.`;
    } else {
      response = `We are in Crisis Mode (Health: ${context.metrics.health}). Focus on survival. Every rupee counts right now. Your burn rate is ₹${context.metrics.burn.toLocaleString()}. Shall we simulate a cost-cutting plan?`;
    }
  }
  // Handle Future Context
  else if (context?.timeState === 'future') {
    response = `I am projecting a ${context.metrics.runway}-day runway 3 months into the future. Based on your decisions like ${Object.keys(context.decisions).filter(k => context.decisions[k]).join(', ') || 'none'}, your health score is trending at ${context.metrics.health}.`;
  }
  // Priority 1: Project Knowledge
  else if (msg.includes('what is this') || msg.includes('about') || msg.includes('project') || msg.includes('features')) {
    response = `This is ${projectDetails.name}, ${projectDetails.purpose} Our core features include: ${projectDetails.features.join(' ')} Interaction is powered by ${projectDetails.tech}`;
  } else if (msg.includes('who are you') || msg.includes('help')) {
    response = "I am the FinanceOS AI Assistant. I can help you understand your financial health, track budgets, calculate startup runway, and navigate the platform's features.";
  } else if (msg.includes('security') || msg.includes('safe') || msg.includes('trust')) {
    response = `FinanceOS uses a ${projectDetails.usp} architecture to ensure your data is always protected and your financial decisions are smart.`;
  }
  // Priority 2: Financial Advice
  else if (msg.includes('runway') || msg.includes('burn')) {
    response = `Your current burn rate is ₹${context?.metrics?.burn?.toLocaleString() || '85,000'}/mo. You have ${context?.metrics?.runway || '150'} days of runway. I recommend reducing discretionary spend to push this further.`;
  } else if (msg.includes('budget') || msg.includes('expense')) {
    response = "You've used 72% of your monthly budget. Your 'Food & Dining' is at 75% usage. I suggest holding off on large dinner outings for the next 4 days.";
  } else if (msg.includes('invest') || msg.includes('stock')) {
    response = "Your investment portfolio is up 8.5% this month. You have ₹12,450 in unallocated balance; putting ₹5,000 into high-yield debt funds could optimize your idle cash.";
  }

  res.json({
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finance OS Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Finance OS Backend running on http://localhost:${PORT}`);
});
