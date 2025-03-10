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
import serviceBooking from "../redux/slice/ServiceBookingSlice";
import otpSend from "../redux/slice/OtpSendSlice";
import resetPassword from "../redux/slice/ResetPasswordSlice";
import duplicateServiceBooking from "../redux/slice/DuplicateServiceBookingSlice";
import collectionDetails from '../redux/slice/CollectionDetailsSlice';
import transactionDetails from '../redux/slice/TransactionDetailsSlice';
import ledgerDateWise from '../redux/slice/LedgerDateWiseSlice';
import ledgerMonthWise from '../redux/slice/LedgerMonthWiseSlice';
import payment from '../redux/slice/PaymentSlice';
import invoiceDownload from '../redux/slice/InvoiceDownloadSlice';
import paymentGateway from '../redux/slice/PaymentGatewaySlice';
import serviceBookingCancel from '../redux/slice/ServiceBookingCancelSlice';

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
    serviceBooking,
    otpSend,
    resetPassword,
    duplicateServiceBooking,
    collectionDetails,
    transactionDetails,
    ledgerDateWise,
    ledgerMonthWise,
    payment,
    invoiceDownload,
    paymentGateway,
    serviceBookingCancel

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
