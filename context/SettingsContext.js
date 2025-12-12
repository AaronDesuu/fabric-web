'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext({
    settings: null,
});

export function SettingsProvider({ children, initialSettings }) {
    // We use initialSettings from server component tohydrate state
    const [settings, setSettings] = useState(initialSettings || { whatsapp_number: '6281234567890' });

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
