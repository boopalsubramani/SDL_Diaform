//Data as Static

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import NavigationBar from '../common/NavigationBar';
// import Constants from '../util/Constants';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/Store';


// const deviceHeight = Dimensions.get('window').height;

// const OthersScreen = ({ navigation }: any) => {

//   const bottomImages = useSelector((state: RootState) => state.appSettings.AppSettingDetails);

//   const settingsData = [
//     {
//       id: '1',
//       backgroundColor: '#696A6D',
//       icon: require('../images/code-branch1.png'),
//       text: 'Transaction',
//     },
//     {
//       id: '2',
//       backgroundColor: '#1E564A',
//       icon: require('../images/user1.png'),
//       text: 'Collection',
//     },
//     {
//       id: '3',
//       backgroundColor: '#af794e',
//       icon: require('../images/location.png'),
//       text: 'Ledger Details',
//     },
//     {
//       id: '4',
//       backgroundColor: '#e92e40',
//       icon: require('../images/sign-out.png'),
//       text: 'Logout',
//     },
//   ];

//   const handleSettingItemPress = (item: any) => {
//     switch (item.text) {
//       case 'Transaction':
//         navigation.navigate('Transaction');
//         break;
//       case 'Collection':
//         navigation.navigate('Collection');
//         break;
//       case 'Ledger Details':
//         navigation.navigate('Login');
//         break;
//       case 'Logout':
//         navigation.navigate('Login');
//         break;
//       default:
//         break;
//     }
//   };


//   const renderItem = ({ item }: any) => (
//     <TouchableOpacity onPress={() => handleSettingItemPress(item)}>
//       <View style={styles.itemContainer}>
//         <View
//           style={{
//             backgroundColor: item.backgroundColor,
//             paddingVertical: 10,
//             paddingHorizontal: 10,
//             borderRadius: 5,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Image source={item.icon} style={styles.CodeBranchImg} />
//         </View>
//         <Text style={{
//           flex: 1,
//           paddingHorizontal: 20,
//           fontSize: Constants.FONT_SIZE.L,
//           fontFamily: "Poppins-Regular",
//         }}>{item.text}</Text>
//         <Image
//           source={require('../images/rightArrow.png')}
//           style={styles.ArrowImg}
//         />
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <NavigationBar title='Others' />
//       <FlatList
//         data={settingsData}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
//   },
//   itemContainer: {
//     paddingHorizontal: 25,
//     paddingVertical: 10,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   CodeBranchImg: {
//     width: deviceHeight / 35,
//     height: deviceHeight / 35,
//     resizeMode: 'contain',
//     tintColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN
//   },
//   ArrowImg: {
//     width: deviceHeight / 35,
//     height: deviceHeight / 35,
//     resizeMode: "contain"
//   },
// });

// export default OthersScreen;




//Data from Api

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const deviceHeight = Dimensions.get('window').height;

const OthersScreen = ({ navigation }: any) => {
  const [othersSubMenu, setOthersSubMenu] = useState<any[]>([]);

  const bottomImages = useSelector((state: RootState) => state.appSettings.AppSettingDetails);

  useEffect(() => {
    const menuItems = bottomImages?.[0]?.Menu_Items || [];
    const othersMenu = menuItems.find((item: any) => item.Menu_Desc === 'Others');
    if (othersMenu) {
      setOthersSubMenu(othersMenu.Sub_Menu_Items);
    }
  }, [bottomImages]);


    const handleSettingItemPress = (item: any) => {
    switch (item.Menu_Desc) {
      case 'Transaction':
        navigation.navigate('Transaction');
        break;
      case 'Collection':
        navigation.navigate('Collection');
        break;
      case 'Ledger Details':
        navigation.navigate('Login');
        break;
      case 'Logout':
        navigation.navigate('Login');
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item }: any) => {
    // const imageSource = item.Tab_Icon_url ? { uri: item.Tab_Icon_url } : require('../images/sign-out.png');
    return (
      <TouchableOpacity onPress={() => handleSettingItemPress(item)}>
        <View style={styles.itemContainer}>
          <View
            style={{
              backgroundColor: item.backgroundColor,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image source={imageSource} style={styles.CodeBranchImg} /> */}
            <Image source={{ uri: item.Tab_Icon_url }} style={styles.CodeBranchImg} />
          </View>
          <Text style={styles.itemText}>{item.Menu_Desc}</Text>
          <Image
            source={require('../images/rightArrow.png')}
            style={styles.ArrowImg}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <NavigationBar title="Others" />
      <FlatList
        data={othersSubMenu}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  CodeBranchImg: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    resizeMode: 'contain',
  },
  ArrowImg: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    resizeMode: 'contain',
  },
  itemText: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: Constants.FONT_SIZE.L,
    fontFamily: 'Poppins-Regular',
  },
});

export default OthersScreen;
