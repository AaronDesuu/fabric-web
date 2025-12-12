'use client';

import { useState } from 'react';
import { updateShopSettings } from '@/lib/supabase/settings-client';

export default function SettingsForm({ initialSettings }) {
    const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp_number || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const { error } = await updateShopSettings({ whatsapp_number: whatsapp });

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } else {
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Shop Configuration</h2>

            {message.text && (
                <div className={`p-4 mb-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                </label>
                <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        +
                    </span>
                    <input
                        type="text"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="6281234567890"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Format: Country code + Number (e.g., 6281234567890). Do not use spaces or dashes.
                </p>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
