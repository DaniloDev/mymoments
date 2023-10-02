import React, { useEffect, useState } from 'react'
import { Text, View, Pressable, StatusBar, Alert } from 'react-native'
import {
  NavigationContainer,
  useIsFocused,
  useNavigation
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  createBottomTabNavigator,
  BottomTabBarProps
} from '@react-navigation/bottom-tabs'
import Home from './Home'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomBottomTab from '../components/CustomBottomTab'

import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

import Configs from './Configs'
import Stories from './Stories'
import StoryView from './StoryView'
import getRealm from '../services/realm'

export type BottomTabParamList = {
  Home: undefined
  Stories: undefined
}

const CustomBottomTabs = (props: BottomTabBarProps) => {
  return <CustomBottomTab {...props} />
}

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator<BottomTabParamList>()

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={CustomBottomTabs}
      screenOptions={{
        tabBarShowLabel: false,
        title: '',
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Text
              style={{
                color: '#000000',
                textAlign: 'center',
                top: 15,
                fontSize: 20,
                fontWeight: 'bold'
              }}
            >
              My Moments
            </Text>
          </View>
        )
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Stories"
        component={Stories}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  )
}

const Main = () => {
  const deleteStory = async (id: string) => {
    const dbName = 'Story'
    const realm = await getRealm()

    realm.write(() => {
      if (realm.objects(dbName).filtered('id =' + id).length > 0) {
        realm.delete(realm.objects(dbName).filtered('id =' + id))
      }
    })
  }
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="tabs" component={Tabs} />
          <Stack.Screen
            name="Configs"
            component={Configs}
            options={{
              headerShown: true
            }}
          />
          <Stack.Group
            screenOptions={({ navigation, route }) => ({
              presentation: 'modal',
              headerRight: () => (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Stories', {
                        storyEdit: [
                          {
                            id: route.params.story[0].id,
                            image: route.params.story[0].image,
                            date: route.params.story[0].date,
                            describe: route.params.story[0].describe,
                            placeName: route.params.story[0].placeName,
                            feel: route.params.story[0].feel,
                            reason: route.params.story[0].reason
                          }
                        ]
                      })
                    }
                  >
                    <Text>
                      <Ionicons name="pencil" size={24} color={'#000000'} />
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Delete', 'Are you sure to delete that ?', [
                        {
                          text: 'Cancel',
                          onPress: () => {}
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            deleteStory(route.params.story[0].id)
                            navigation.navigate('Stories')
                          }
                        }
                      ])
                    }}
                  >
                    <Text style={{ right: 5, paddingLeft: 10 }}>
                      <Ionicons name="trash" size={24} color={'#000000'} />
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          >
            <Stack.Screen
              name="StoryView"
              component={StoryView}
              options={{
                title: 'Story View',
                headerShown: true
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default Main
