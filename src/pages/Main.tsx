import React, {useEffect, useState} from 'react'
import {Text, View, Pressable, StatusBar} from 'react-native'
import {NavigationContainer, useIsFocused} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator, BottomTabBarProps} from '@react-navigation/bottom-tabs'
import Home from './Home'
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomBottomTab from '../components/CustomBottomTab';
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

import Configs from './Configs'

export type BottomTabParamList = {
  Home: undefined;
  Configs: undefined;
};

const CustomBottomTabs = (props: BottomTabBarProps) => {
  return <CustomBottomTab {...props} />;
};


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator<BottomTabParamList>()

const Tabs = () => {

  return(
    <Tab.Navigator
    initialRouteName='Home'
    tabBar={CustomBottomTabs}
    screenOptions={{
      tabBarShowLabel: false,
      title: '' ,
      headerBackground: () => (
        <View style={{flex: 1, backgroundColor: '#ffffff'}} ><Text style={{color: '#000000', textAlign: 'center', top: 15, fontSize: 20, fontWeight: 'bold',}}>My Moments</Text></View>
      )
    }}>
      <Tab.Screen 
       name='Home'
       component={Home}
       options={{headerShown: true}}/>
      
      <Tab.Screen 
            name='Configs'
            component={Configs}
            />

    </Tab.Navigator>
  )
}

const Main = (props: any) => {

  return (
    <>
    <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <NavigationContainer>
       <Stack.Navigator
       screenOptions={{ headerShown: false}}
         >
          <Stack.Screen
            name='tabs'
            component={Tabs}
          />
           <Stack.Screen
            name='configs'
            component={Configs}
            options={{
              headerShown: true
            }}
          />
          </Stack.Navigator>
      </NavigationContainer>
      </>
  )
}

export default Main