import React from 'react';

export enum DealStage {
  LEAD = 'Lead',
  QUALIFY = 'Qualify',
  QUOTE = 'Quote',
  NEGOTIATE = 'Negotiate',
  WON = 'Won',
  LOST = 'Lost'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Member';
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  lastContact: string;
  nextAction?: string;
  nextActionDate?: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  lastActivityDate: string;
  priority: 'High' | 'Medium' | 'Low';
  nextAction?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO date
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  relatedClientId?: string;
  relatedDealId?: string;
}

export interface Activity {
  id: string;
  clientId: string;
  type: 'Call' | 'Email' | 'Note' | 'Meeting';
  content: string;
  date: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}