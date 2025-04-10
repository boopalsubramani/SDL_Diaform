import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRefAppSettingMutation, useChangeLanguageMutation } from '../redux/service/AppSettingService';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLanguage } from '../redux/slice/AppSettingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettingsType {
    Message?: {
        Flash_Logo?: string;
        Client_Logo?: string;
        Labels?: Record<string, { defaultMessage: string }>;
        Password_Policy_Message?: string[];
        Languages?: { Code: string; Description: string; Alignment: string; Labels_Url: string }[];
        Mobile_App_Default_Language?: string;
    }[];
    [key: string]: any;
}

interface AppSettingsContextType {
    settings: AppSettingsType | null;
    selectedLanguage: { Code: string; Description: string; Alignment: string; Labels_Url: string };
    labels: Record<string, { defaultMessage: string }>;
    loading: boolean;
    error: string | null;
    changeLanguage: (languageCode: string) => void;
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
    const dispatch = useDispatch();
    const selectedLanguageCode = useSelector((state: any) => state.appSettings.selectedLanguage);
    const [settings, setSettings] = useState<AppSettingsType | null>(null);
    const [selectedLanguage, setSelectedLanguageState] = useState({ Code: '', Description: '', Alignment: '', Labels_Url: '' });
    const [labels, setLabels] = useState<Record<string, { defaultMessage: string }>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appSettingsAPIReq, appSettingsAPIRes] = useRefAppSettingMutation();
    const [changeLanguageReq] = useChangeLanguageMutation();

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
    }, [appSettingsAPIReq]);

    useEffect(() => {
        const loadLanguage = async () => {
            const storedLang = await AsyncStorage.getItem('selectedLanguage');
            if (storedLang) {
                try {
                    const parsedLang = JSON.parse(storedLang);
                    dispatch(setSelectedLanguage(parsedLang));
                    setSelectedLanguageState(parsedLang);
                } catch (error) {
                    console.error("❌ Error parsing stored language:", error);
                }
            }
        };

        loadLanguage();
    }, [dispatch]);

    useEffect(() => {
        if (appSettingsAPIRes?.data) {
            setSettings(appSettingsAPIRes.data);

            // Get the default language
            const defaultLanguageCode = appSettingsAPIRes.data.Message?.[0]?.Mobile_App_Default_Language;
            const defaultLanguage = appSettingsAPIRes.data.Message?.[0]?.Languages.find(
                (lang: { Code: string }) => lang.Code === defaultLanguageCode
            );

            if (defaultLanguage) {
                setSelectedLanguageState(defaultLanguage);
                fetchLabels(defaultLanguage.Labels_Url);
                dispatch(setSelectedLanguage(defaultLanguage));
            }
        } else if (appSettingsAPIRes?.error) {
            setError('Error fetching app settings');
        }
    }, [appSettingsAPIRes?.data, appSettingsAPIRes?.error, dispatch]);

    useEffect(() => {
        if (selectedLanguage?.Labels_Url) {
            console.log("📥 Fetching labels for:", selectedLanguage.Code);
            fetchLabels(selectedLanguage.Labels_Url)
                .then((labels) => {
                    setLabels(labels);
                })
                .catch(err => console.error("❌ Label Fetch Error:", err));
        }
    }, [selectedLanguage]);

    const fetchLabels = async (url: string) => {
        if (url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch labels:', error);
                throw error;
            }
        }
    };

    const changeLanguage = async (languageCode: string) => {
        try {
            if (!languageCode) {
                console.error("❌ Error: changeLanguage called with an undefined or empty language code!");
                return;
            }

            setLoading(true);
            setError(null);

            const response = await changeLanguageReq({ language: languageCode }).unwrap();
            console.log("🌐 API Response:", response);

            if (response?.Code === 200) {
                const languages = response?.Message?.[0]?.Languages || [];

                console.log("🌍 Available Languages:", languages);

                if (!Array.isArray(languages) || languages.length === 0) {
                    console.error("❌ No valid languages found in API response.");
                    return;
                }

                // Ensure correct language is found
                const newLanguage = languages.find(
                    (lang: { Code: string }) => lang.Code?.toLowerCase() === languageCode.toLowerCase()
                );

                console.log("✅ New Language from API:", newLanguage);

                if (newLanguage?.Labels_Url) {
                    // Store language persistently
                    await AsyncStorage.setItem("selectedLanguage", JSON.stringify(newLanguage));

                    dispatch(setSelectedLanguage(newLanguage));
                    setSelectedLanguageState(newLanguage);
                    fetchLabels(newLanguage.Labels_Url);
                } else {
                    console.warn(`⚠️ No matching language found for '${languageCode}' OR Labels_Url is missing.`);
                }
            } else {
                console.error("❌ API Response Error:", response);
            }
        } catch (err) {
            console.error("❌ Failed to change language:", err);
            setError("Failed to change language");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppSettingsContext.Provider value={{ settings, selectedLanguage, labels, loading, error, changeLanguage }}>
            {children}
        </AppSettingsContext.Provider>
    );
};

