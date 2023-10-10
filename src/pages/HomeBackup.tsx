import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Image, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import getRealm from '../services/realm'
import { format, formatDistance } from 'date-fns'
import { StorysProps } from '../models/Stories.interface'
import StatusWrapper from '../components/StatusWrapper'

import { useFocusEffect } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'

import { anyNumber, frases } from '../frases'

import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

const Home = ({ navigation, props }: any) => {
  const [daylyMotivation, setDaylyMotivation] = useState('')
  const [goodTimes, setGoodTimes] = useState<StorysProps[]>([])
  const [routherTimes, setRoutherTimes] = useState<StorysProps[]>([])
  const [visibleGoodStories, setVisibleGoodStories] = useState(false)
  const [visibleRougherStories, setVisibleRougherStories] = useState(false)

  const [stories, setStories] = useState([])

  const [dateFormated, setDateFormated] = useState('')

  const isFocused = useIsFocused()

  useFocusEffect(
    useCallback(() => {
      const dbName = 'Story'
      const loadStories = async () => {
        const realm = await getRealm()
        const data = realm.objects(dbName)
        const setInStories = data[data.length - 1]
        setStories(setInStories)
        console.log('new Date()', new Date().toString().substring(0, 15))
        console.log('stories.date', stories.date.toString().substring(0, 15))
      }

      loadStories()
    }, [props, isFocused])
  )

  const getGoodTimes = async () => {
    setVisibleGoodStories(true)
    const realm = await getRealm()

    try {
      const goodTime = 'goodTime'
      const response = realm
        .objects<StorysProps[]>('Story')
        .filtered(`emojiCategory = '${goodTime}'`)
        .sorted('date')
        .toJSON()

      console.log(' GOOD TIMES ', response)
      console.log(' GOOD TIMES LENGTH ', response.length)
      setGoodTimes(response)
      //console.log('allStories in getGoodTimes ', allStories)
      if (response.length === 0) {
        Alert.alert('Warning', 'There are no good times yet')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Good Times', 'ERROR in Good Times')
    } finally {
      //realm.close()
    }
  }

  const getRougherTimes = async () => {
    setVisibleRougherStories(true)
    const realm = await getRealm()

    try {
      const rougherTime = 'rougherTime'
      const response = realm
        .objects<StorysProps[]>('Story')
        .filtered(`emojiCategory = '${rougherTime}'`)
        .sorted('date')
        .toJSON()

      console.log(' ROUGHER TIMES ', response)
      console.log(' ROUGHER TIMES LENGTH ', response.length)
      setRoutherTimes(response)

      if (response.length === 0) {
        Alert.alert('Warning', 'There are no rougher times yet')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Rougher Times', 'ERROR in Rougher Times')
    } finally {
      //   realm.close()
    }
  }

  const filterFeelEmojis = (id: string) => {
    if (id?.toString().length > 0) {
      let feelEmojis = [
        { text: '😄 Awesome', id: 'awesome' },
        { text: '😊 Pretty good', id: 'pretty_good' },
        { text: '😐 Quite OK', id: 'quite_ok' },
        { text: '😔 Kind of bad', id: 'kind_of_bad' },
        { text: '😥 Horrible', id: 'horrible' }
      ]

      let sendFeelEmojis = feelEmojis.filter((element) => element.id === id)

      return sendFeelEmojis[0].text
    }
  }

  const filterReasonEmojis = (id: string) => {
    if (id?.toString().length > 0) {
      let reasonEmojis = [
        { text: '👪 Family', id: 'family' },
        { text: '🍲 Food', id: 'food' },
        { text: '👬 Friends', id: 'friends' },
        { text: '👨🏼‍⚕️ Health', id: 'health' },
        { text: '🪂 Hobbies', id: 'hobbies' },
        { text: '🚴 Sport', id: 'sport' },
        { text: '💼 Work', id: 'work' },
        { text: '❤️ Relationship', id: 'relationship' }
      ]

      let sendReasonEmojis = reasonEmojis.filter((element) => element.id === id)

      return sendReasonEmojis[0].text
    }
  }
  return (
    <>
      <View style={{ backgroundColor: '#ffffff' }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('configs', {
              users: [
                {
                  name: 'Danilo Santos Nascimento',
                  email: 'danisn2010@gmail.com',
                  cpf: '857.734.645-51'
                }
              ]
            })
          }
        >
          <Text style={{ textAlign: 'right', right: 20 }}>
            <MaterialIcons name="settings" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textmyDay}> My day</Text>
        </View>

        {/*  <Input 
                style={{fontSize: 16, paddingRight: 40, color: '#000'}}
                placeholder='Digite uma frase que te motive'
                placeholderTextColor={'#a7a7a7'}
                value={daylyMotivation}
                multiline={true}
                onChangeText={str => setDaylyMotivation(str)}
                maxLength={200}
                cursorColor={'#000'}
    />*/}

        <View style={{ flexDirection: 'row', top: 25 }}>
          <Ionicons
            name="sunny-outline"
            size={20}
            color="#9a9a9a"
            style={{ paddingLeft: 28 }}
          />
          <Text style={styles.infophaseMototivation}> DAILY MOTIVATION</Text>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <Text style={{ top: 30, paddingLeft: 32 }}>
            {'"' +
              frases[anyNumber].frase +
              '"' +
              ' ' +
              '-' +
              ' ' +
              frases[anyNumber].autor}
          </Text>
        </View>

        <View style={{ top: 50, paddingLeft: 20 }}>
          {stories &&
          stories?.date?.toString().substring(0, 15) ==
            new Date().toString().substring(0, 15) ? (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="journal-outline"
                  size={20}
                  color="#9a9a9a"
                  style={{ paddingLeft: 12 }}
                />
                <Text style={styles.dateWithImage}>
                  {format(Date.now(stories.date), 'EEEE, MMM dd, yyyy')}
                </Text>
              </View>
              <Text style={styles.textDecribeWithImage}>
                {stories.describe}
              </Text>
              <Text style={styles.placeWithImage}>{stories.placeName}</Text>

              <View style={styles.emojiViewContainer}>
                <View style={styles.emojisView}>
                  <Text style={styles.emojisText}>
                    {filterFeelEmojis(stories.feel)}
                  </Text>
                </View>
                <View style={styles.emojisView}>
                  <Text style={styles.emojisText}>
                    {filterReasonEmojis(stories.reason)}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ left: 4 }}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="journal-outline"
                  size={20}
                  color="#9a9a9a"
                  style={{ paddingLeft: 12 }}
                />
                <Text> {format(Date.now(), 'EEEE, MMM dd, yyyy')}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Stories', {
                    open: true
                  })
                }
                style={{
                  backgroundColor: '#bbbbbb52',
                  height: '50%',
                  width: '80%',
                  left: 14,
                  top: 5,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Ionicons
                  name="journal-outline"
                  size={20}
                  color="#9a9a9a"
                  style={{ paddingLeft: 12 }}
                />

                <Text style={{ textAlign: 'center', color: '#9a9a9a' }}>
                  Add my story of the day
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              bottom:
                stories &&
                stories?.date?.toString().substring(0, 15) ==
                  new Date().toString().substring(0, 15)
                  ? 10
                  : 0,

              top:
                stories &&
                stories?.date?.toString().substring(0, 15) ==
                  new Date().toString().substring(0, 15)
                  ? 20
                  : -190,
              paddingLeft: 15
            }}
          >
            <Text
              style={{ fontSize: 28, fontWeight: 'bold', color: '#000000' }}
            >
              Reflect on my life
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                right: 30,
                top: 20,
                paddingLeft: 22
              }}
            >
              <TouchableOpacity onPress={getGoodTimes}>
                <View
                  style={{
                    width: 100,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 50 }}
                    name="happy-outline"
                    size={32}
                    color={'#000000'}
                  />
                  <Text>My good</Text>
                  <Text>times</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={getRougherTimes}>
                <View
                  style={{
                    width: 100,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 50 }}
                    name="sad-outline"
                    size={32}
                    color={'#000000'}
                  />
                  <Text>My rougher</Text>
                  <Text>times</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log('MY HAPPY PLACES')
                }}
              >
                <View
                  style={{
                    width: 100,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 50 }}
                    name="map-outline"
                    size={32}
                    color={'#000000'}
                  />
                  <Text>My happy</Text>
                  <Text>places</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {visibleGoodStories && goodTimes.length > 0 && (
        <StatusWrapper
          statusData={goodTimes}
          visible={visibleGoodStories}
          onClose={(data: Boolean) => setVisibleGoodStories(false)}
        />
      )}

      {visibleRougherStories && routherTimes.length > 0 && (
        <StatusWrapper
          statusData={routherTimes}
          visible={visibleRougherStories}
          onClose={(data: Boolean) => setVisibleRougherStories(false)}
        />
      )}
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  textmyDay: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 25
  },
  infophaseMototivation: {
    top: 3,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#9a9a9a',
    left: 6
  },
  textAwesome: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Times New Roman',
    paddingLeft: 15,
    paddingRight: 30,
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10,
    borderWidth: 0.1,
    width: 140,
    height: 26,
    backgroundColor: '#c4c1ac85',
    right: 20,
    left: 20,
    top: 40,
    marginRight: 10
  },

  textFamily: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Times New Roman',
    paddingLeft: 15,
    paddingRight: 30,

    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 10,
    borderWidth: 0.1,
    width: 140,
    height: 26,
    backgroundColor: '#c4c1ac85',
    right: 20,
    left: 20,
    top: 40
  },

  dateWithImage: {
    color: '#bbbbbb',
    left: 6,
    bottom: 2,
    paddingBottom: 4
  },
  textDecribeWithImage: {
    color: '#000000',
    left: 10,
    paddingBottom: 8
  },
  placeWithImage: {
    color: '#eb705f',
    left: 10,
    paddingBottom: 4
  },
  emojiViewContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  emojisView: {
    top: 8,
    left: 10,
    width: 122,
    marginBottom: 8,
    height: 36,
    borderRadius: 6,
    borderWidth: 2,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    color: '#555',
    marginRight: 8
  },
  emojisText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
    padding: 5,
    textAlign: 'center'
  }
})
