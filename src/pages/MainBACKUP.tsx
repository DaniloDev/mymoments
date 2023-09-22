import React, {useEffect, useState} from 'react'
import {Text, View, Pressable, StatusBar} from 'react-native'
import {NavigationContainer, useIsFocused} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator, BottomTabBarProps} from '@react-navigation/bottom-tabs'
import Home from './Home'
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

import Configs from './Configs'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()


export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Setting: undefined;
  Profile: undefined;
};


const CustomBottomTabs = (props: BottomTabBarProps) => {
  return <CustomBottomTab {...props} />;
};


const Tabs = () => {

  return(
    <Tab.Navigator
    initialRouteName='My Moments'
    screenOptions={{
      //tabBarActiveTintColor: '#04131bb3',
      tabBarActiveTintColor: '#282a36',
      tabBarInactiveTintColor: '#160404d6',
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
       // backgroundColor: '#d7d7d785',
       backgroundColor: '#d7d7d771',
        borderTopWidth: 0,

        bottom: 10,
        left: 10,
        right: 10,
        elevation: 3,
        paddingBottom: 35,
       
        borderEndStartRadius:90,
        borderStartEndRadius: 80,
        borderBottomStartRadius: 40,
        borderBottomEndRadius: 40,

        height: 80,
        shadowColor: 'transparent',
        borderTopColor: 'transparent'

      },
      title: '' ,
      headerTintColor: '#000000',
      headerTitleAlign: 'center',
      headerBackground: () => (
        <View style={{flex: 1, backgroundColor: '#ffffff'}} ><Text style={{color: '#000000', textAlign: 'center', top: 15, fontSize: 20, fontWeight: 'bold',}}>My Moments</Text></View>
      )
    }}>

      <Tab.Screen 
       name='Home'
       component={Home}
       options={{
        headerShown: false,
        tabBarIcon:({ color, size, focused}) => {

          if(focused){
            return <Ionicons name='sunny' size={size} color={color}/>
          }
          return <Ionicons name='sunny-outline' size={size} color={color}/>
          
          
        },
      headerRight: props => 
       
      <TouchableOpacity
      onPress={() =>  console.log("COLE")}
      style={{ paddingRight: 10}}
      >
            <View><Text><Ionicons name='ellipsis-vertical' size={25} color={'#000000'}/></Text></View>
      </TouchableOpacity>
       
        
      
      }}
      />


      
<Tab.Screen 
       name='Configs'
       component={Configs}
       options={{
    
      tabBarIcon:({ color, size, focused}) => {

        if(focused){
          return <Ionicons name='settings' size={size} color={color}/>
        }
        return <Ionicons name='settings-outline' size={size} color={color}/>
        
        
      },
      headerRight: props => 
       
      <TouchableOpacity
      onPress={() =>  console.log("COLE")}
      style={{ paddingRight: 10}}
      >
            <View><Text><Icon name='dots-vertical' size={25} color={'#000000'}/></Text></View>
      </TouchableOpacity>
       
        
      
      }}
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