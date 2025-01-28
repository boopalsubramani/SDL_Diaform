// import React from 'react';
// import { useRoute } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Image } from 'react-native';
// import Constants from '../util/Constants';
// import OthersScreen from '../screens/OthersScreen';
// import BookTestScreen from '../screens/BookTestScreen';
// import BookingScreen from '../screens/BookingScreen';
// import PaymentScreen from '../screens/PaymentScreen';
// import DashboardScreen from '../screens/DashboardScreen';


// const Bottom = createBottomTabNavigator();

// const BookingIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/bookings_1.png')
//                     : require('../images/bottomTabIcons/bookings_0.png')
//             }
//             style={{ width: 24, height: 24, resizeMode: 'contain' }}
//         />
//     );
// };

// const BookTestIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/lab_1.png')
//                     : require('../images/bottomTabIcons/lab_0.png')
//             }
//             style={{ width: 24, height: 24, resizeMode: 'contain' }}
//         />
//     );
// };

// const DashboardIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/dashboard_1.png')
//                     : require('../images/bottomTabIcons/dashboard_0.png')
//             }
//             style={{ width: 24, height: 24, resizeMode: 'contain' }}
//         />
//     );
// };

// const PaymentIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/trends_1.png')
//                     : require('../images/bottomTabIcons/trends_0.png')
//             }
//             style={{ width: 24, height: 24, resizeMode: 'contain' }}
//         />
//     );
// };

// const OthersIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/settings_1.png')
//                     : require('../images/bottomTabIcons/settings_0.png')
//             }
//             style={{ width: 24, height: 24, resizeMode: 'contain' }}
//         />
//     );
// };

// const BottomNavigation = () => {
//     const route = useRoute();
//     const routeName = route.name;

//     return (
//         <Bottom.Navigator
//             screenOptions={{
//                 headerShown: false,
//                 tabBarActiveTintColor: Constants.COLOR.THEME_COLOR,
//                 tabBarInactiveTintColor: 'black',
//                 tabBarStyle: {
//                     height: 50,
//                 },
//             }}
//         >
//             <Bottom.Screen
//                 name="Booking"
//                 component={BookingScreen}
//                 options={{
//                     tabBarIcon: ({ focused }) => <BookingIcon focused={focused} />,
//                     tabBarLabelStyle: {
//                         fontSize: 12,
//                     },
//                 }}
//             />
//             <Bottom.Screen
//                 name="Book Test"
//                 component={BookTestScreen}
//                 options={{
//                     tabBarIcon: ({ focused }) => <BookTestIcon focused={focused} />,
//                     tabBarLabelStyle: {
//                         fontSize: 12,
//                     },
//                 }}
//             />
//             <Bottom.Screen
//                 name="Dashboard"
//                 component={DashboardScreen}
//                 options={{
//                     tabBarIcon: ({ focused }) => <DashboardIcon focused={focused} />,
//                     tabBarLabelStyle: {
//                         fontSize: 12,
//                     },
//                 }}
//             />
//             <Bottom.Screen
//                 name="Payments"
//                 component={PaymentScreen}
//                 options={{
//                     tabBarIcon: ({ focused }) => <PaymentIcon focused={focused} />,
//                     tabBarLabelStyle: {
//                         fontSize: 12,
//                     },
//                 }}
//             />
//             <Bottom.Screen
//                 name="Others"
//                 component={OthersScreen}
//                 options={{
//                     tabBarIcon: ({ focused }) => <OthersIcon focused={focused} />,
//                     tabBarLabelStyle: {
//                         fontSize: 12,
//                     },
//                 }}
//             />
//         </Bottom.Navigator>
//     );
// };

// export default BottomNavigation;



// import React, { useEffect } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Dimensions, Image } from 'react-native';
// import BookingScreen from '../screens/BookingScreen';
// import BookTestScreen from '../screens/BookTestScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// import PaymentScreen from '../screens/PaymentScreen';
// import OthersScreen from '../screens/OthersScreen';
// import Constants from "../util/Constants";

// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/Store';

// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get("window").width;

// const Bottom = createBottomTabNavigator();

