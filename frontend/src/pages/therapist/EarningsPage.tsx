import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Download, HelpCircle } from 'lucide-react';

export const EarningsPage: React.FC = () => {
    // Mock Data for Chart
    const earningsData = [
        { month: 'Jan', amount: 2000 },
        { month: 'Feb', amount: 3500 },
        { month: 'Mar', amount: 2800 },
        { month: 'Apr', amount: 3200 },
        { month: 'May', amount: 4800 },
        { month: 'Jun', amount: 4500 },
        { month: 'Jul', amount: 3900 },
    ];

    // Mock Data for Session History
    const sessionHistory = [
        { id: 1, date: 'July 15, 2024', client: 'Ethan Bennett', type: 'Individual Therapy', duration: '50 min', status: 'Completed' },
        { id: 2, date: 'July 12, 2024', client: 'Olivia Harper', type: 'Couples Therapy', duration: '75 min', status: 'Completed' },
        { id: 3, date: 'July 10, 2024', client: 'Noah Thompson', type: 'Individual Therapy', duration: '50 min', status: 'Completed' },
        { id: 4, date: 'July 8, 2024', client: 'Sophia Clark', type: 'Group Therapy', duration: '90 min', status: 'Completed' },
        { id: 5, date: 'July 5, 2024', client: 'Liam Foster', type: 'Individual Therapy', duration: '50 min', status: 'Completed' },
    ];

    return (
        <div className="py-8 px-8 bg-white min-h-screen">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Earnings</h1>

            {/* Monthly Earnings Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 mb-10">
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Monthly Earnings</h2>
                    <div className="flex items-baseline mt-1">
                        <span className="text-4xl font-bold text-gray-900">$4,500</span>
                    </div>
                    <div className="text-sm mt-2">
                        <span className="text-green-500 font-medium">This Month +15%</span>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={earningsData}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: '#E5E7EB' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Session History Table */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Session History</h2>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Session Type</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {sessionHistory.map((session) => (
                                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 text-gray-800">
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                                        View
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Help Footer */}
            <div className="mt-12 flex items-center text-gray-500 text-sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help</span>
            </div>
        </div>
    );
};
