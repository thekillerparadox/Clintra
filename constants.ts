import { Activity, Client, Deal, DealStage, Task } from './types';

// Helper to generate dynamic dates relative to today
const getRelativeDate = (daysOffset: number, iso: boolean = true) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  // Ensure we don't return negative time if offset is large negative, though Date handles it.
  return iso ? date.toISOString() : date.toISOString().split('T')[0];
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Sarah Miller',
    company: 'Apex Design Studio',
    email: 'sarah@apexdesign.com',
    phone: '+1 (555) 012-3456',
    avatar: 'https://picsum.photos/200/200?random=1',
    status: 'Active',
    lastContact: getRelativeDate(-3), // 3 days ago
    nextAction: 'Send revised contract',
    nextActionDate: getRelativeDate(2), // 2 days from now
  },
  {
    id: 'c2',
    name: 'James Chen',
    company: 'Quantum Dynamics',
    email: 'james.c@quantum.io',
    phone: '+1 (555) 987-6543',
    avatar: 'https://picsum.photos/200/200?random=2',
    status: 'Active',
    lastContact: getRelativeDate(-5),
    nextAction: 'Schedule technical review',
    nextActionDate: getRelativeDate(4),
  },
  {
    id: 'c3',
    name: 'Elena Rodriguez',
    company: 'EcoLiving Inc.',
    email: 'elena@ecoliving.org',
    phone: '+1 (555) 456-7890',
    avatar: 'https://picsum.photos/200/200?random=3',
    status: 'Inactive',
    lastContact: getRelativeDate(-45),
    nextAction: 'Quarterly check-in',
    nextActionDate: getRelativeDate(14),
  },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Q4 Marketing Campaign',
    clientId: 'c1',
    value: 12500,
    stage: DealStage.QUOTE,
    probability: 60,
    expectedCloseDate: getRelativeDate(15, false), // 15 days out
    lastActivityDate: getRelativeDate(-3),
    priority: 'High',
    nextAction: 'Follow up on proposal',
  },
  {
    id: 'd2',
    title: 'Website Redesign',
    clientId: 'c2',
    value: 8000,
    stage: DealStage.NEGOTIATE,
    probability: 80,
    expectedCloseDate: getRelativeDate(5, false), // closing soon
    lastActivityDate: getRelativeDate(-2),
    priority: 'Medium',
    nextAction: 'Finalize scope addendum',
  },
  {
    id: 'd3',
    title: 'Brand Identity',
    clientId: 'c3',
    value: 4500,
    stage: DealStage.LEAD,
    probability: 20,
    expectedCloseDate: getRelativeDate(45, false),
    lastActivityDate: getRelativeDate(-45), // Stalled
    priority: 'Low',
    nextAction: 'Initial discovery call',
  },
  {
    id: 'd4',
    title: 'SEO Retainer',
    clientId: 'c1',
    value: 2000,
    stage: DealStage.WON,
    probability: 100,
    expectedCloseDate: getRelativeDate(-10, false),
    lastActivityDate: getRelativeDate(-10),
    priority: 'Medium',
  },
  {
    id: 'd5',
    title: 'Mobile App UX Audit',
    clientId: 'c2',
    value: 5500,
    stage: DealStage.QUALIFY,
    probability: 40,
    expectedCloseDate: getRelativeDate(25, false),
    lastActivityDate: getRelativeDate(-8),
    priority: 'Medium',
    nextAction: 'Send portfolio examples',
  },
  {
    id: 'd6',
    title: 'Enterprise Consultation',
    clientId: 'c3',
    value: 25000,
    stage: DealStage.QUOTE,
    probability: 50,
    expectedCloseDate: getRelativeDate(60, false),
    lastActivityDate: getRelativeDate(-1),
    priority: 'High',
    nextAction: 'Prepare pricing tiers',
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Send revised proposal to Apex',
    dueDate: getRelativeDate(1), // Tomorrow
    completed: false,
    priority: 'High',
    relatedClientId: 'c1',
    relatedDealId: 'd1',
  },
  {
    id: 't2',
    title: 'Follow up with James regarding contract',
    dueDate: getRelativeDate(2),
    completed: false,
    priority: 'Medium',
    relatedClientId: 'c2',
    relatedDealId: 'd2',
  },
  {
    id: 't3',
    title: 'Update portfolio with EcoLiving project',
    dueDate: getRelativeDate(-2),
    completed: true,
    priority: 'Low',
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    clientId: 'c1',
    type: 'Email',
    content: 'Sent initial proposal draft for review.',
    date: getRelativeDate(-3),
  },
  {
    id: 'a2',
    clientId: 'c1',
    type: 'Call',
    content: 'Discussed project scope adjustments. Client wants to add a blog section.',
    date: getRelativeDate(-5),
  },
  {
    id: 'a3',
    clientId: 'c2',
    type: 'Meeting',
    content: 'Discovery session. Key goals: Speed and Mobile responsiveness.',
    date: getRelativeDate(-6),
  },
];