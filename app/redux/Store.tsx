import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilities and component
import { api } from '../util/API';
import appSettings from "../redux/slice/AppSettingSlice";
import fetchapi from "../redux/slice/FetchApiSlice";
import login from "../redux/slice/LoginSlice";
import forgotPassword from "../redux/slice/ForgotPasswordSlice";
import dashboard from "../redux/slice/DashboardSlice";
import bookTestSearch from "../redux/slice/BookTestSearchSlice";
import bookingList from "../redux/slice/BookingListSlice";
import bookingDetail from "../redux/slice/BookingDetailSlice";
import serviceBooking from "../redux/slice/ServiceBookingSlice"

const reducers = combineReducers({
    [api.reducerPath]: api.reducer,
    appSettings,
    fetchapi,
    login,
    forgotPassword,
    dashboard,
    bookTestSearch,
    bookingList,
    bookingDetail,
    serviceBooking


});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [''],
    blacklist: [''],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(api.middleware);
        // comment this line if your system doesnt have flipper installed
        // if (_DEV_ && !process.env.JEST_WORKER_ID) {
        //   const createDebugger = require("redux-flipper").default;
        //   middlewares.push(createDebugger(), logger);
        // }
        return middlewares;
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };
