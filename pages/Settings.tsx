import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { User, Mail, Shield, Check, Globe, Sliders, Bell, LogOut, Plus, Calendar } from 'lucide-react';
import { useToast } from '../components/Toast';

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'integrations'>('profile');
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  const handleSaveProfile = () => {
    addToast("Profile updated successfully", "success");
  };

  const toggleIntegration = (type: 'gmail' | 'calendar') => {
    if (type === 'gmail') {
        const newState = !isGmailConnected;
        setIsGmailConnected(newState);
        addToast(newState ? "Gmail connected" : "Gmail disconnected", newState ? "success" : "info");
    } else {
        const newState = !isCalendarConnected;
        setIsCalendarConnected(newState);
        addToast(newState ? "Calendar synced" : "Calendar sync disabled", newState ? "success" : "info");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-enter">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage your account, team members, and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-3">
            <nav className="space-y-1 sticky top-6">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <User className="h-4 w-4" /> My Profile
                </button>
                <button 
                    onClick={() => setActiveTab('team')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'team' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Shield className="h-4 w-4" /> Team & Roles
                </button>
                <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'integrations' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Globe className="h-4 w-4" /> Integrations
                </button>
                <div className="h-px bg-slate-200 my-2"></div>
                <button 
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => window.location.reload()} // Mock logout
                >
                    <LogOut className="h-4 w-4" /> Sign Out
                </button>
            </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
            
            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h2>
                        <div className="flex items-start gap-6">
                            <div className="relative group cursor-pointer">
                                <img src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" className="h-20 w-20 rounded-full border-4 border-slate-50 group-hover:opacity-90 transition-opacity" alt="Profile" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-white font-medium">Edit</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                        <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                                        <input type="email" defaultValue="john@clientra.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" disabled />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job Title</label>
                                    <input type="text" defaultValue="Founder & Designer" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Email Digest</p>
                                    <p className="text-xs text-slate-500">Receive a daily summary of tasks and pipeline movement.</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Browser Notifications</p>
                                    <p className="text-xs text-slate-500">Get alerted when a deal stage changes.</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- TEAM TAB --- */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
                                <p className="text-sm text-slate-500">Manage access and roles (2/5 seats used).</p>
                            </div>
                            <Button size="sm" icon={Plus} variant="secondary">Invite Member</Button>
                        </div>
                        
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase">User</th>
                                        <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase">Role</th>
                                        <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase">Status</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-500 text-xs uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
                                            <span className="font-medium text-slate-900">John Doe (You)</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="neutral">Owner</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-emerald-600 font-medium text-xs">Active</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-slate-300 text-xs italic">Managed by system</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">SA</div>
                                            <span className="font-medium text-slate-900">Sarah Admin</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="neutral">Member</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-emerald-600 font-medium text-xs">Active</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 text-xs font-medium">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- INTEGRATIONS TAB --- */}
            {activeTab === 'integrations' && (
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Connected Apps</h2>
                        <p className="text-sm text-slate-500 mb-6">Sync your emails and calendar events directly into the timeline.</p>
                        
                        <div className="space-y-4">
                            {/* Gmail */}
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Gmail / Google Workspace</h3>
                                        <p className="text-xs text-slate-500">Auto-log emails matching client addresses.</p>
                                    </div>
                                </div>
                                <Button 
                                    variant={isGmailConnected ? 'secondary' : 'primary'} 
                                    size="sm"
                                    onClick={() => toggleIntegration('gmail')}
                                >
                                    {isGmailConnected ? 'Connected' : 'Connect'}
                                </Button>
                            </div>

                            {/* Calendar */}
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Google Calendar</h3>
                                        <p className="text-xs text-slate-500">Sync meetings to deal timelines.</p>
                                    </div>
                                </div>
                                <Button 
                                    variant={isCalendarConnected ? 'secondary' : 'primary'} 
                                    size="sm"
                                    onClick={() => toggleIntegration('calendar')}
                                >
                                    {isCalendarConnected ? 'Syncing' : 'Connect'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;