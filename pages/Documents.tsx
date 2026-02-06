import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Folder, MoreHorizontal, Plus, Search, Grid, List, Download, Share2 } from 'lucide-react';

const Documents: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6 animate-enter">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Manage contracts, proposals, and assets.</p>
            </div>
            <Button icon={Plus}>Upload File</Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search files..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm" />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Grid className="h-4 w-4" />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List className="h-4 w-4" />
                </button>
            </div>
        </div>

        {/* Folders */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Contracts', 'Proposals', 'Invoices', 'Assets', 'Legal', 'Archives'].map(folder => (
                <div key={folder} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 cursor-pointer transition-all group">
                    <Folder className="h-8 w-8 text-slate-400 group-hover:text-primary-500 mb-3 transition-colors" />
                    <h3 className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{folder}</h3>
                    <p className="text-xs text-slate-400">12 items</p>
                </div>
            ))}
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pt-4">Recent Files</h3>

        <Card noPadding className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase w-1/2">Name</th>
                            <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase whitespace-nowrap">Type</th>
                            <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase whitespace-nowrap">Size</th>
                            <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase whitespace-nowrap">Modified</th>
                            <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-700 group-hover:text-slate-900 block">Project_Proposal_v{i}.pdf</span>
                                            <span className="text-xs text-slate-400">Added by Sarah</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">PDF Document</td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">2.4 MB</td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">Oct 2{i}, 2023</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Download className="h-4 w-4" /></button>
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Share2 className="h-4 w-4" /></button>
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><MoreHorizontal className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );
};

export default Documents;