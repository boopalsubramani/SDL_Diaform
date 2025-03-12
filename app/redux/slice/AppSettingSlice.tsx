// import { createSlice } from '@reduxjs/toolkit';
// import { AppSettingService } from '../service/AppSettingService';

// const initialState = {
//     AppSettingDetails: [],
// };

// export const AppSettingSlice = createSlice({
//     name: 'appSettings',
//     initialState,
//     reducers: {

//     },
//     extraReducers: builder => {
//         builder.addMatcher(
//             AppSettingService.endpoints.RefAppSetting.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("payload",payload)
//                 if (payload.Code === 200) {

//                     console.log('APISUCCESS----------appSettings------------->', payload.Message);
//                     state.AppSettingDetails = payload.Message;
//                 }
//             },
//         );
//     },
// });

// export const { } = AppSettingSlice.actions;

// export default AppSettingSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';
// import { AppSettingService } from '../service/AppSettingService';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const initialState = {
//     AppSettingDetails: [],
//     selectedLanguage: 'en-US', // Default language
// };

// export const AppSettingSlice = createSlice({
//     name: 'appSettings',
//     initialState,
//     reducers: {
//         setSelectedLanguage: (state, action) => {
//             state.selectedLanguage = action.payload;
//             console.log("🌐 Changing Language to:", action.payload); 
//             // AsyncStorage.setItem('selectedLanguage', action.payload);
//         },
//     },
//     extraReducers: builder => {
//         builder.addMatcher(
//             AppSettingService.endpoints.RefAppSetting.matchFulfilled,
//             (state, { payload }) => {
//                 if (payload.Code === 200) {
//                     state.AppSettingDetails = payload.Message;
//                 }
//             },
//         );
//         // builder.addMatcher(
//         //     AppSettingService.endpoints.changeLanguage.matchFulfilled,
//         //     (state, { payload }) => {
//         //         if (payload.Code === 200) {
//         //             state.AppSettingDetails = payload.Message;
//         //         }
//         //     },
//         // );
//         builder.addMatcher(
//             AppSettingService.endpoints.changeLanguage.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("🔄 Redux: Language API Response:", payload);
//                 if (payload.Code === 200) {
//                     state.AppSettingDetails = payload.Message;

//                     // 🔹 Extract language from API response & update Redux state
//                     const newLanguageCode = payload.Message?.[0]?.Mobile_App_Default_Language;
//                     console.log("🌍 Extracted Language Code:", newLanguageCode);
//                     if (newLanguageCode) {
//                         state.selectedLanguage = newLanguageCode;
//                     }else {
//                         console.warn("⚠️ No language code found in API response.");
//                     }
//                 }
//             }
//         );

//     },
// });

// export const { setSelectedLanguage } = AppSettingSlice.actions;

// export default AppSettingSlice.reducer;




// import { createSlice } from '@reduxjs/toolkit';
// import { AppSettingService } from '../service/AppSettingService';

// const initialState = {
//     AppSettingDetails: [],
//     selectedLanguage: 'en-US', // Default language
//     availableLanguages: [], // Store available languages from API
// };

// export const AppSettingSlice = createSlice({
//     name: 'appSettings',
//     initialState,
//     reducers: {
//         setSelectedLanguage: (state, action) => {
//             console.log("🌍 Setting New Language:", action.payload);
//             state.selectedLanguage = action.payload || "en-US"; // Default fallback
//         },
//     },
//     extraReducers: builder => {
//         builder.addMatcher(
//             AppSettingService.endpoints.RefAppSetting.matchFulfilled,
//             (state, { payload }) => {
//                 if (payload.Code === 200) {
//                     console.log("🌐 API Response:", payload);

//                     state.AppSettingDetails = payload.Message;

//                     // Extract Available Languages
//                     if (Array.isArray(payload.Message[0]?.Languages)) {
//                         state.availableLanguages = payload.Message[0].Languages;
//                         console.log("✅ Available Languages Updated:", state.availableLanguages);
//                     }

//                     // Set Default Language from API Response
//                     const apiDefaultLang = payload.Message[0]?.Mobile_App_Default_Language || "en-US";
//                     console.log("🌍 Extracted Default Language:", apiDefaultLang);
//                     state.selectedLanguage = apiDefaultLang;
//                 }
//             }
//         );

//         builder.addMatcher(
//             AppSettingService.endpoints.changeLanguage.matchFulfilled,
//             (state, { payload }) => {
//                 if (payload.Code === 200) {
//                     console.log("🌐 Language API Response:", payload);

//                     state.AppSettingDetails = payload.Message;

//                     // Extract New Language Code Safely
//                     const newLanguageCode = payload.Message[0]?.Code;

//                     if (newLanguageCode) {
//                         console.log("✅ New Language from API:", newLanguageCode);
//                         state.selectedLanguage = newLanguageCode;
//                     } else {
//                         console.error("❌ Failed to extract language code from API response.");
//                     }
//                 }
//             }
//         );
//     },
// });

// export const { setSelectedLanguage } = AppSettingSlice.actions;
// export default AppSettingSlice.reducer;



// import { createSlice } from "@reduxjs/toolkit";
// import { AppSettingService } from "../service/AppSettingService";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const initialState = {
//     AppSettingDetails: [],
//     selectedLanguage: null, // Store full language object instead of just code
//     availableLanguages: [], // Store available languages from API
// };

// export const AppSettingSlice = createSlice({
//     name: "appSettings",
//     initialState,
//     reducers: {
//         setSelectedLanguage: (state, action) => {
//             const lan = AsyncStorage.getItem('selectedLanguage')
//             console.log('%%%%%%%%%%%%', lan);
//             console.log("🌍 Setting New Language:", action.payload);
//             state.selectedLanguage = action.payload || lan
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addMatcher(
//             AppSettingService.endpoints.RefAppSetting.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("🚨 RefAppSetting Triggered! Current Language:", state.selectedLanguage);
//                 if (payload.Code === 200) {
//                     console.log("🌐 API Response:", payload);
//                     state.AppSettingDetails = payload.Message;

//                     // Extract Available Languages
//                     if (Array.isArray(payload.Message[0]?.Languages)) {
//                         state.availableLanguages = payload.Message[0].Languages;
//                         console.log("✅ Available Languages Updated:", state.availableLanguages);
//                     }

//                     // Ensure default language is a valid object
//                     const apiDefaultLangCode = payload.Message[0]?.Mobile_App_Default_Language || "en-US";
//                     const defaultLang = state.availableLanguages.find(lang => lang.Code === apiDefaultLangCode);

//                     console.log("🌍 Extracted Default Language:", defaultLang);
//                     state.selectedLanguage = defaultLang || { Code: "en-US" };
//                 }
//             }
//         );

//         builder.addMatcher(
//             AppSettingService.endpoints.changeLanguage.matchFulfilled,
//             (state, { payload }) => {
//                 if (payload.Code === 200) {
//                     console.log("🌐 Language API Response:", payload);

//                     state.AppSettingDetails = payload.Message;

//                     // Extract the new language object from available languages
//                     const newLanguageCode = payload.Message[0]?.Code;
//                     const newLanguage = state.availableLanguages.find(lang => lang.Code === newLanguageCode);

//                     if (newLanguage) {
//                         console.log("✅ New Language from API:", newLanguage);
//                         state.selectedLanguage = newLanguage;
//                     } else {
//                         console.error("❌ Failed to extract language code from API response.");
//                     }
//                 }
//             }
//         );
//     },
// });

// export const { setSelectedLanguage } = AppSettingSlice.actions;
// export default AppSettingSlice.reducer;




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


