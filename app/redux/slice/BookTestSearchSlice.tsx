// import { createSlice } from '@reduxjs/toolkit';
// import { bookTestSearchService } from '../service/BookTestSearchService';

// const initialState = {
//     bookTestSearchDetails: [],
//     updatedCartData: [],
// };

// export const bookTestSearchSlice = createSlice({
//     name: 'bookTestSearch',
//     initialState,
//     reducers: {
//         updateSelectedTest: (state, action) => {
//             state.updatedCartData = action.payload;
//         }
//     },
//     extraReducers: builder => {
//         builder.addMatcher(
//             bookTestSearchService.endpoints.bookTestSearch.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("payload", payload)
//                 if (payload.Code === 200) {
//                     console.log('APISUCCESS---------bookTestSearch-------------->', payload.Message);
//                     state.bookTestSearchDetails = payload.Message;
//                 }
//             },
//         );
//     },
// });

// export const { updateSelectedTest } = bookTestSearchSlice.actions;

// export default bookTestSearchSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';
import { bookTestSearchService } from '../service/BookTestSearchService';

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
}

// const initialState = {
//     bookTestSearchDetails: [],
//     updatedCartData: [], // Holds the cart items
//     totalCartValue: 0, // Holds the total cart amount
// };

const initialState: {
    bookTestSearchDetails: BookTest[];
    updatedCartData: BookTest[];
    totalCartValue: number;
} = {
    bookTestSearchDetails: [],
    updatedCartData: [],
    totalCartValue: 0,
};

export const bookTestSearchSlice = createSlice({
    name: 'bookTestSearch',
    initialState,
    reducers: {
        updateSelectedTest: (state, action) => {
            state.updatedCartData = action.payload;
            state.totalCartValue = action.payload.reduce((sum: any, item: any) => sum + (item.Amount || 0), 0);
        },
        addToCart: (state, action) => {
            const isAlreadyInCart = state.updatedCartData.some(cartItem => cartItem.Service_Code === action.payload.Service_Code);
            if (!isAlreadyInCart) {
                state.updatedCartData.push(action.payload);
                state.totalCartValue += action.payload.Amount || 0;
            }
        },
        removeFromCart: (state, action) => {
            state.updatedCartData = state.updatedCartData.filter(cartItem => cartItem.Service_Code !== action.payload.Service_Code);
            state.totalCartValue = state.updatedCartData.reduce((sum, item) => sum + (item.Amount || 0), 0);
        },
        clearCart: (state) => {
            state.updatedCartData = [];
            state.totalCartValue = 0;
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

export const { updateSelectedTest, addToCart, removeFromCart, clearCart } = bookTestSearchSlice.actions;
export default bookTestSearchSlice.reducer;

