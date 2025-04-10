import { createSlice } from '@reduxjs/toolkit';
import { bookTestSearchService } from '../service/BookTestSearchService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookTest {
    T_Discount_Amount(T_Discount_Amount: any): number;
    T_Sub_Total(T_Sub_Total: any): number;
    T_Patient_Due: number;
    T_Bill_Amount: number;
    Discount_Amount: number;
    Service_Name: string;
    Service_Code: string;
    Name: string;
    Amount: number;
    Service_Amount?: number;  
    handleBookingDetailState?:any;
}

const initialState: {
    bookTestSearchDetails: BookTest[];
    updatedCartData: BookTest[];
    bookingDetails: BookTest[];
    totalCartValue: number;
    totalBookingValue: number;
    handleBookingDetailState:null | any;
} = {
    bookTestSearchDetails: [],
    updatedCartData: [],
    bookingDetails: [],
    totalCartValue: 0,
    totalBookingValue: 0,
    handleBookingDetailState:null
};

export const bookTestSearchSlice = createSlice({
    name: 'bookTestSearch',
    initialState,
    reducers: {
        updateSelectedTest: (state, action) => {
            state.updatedCartData = action.payload;
            state.totalCartValue = action.payload.reduce(
                (sum: number, item: BookTest) => sum + (item.Service_Amount ?? item.Amount ?? 0),
                0
            );
            AsyncStorage.setItem('cartData', JSON.stringify(state.updatedCartData));
        },
        addToCart: (state, action) => {
            const isAlreadyInCart = state.updatedCartData.some(cartItem => cartItem.Service_Code === action.payload.Service_Code);
            if (!isAlreadyInCart) {
                state.updatedCartData.push(action.payload);
                state.totalCartValue += action.payload.Service_Amount ?? action.payload.Amount ?? 0;
                AsyncStorage.setItem('cartData', JSON.stringify(state.updatedCartData));
            }
        },
        removeFromCart: (state, action) => {
            state.updatedCartData = state.updatedCartData.filter(cartItem => cartItem.Service_Code !== action.payload.Service_Code);
            state.totalCartValue = state.updatedCartData.reduce(
                (sum, item) => sum + (item.Service_Amount ?? item.Amount ?? 0),
                0
            );
            AsyncStorage.setItem('cartData', JSON.stringify(state.updatedCartData));
        },
        clearCart: (state) => {
            state.updatedCartData = [];
            state.totalCartValue = 0;
            AsyncStorage.removeItem('cartData');
        },
        updateBookingDetails: (state, action) => {
            state.bookingDetails = action.payload;
            state.totalBookingValue = action.payload.reduce(
                (sum: number, item: BookTest) => sum + (item.Service_Amount ?? item.Amount ?? 0),
                0
            );
            AsyncStorage.setItem('bookingDetails', JSON.stringify(state.bookingDetails));
        },
        addToBooking: (state, action) => {
            const isAlreadyInBooking = state.bookingDetails.some(bookingItem => bookingItem.Service_Code === action.payload.Service_Code);
            if (!isAlreadyInBooking) {
                state.bookingDetails.push(action.payload);
                state.totalBookingValue += action.payload.Service_Amount ?? action.payload.Amount ?? 0;
                AsyncStorage.setItem('bookingDetails', JSON.stringify(state.bookingDetails));
            }
        },
        removeFromBooking: (state, action) => {
            state.bookingDetails = state.bookingDetails.filter(bookingItem => bookingItem.Service_Code !== action.payload.Service_Code);
            state.totalBookingValue = state.bookingDetails.reduce(
                (sum, item) => sum + (item.Service_Amount ?? item.Amount ??0),
                0
            );
            AsyncStorage.setItem('bookingDetails', JSON.stringify(state.bookingDetails));
        },
        clearBooking: (state) => {
            state.bookingDetails = [];
            state.totalBookingValue = 0;
            AsyncStorage.removeItem('bookingDetails');
        },
        updateHandleBookingDetail:(state,action) => {
            state.handleBookingDetailState = action?.payload || null;
        }
    },
    extraReducers: builder => {
        builder.addMatcher(
            bookTestSearchService.endpoints.bookTestSearch.matchFulfilled,
            (state, { payload }) => {
                if (payload.Code === 200) {
                    console.log('APISUCCESS---------bookTestSearch-------------->', payload.Message);
                    state.bookTestSearchDetails = payload.Message;
                }
            },
        );
    },
});

export const {
    updateSelectedTest,
    addToCart,
    removeFromCart,
    clearCart,
    updateBookingDetails,
    addToBooking,
    removeFromBooking,
    clearBooking,
    updateHandleBookingDetail
} = bookTestSearchSlice.actions;
export default bookTestSearchSlice.reducer;

