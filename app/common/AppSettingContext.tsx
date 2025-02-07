// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRefAppSettingMutation } from '../redux/service/AppSettingService';

// interface AppSettingsType {
//   Message?: { Flash_Logo?: string; Labels?: Record<string, { defaultMessage: string }> }[];
//   [key: string]: any;
// }

// interface AppSettingsContextType {
//   settings: AppSettingsType | null;
// }

// const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// export const useAppSettings = () => {
//   const context = useContext(AppSettingsContext);
//   if (!context) {
//     throw new Error('useAppSettings must be used within an AppSettingsProvider');
//   }
//   return context;
// };

// export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [settings, setSettings] = useState<AppSettingsType | null>(null);
//   const [appSettingsAPIReq, appSettingsAPIRes] = useRefAppSettingMutation();

//   useEffect(() => {
//     const fetchAppSettings = async () => {
//       try {
//         await appSettingsAPIReq({});
//       } catch (error) {
//         console.error('Error fetching app settings:', error);
//       }
//     };
//     fetchAppSettings();
//   }, [appSettingsAPIReq]);

//   useEffect(() => {
//     if (appSettingsAPIRes?.data) {
//       setSettings(appSettingsAPIRes.data);
//     }
//   }, [appSettingsAPIRes?.data]);

//   return (
//     <AppSettingsContext.Provider value={{ settings }}>
//       {children}
//     </AppSettingsContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRefAppSettingMutation } from '../redux/service/AppSettingService';

interface AppSettingsType {
    Message?: {
        Flash_Logo?: string;
        Labels?: Record<string, { defaultMessage: string }>;
        Password_Policy_Message?: string[];
        Languages?: string[];
    }[];
    [key: string]: any;
}

interface AppSettingsContextType {
    settings: AppSettingsType | null;
    loading: boolean;
    error: string | null;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettings must be used within an AppSettingsProvider');
    }
    return context;
};

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettingsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appSettingsAPIReq, appSettingsAPIRes] = useRefAppSettingMutation();

    useEffect(() => {
        const fetchAppSettings = async () => {
            try {
                setLoading(true);
                setError(null);
                await appSettingsAPIReq({});
            } catch (err) {
                setError('Failed to fetch app settings');
            } finally {
                setLoading(false);
            }
        };

        fetchAppSettings();
    }, []);

    useEffect(() => {
        if (appSettingsAPIRes?.data) {
            setSettings(appSettingsAPIRes.data);
        } else if (appSettingsAPIRes?.error) {
            setError('Error fetching app settings');
        }
    }, [appSettingsAPIRes?.data, appSettingsAPIRes?.error]);

    return (
        <AppSettingsContext.Provider value={{ settings, loading, error }}>
            {children}
        </AppSettingsContext.Provider>
    );
};
