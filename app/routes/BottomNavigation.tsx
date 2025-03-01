import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, Image, Text } from 'react-native';
import BookingScreen from '../screens/BookingScreen';
import BookTestScreen from '../screens/BookTestScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OthersScreen from '../screens/OthersScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import Constants from '../util/Constants';



const Bottom = createBottomTabNavigator();

interface MenuItem {
  Main_Menu_Code: string;
  Menu_Desc: string;
  component: React.ComponentType<any>;
  Selected_Tab_Icon_Url: string;
  Tab_Icon_url: string;
}

interface AppSettingDetails {
  Menu_Items: MenuItem[];
}

const BottomNavigation = () => {
  const bottomImages = useSelector(
    (state: RootState) => state.appSettings.AppSettingDetails as AppSettingDetails[]
  );

  const fallbackMenuItems: MenuItem[] = [
    { Main_Menu_Code: 'BK', Menu_Desc: 'Bookings', component: BookingScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Main_Menu_Code: 'BT', Menu_Desc: 'Book Test', component: BookTestScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Main_Menu_Code: 'DB', Menu_Desc: 'Offers', component: DashboardScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Main_Menu_Code: 'PY', Menu_Desc: 'Payments', component: PaymentScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Main_Menu_Code: 'OT', Menu_Desc: 'Others', component: OthersScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
  ];

  const menuItems: MenuItem[] = bottomImages?.[0]?.Menu_Items || fallbackMenuItems;

  const getComponentByMainMenuCode = (mainMenuCode: string) => {
    switch (mainMenuCode) {
      case 'BK':
        return BookingScreen;
      case 'BT':
        return BookTestScreen;
      case 'DB':
        return DashboardScreen;
      case 'PY':
        return PaymentScreen;
      case 'OT':
        return OthersScreen;
      default:
        return null;
    }
  };

  return (
    <Bottom.Navigator
      initialRouteName="Book Test"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0.3,
          borderTopColor: '#778899',
        },
        tabBarLabelStyle: {
          fontSize: Constants.FONT_SIZE.S,
          fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
          // fontWeight: 'bold',
          // color: 'grey',
        },
      }}
    >
      {menuItems.map((item: MenuItem, index: number) => {
        const Component = getComponentByMainMenuCode(item.Main_Menu_Code);

        if (!Component) {
          return null;
        }

        return (
          <Bottom.Screen
            key={index}
            name={item.Menu_Desc}
            component={Component}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused
                      ? { uri: item.Selected_Tab_Icon_Url }
                      : { uri: item.Tab_Icon_url }
                  }
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{
                  color: focused ? Constants.COLOR.THEME_COLOR : 'black', fontSize: Constants.FONT_SIZE.S, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
                }}>
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
