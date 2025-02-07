import React from 'react';
import ApplicationNavigation from './app/routes/ApplicationNavigation';
import { Provider } from 'react-redux';
import { store } from './app/redux/Store';
import { CartProvider } from './app/common/CartContext';
import { AppSettingsProvider } from './app/common/AppSettingContext';


const App = () => {
  return (
    <Provider store={store}>
      <CartProvider>
        <AppSettingsProvider>
          <ApplicationNavigation />
        </AppSettingsProvider>
      </CartProvider>
    </Provider >
  );
};
export default App;
