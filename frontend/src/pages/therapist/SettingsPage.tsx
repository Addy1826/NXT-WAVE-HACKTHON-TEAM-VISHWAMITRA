import React from 'react';

export const SettingsPage: React.FC = () => {
    return (
        <div className="py-6 px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">Settings configuration specific to therapist account will go here.</p>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Receive Email Notifications</span>
                        <input type="checkbox" className="toggle-checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Available for Emergency Calls</span>
                        <input type="checkbox" className="toggle-checkbox" />
                    </div>
                </div>
            </div>
        </div>
    );
};
