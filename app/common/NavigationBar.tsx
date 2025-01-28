import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from '../util/Constants';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const NavigationBar = ({ title }: any) => {
  const navigation = useNavigation();
  const _showProfileIcon = () => {
    return (
      <Image
        style={[
          styles.headerRightImage,
          {
            width: deviceHeight / 30,
            height: deviceHeight / 30,
            borderRadius: deviceHeight / 30,
            marginEnd: 5,
          },
        ]}
        source={require('../images/user_white.png')}
      />
    );
  };

  const _navigateSOSScreen = () => {
    // Navigate to SOS Screen
    navigation.navigate('SosAlert');
  };

  const _navigateNotificationScreen = () => {
    // Navigate to Notification Screen
    navigation.navigate('Notification');
  };

  const _navigateProfileScreen = () => {
    // Navigate to Profile Screen
    navigation.navigate('Profile');
  };

  const _renderNotificationCount = () => {
    return (
      <View
        style={{
          backgroundColor:'#3d9972',
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 15,
          position: 'absolute',
          left: 9,
          bottom: 9,
          marginLeft: 25,
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.XXS,
            alignItems: 'center',
            textAlign: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            textAlignVertical: 'center',
            color: 'white',
          }}>
          3
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN }}>
      <View style={styles.container}>
        <View style={styles.leftView}>
          {/* Displaying the title */}
          <Text style={styles.headingText}>{title}</Text>
        </View>
        <View style={styles.rightView}>
          <TouchableOpacity onPress={_navigateSOSScreen}>
            <Image
              style={[
                styles.headerRightImage,
                {
                  width: deviceHeight / 25,
                  height: deviceHeight / 25,
                  marginBottom: 8,
                },
              ]}
              source={require('../images/alarm.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={_navigateNotificationScreen}>
            <View>
              <Image
                style={[
                  styles.headerRightImage,
                  { width: deviceHeight / 30, height: deviceHeight / 30 },
                ]}
                source={require('../images/bellwhite.png')}
              />
            </View>
            {_renderNotificationCount()}
          </TouchableOpacity>

          <TouchableOpacity onPress={_navigateProfileScreen}>
            {_showProfileIcon()}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 64 : 58,
    flexDirection: 'row',
    backgroundColor: '#3d9972',
    borderBottomWidth: 2,
    borderBottomColor: '#3d9972',
  },
  leftView: {
    flex: 3,
  },
  rightView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headingText: {
    color: '#FFFFFF',
    fontSize: Constants.FONT_SIZE.XL,
  },
  headerRightImage: {
    marginLeft: 25,
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
});

export default NavigationBar;

