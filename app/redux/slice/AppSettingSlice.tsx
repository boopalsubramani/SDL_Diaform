import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettingService } from "../service/AppSettingService";

const initialState = {
    AppSettingDetails: [],
    selectedLanguage: null, // Store full language object instead of just code
    availableLanguages: [], // Store available languages from API
};

export const AppSettingSlice = createSlice({
    name: "appSettings",
    initialState,
    reducers: {
        setSelectedLanguage: (state, action) => {
            console.log("🌍 Setting New Language:", action.payload);
            state.selectedLanguage = action.payload;
            AsyncStorage.setItem('selectedLanguage', JSON.stringify(action.payload));

        },
        loadSelectedLanguage: (state) => {
            // Load the selected language from AsyncStorage
            AsyncStorage.getItem('selectedLanguage').then(language => {
                if (language) {
                    state.selectedLanguage = JSON.parse(language);
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            AppSettingService.endpoints.RefAppSetting.matchFulfilled,
            (state, { payload }) => {
                console.log("🚨 RefAppSetting Triggered! Current Language:", state.selectedLanguage);
                if (payload.Code === 200) {
                    console.log("🌐 API Response:", payload);
                    state.AppSettingDetails = payload.Message;

                    // Extract Available Languages
                    if (Array.isArray(payload.Message[0]?.Languages)) {
                        state.availableLanguages = payload.Message[0].Languages;
                        console.log("✅ Available Languages Updated:", state.availableLanguages);
                    }

                    // Ensure default language is a valid object
                    const apiDefaultLangCode = payload.Message[0]?.Mobile_App_Default_Language;
                    const defaultLang = state.availableLanguages.find(lang => lang.Code === apiDefaultLangCode);

                    console.log("🌍 Extracted Default Language:", defaultLang);
                    state.selectedLanguage = defaultLang || { Code: "en-US" };
                    // Store the default language in AsyncStorage
                    // AsyncStorage.setItem('selectedLanguage', JSON.stringify(state.selectedLanguage));
                }
            }
        );

        builder.addMatcher(
            AppSettingService.endpoints.changeLanguage.matchFulfilled,
            (state, { payload }) => {
                if (payload.Code === 200) {
                    console.log("🌐 Language API Response:", payload);

                    state.AppSettingDetails = payload.Message;

                    // Extract the new language object from available languages
                    const newLanguageCode = payload.Message[0]?.Code;
                    const newLanguage = state.availableLanguages.find(lang => lang.Code === newLanguageCode);

                    if (newLanguage) {
                        console.log("✅ New Language from API:", newLanguage);
                        state.selectedLanguage = newLanguage;
                        // Store the new language in AsyncStorage
                        AsyncStorage.setItem('selectedLanguage', JSON.stringify(newLanguage));
                    } else {
                        console.error("❌ Failed to extract language code from API response.");
                    }
                }
            }
        );
    },
});

export const { setSelectedLanguage, loadSelectedLanguage } = AppSettingSlice.actions;
export default AppSettingSlice.reducer;