// const BookTestIcon = ({ focused }: any) => {
//     return (
//         <Image
//             source={
//                 focused
//                     ? require('../images/bottomTabIcons/lab_1.png')
//                     : require('../images/bottomTabIcons/lab_0.png')
//             }
//             style={{ width: 20, height: 20, resizeMode: 'contain' }}
//         />
//     );
// };

// const BottomNavigation = () => {
//     const bottomImages = useSelector((state: RootState) => state.appSettings.AppSettingDetails);
//     // console.log("%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&&",bottomImages[0]?.Menu_Items)
//     return (
//         <Bottom.Navigator
//             initialRouteName="Book Test"
//             screenOptions={{
//                 headerShown: false,
//                 tabBarStyle: {
//                     borderTopWidth: 0.3,
//                     borderTopColor: '#778899',
//                 },
//             }}
//         >
//             {bottomImages ? (
//                 bottomImages[0]?.Menu_Items?.map((item: any, index: any) => {
//                     return (
//                         <Bottom.Screen
//                             key={index}
//                             name={item?.Menu_Desc}
//                             component={
//                                 item?.Menu_Desc === 'Bookings'
//                                     ? BookingScreen
//                                     : item?.Menu_Desc === 'Book Test'
//                                         ? BookTestScreen
//                                         : item?.Menu_Desc === 'Dashboard'
//                                             ? DashboardScreen
//                                             : item?.Menu_Desc === 'Payments'
//                                                 ? PaymentScreen
//                                                 : item?.Menu_Desc === 'Others'
//                                                     ? OthersScreen
//                                                     : null
                                                   
//                             }
//                             options={{
//                                 tabBarIcon: ({ focused }) => (
//                                     <Image
//                                         source={
//                                             focused
//                                                 ? { uri: item.Selected_Tab_Icon_Url }
//                                                 : { uri: item.Tab_Icon_url }
//                                         }
//                                         style={{
//                                             width: 20,
//                                             height: 20,
//                                             resizeMode: 'contain',
//                                         }}
//                                     />
//                                 ),
//                                 tabBarLabelStyle: {
//                                     fontWeight: 'bold',
//                                     color: 'grey',
//                                 },
//                             }}
//                         />
//                     );
//                 })
//             )
//                 : (
//                     // <Bottom.Screen
//                     //     name="Book Test"
//                     //     component={BookTestScreen}
//                     //     options={{
//                     //         tabBarIcon: ({ focused }) => <BookTestIcon focused={focused} />,
//                     //         tabBarLabelStyle: {
//                     //             fontSize: 12,
//                     //             fontWeight: 'bold',
//                     //             color: 'grey',
//                     //         },
//                     //     }}
//                     // />
//                     <></>
//                 )
//                 }
//         </Bottom.Navigator>
//     );

// };
// export default BottomNavigation;

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

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const Bottom = createBottomTabNavigator();

const BottomNavigation = () => {
  const bottomImages = useSelector((state: RootState) => state.appSettings.AppSettingDetails);

  const fallbackMenuItems = [
    { Menu_Desc: 'Bookings', component: BookingScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Menu_Desc: 'Book Test', component: BookTestScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Menu_Desc: 'Dashboard', component: DashboardScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Menu_Desc: 'Payments', component: PaymentScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
    { Menu_Desc: 'Others', component: OthersScreen, Selected_Tab_Icon_Url: '', Tab_Icon_url: '' },
  ];

  const menuItems = bottomImages?.[0]?.Menu_Items || fallbackMenuItems;

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
          fontSize: 12,
          fontWeight: 'bold',
          color: 'grey',
        },
      }}
    >
      {menuItems.map((item: any, index: number) => {
        const Component =
          item.Menu_Desc === 'Bookings'
            ? BookingScreen
            : item.Menu_Desc === 'Book Test'
            ? BookTestScreen
            : item.Menu_Desc === 'Dashboard'
            ? DashboardScreen
            : item.Menu_Desc === 'Payments'
            ? PaymentScreen
            : item.Menu_Desc === 'Others'
            ? OthersScreen
            : null;

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
                <Text style={{ color: focused ? 'black' : 'grey', fontSize: 12 }}>
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
