import React from 'react';
import ApplicationNavigation from './app/routes/ApplicationNavigation';
import { Provider } from 'react-redux';
import { store } from './app/redux/Store';
import { CartProvider } from './app/common/CartContext';


const App = () => {
  return (
    <Provider store={store}>
      <CartProvider>
        <ApplicationNavigation />
      </CartProvider>
    </Provider >
  );
};
export default App;
