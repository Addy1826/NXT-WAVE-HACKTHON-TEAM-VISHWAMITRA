import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Users,
    Calendar,
    User,
    DollarSign,
    Settings,
    LogOut,
    MessageSquare
} from 'lucide-react';

export const TherapistLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/therapist/dashboard', icon: Home },
        { name: 'My Patients', href: '/therapist/patients', icon: Users },
        { name: 'Appointments', href: '/therapist/appointments', icon: Calendar },
        { name: 'Messages', href: '/therapist/messages', icon: MessageSquare },
        { name: 'Earnings', href: '/therapist/earnings', icon: DollarSign },
        { name: 'Profile', href: '/therapist/profile', icon: User },
        { name: 'Settings', href: '/therapist/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white border-r">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4 mb-5">
                                <span className="text-xl font-bold text-teal-600">Therapist Portal</span>
                            </div>
                            <div className="flex items-center px-4 mb-6">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                                        alt={user?.name}
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                    <p className="text-xs text-gray-500">Therapist</p>
                                </div>
                            </div>
                            <nav className="mt-5 flex-1 px-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                ? 'bg-teal-50 text-teal-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <item.icon
                                                className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                                                    }`}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <button
                                onClick={handleLogout}
                                className="flex-shrink-0 w-full group block"
                            >
                                <div className="flex items-center">
                                    <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
