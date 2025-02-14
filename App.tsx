import React from 'react';
import ApplicationNavigation from './app/routes/ApplicationNavigation';
import { Provider } from 'react-redux';
import { store } from './app/redux/Store';
import { CartProvider } from './app/common/CartContext';
import { AppSettingsProvider } from './app/common/AppSettingContext';
import { UserProvider } from './app/common/UserContext';


const App = () => {
  return (
    <Provider store={store}>
      <CartProvider>
        <UserProvider>
          <AppSettingsProvider>
            <ApplicationNavigation />
          </AppSettingsProvider>
        </UserProvider>

      </CartProvider>
    </Provider >
  );
};
export default App;
