import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
}

// Provide a default value for the context
const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log(' userData Details:', userData);
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);
