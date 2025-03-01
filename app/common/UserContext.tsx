// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// interface UserContextType {
//     userData: any;
//     setUserData: React.Dispatch<React.SetStateAction<any>>;
// }

// // Provide a default value for the context
// const UserContext = createContext<UserContextType>({
//     userData: null,
//     setUserData: () => { },
// });

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [userData, setUserData] = useState(null);

//     useEffect(() => {
//         console.log(' userData Details:', userData);
//     }, [userData]);

//     return (
//         <UserContext.Provider value={{ userData, setUserData }}>
//             {children}
//         </UserContext.Provider>
//     );
// };


// export const useUser = () => useContext(UserContext);







import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    currentPosition: number;
    setCurrentPosition: React.Dispatch<React.SetStateAction<number>>;
    selectedPatientDetails: any;
    setSelectedPatientDetails: React.Dispatch<React.SetStateAction<any>>;
    testData: any;
    setTestData: React.Dispatch<React.SetStateAction<any>>;
    selectedTest: any;
    setSelectedTest: React.Dispatch<React.SetStateAction<any>>;
    isChooseTest: any;
    setIsChooseTest: React.Dispatch<React.SetStateAction<any>>;
    selectedDate: any, setSelectedDate: React.Dispatch<React.SetStateAction<any>>, selectedTime: any, setSelectedTime: React.Dispatch<React.SetStateAction<any>>;
    paymentMethod: any, setPaymentMethod: React.Dispatch<React.SetStateAction<any>>
    bookingResponse: any, setBookingResponse: React.Dispatch<React.SetStateAction<any>>
    bookingNo: string; // Add bookingNo
    setBookingNo: React.Dispatch<React.SetStateAction<string>>;
}

// Provide a default value for the context
const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => { },
    currentPosition: 0,
    setCurrentPosition: () => { },
    selectedPatientDetails: null,
    setSelectedPatientDetails: () => { },
    testData: null,
    setTestData: () => { },
    selectedTest: null,
    setSelectedTest: () => { },
    isChooseTest: null,
    setIsChooseTest: () => { },
    selectedTime: null, setSelectedTime: () => { },
    selectedDate: null, setSelectedDate: () => { },
    paymentMethod: null, setPaymentMethod: () => { },
    bookingResponse: null, setBookingResponse: () => { },
    bookingNo: '',
    setBookingNo: () => { },

});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
    const [testData, setTestData] = useState<any[]>([]);
    const [selectedTest, setSelectedTest] = useState<any[]>([]);
    const [isChooseTest, setIsChooseTest] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);
    const [bookingNo, setBookingNo] = useState<string>('');
    return (
        <UserContext.Provider value={{
            userData, setUserData, currentPosition, setCurrentPosition, selectedPatientDetails, setSelectedPatientDetails, testData, setTestData,
            selectedTest, setSelectedTest, isChooseTest, setIsChooseTest,
            selectedDate, setSelectedDate,
            selectedTime, setSelectedTime,
            paymentMethod, setPaymentMethod,
            bookingResponse, setBookingResponse,
            bookingNo, setBookingNo
        }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);

