// BookingContext.tsx
import React, { createContext, useContext, useState } from 'react';

type BookingContextType = {
  currentBooking: BookingItem | null;
  setCurrentBooking: (item: BookingItem) => void;
};

const BookingContext = createContext<BookingContextType>({
  currentBooking: null,
  setCurrentBooking: () => {},
});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider: React.FC = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<BookingItem | null>(null);

  return (
    <BookingContext.Provider value={{ currentBooking, setCurrentBooking }}>
      {children}
    </BookingContext.Provider>
  );
};