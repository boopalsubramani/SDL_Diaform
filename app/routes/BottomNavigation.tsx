import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import Constants from '../util/Constants';
import BookingScreen from '../screens/BookingScreen';
import BookTestScreen from '../screens/BookTestScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OthersScreen from '../screens/OthersScreen';

const Bottom = createBottomTabNavigator();

interface MenuItem {
  Main_Menu_Code: string;
  Menu_Desc: string;
  component: React.ComponentType<any>;
  Selected_Tab_Icon_Url?: string;
  Tab_Icon_url?: string;
}

interface AppSettingDetails {
  Menu_Items: MenuItem[];
}

const BottomNavigation = () => {
  const bottomImages = useSelector(
    (state: RootState) => state.appSettings.AppSettingDetails as AppSettingDetails[]
  );

  // Fallback menu items
  const fallbackMenuItems: MenuItem[] = [
    { Main_Menu_Code: 'BK', Menu_Desc: 'Bookings', component: BookingScreen },
    { Main_Menu_Code: 'BT', Menu_Desc: 'Book Test', component: BookTestScreen },
    { Main_Menu_Code: 'DB', Menu_Desc: 'Offers', component: DashboardScreen },
    { Main_Menu_Code: 'PY', Menu_Desc: 'Payments', component: PaymentScreen },
    { Main_Menu_Code: 'OT', Menu_Desc: 'Others', component: OthersScreen },
  ];

  // Get dynamic menu items or fallback
  const menuItems: MenuItem[] = bottomImages?.[0]?.Menu_Items?.length
    ? bottomImages[0].Menu_Items
    : fallbackMenuItems;

  // Mapping Main_Menu_Code to components
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    BK: BookingScreen,
    BT: BookTestScreen,
    DB: DashboardScreen,
    PY: PaymentScreen,
    OT: OthersScreen,
  };

  return (
    <Bottom.Navigator
      initialRouteName="Book Test"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0.3,
          borderTopColor: '#778899',
          display: route.name === 'Payments' ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          fontSize: Constants.FONT_SIZE.S,
          fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        },
      })}
    >
      {menuItems.map((item, index) => {
        const Component = componentMap[item.Main_Menu_Code];

        if (!Component) return null;

        return (
          <Bottom.Screen
            key={index}
            name={item.Menu_Desc}
            component={Component}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={{
                    uri: focused ? item.Selected_Tab_Icon_Url || '' : item.Tab_Icon_url || '',
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? Constants.COLOR.THEME_COLOR : 'black',
                    fontSize: Constants.FONT_SIZE.S,
                    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
                  }}
                >
                  {item.Menu_Desc}
                </Text>
              ),
            }}
          />
        );
      })}
    </Bottom.Navigator>
  );
};

export default BottomNavigation;

