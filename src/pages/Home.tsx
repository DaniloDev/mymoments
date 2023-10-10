import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { Input } from 'react-native-elements'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import getRealm from '../services/realm'
import { MomentsProps } from '../models/Moments.interface'
import { StorysProps } from '../models/Stories.interface'
import StatusWrapper from '../components/StatusWrapper'
import dataMoment from '../dataMoment'
import { useFocusEffect } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'

import { MotiView } from 'moti'
import Calendar from 'react-native-calendars/src/calendar'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'
Ionicons.loadFont

const Home = ({ navigation, props }: any) => {
  const [goodTimes, setGoodTimes] = useState<StorysProps[]>([])
  const [routherTimes, setRoutherTimes] = useState<StorysProps[]>([])
  const [visibleGoodStories, setVisibleGoodStories] = useState(false)
  const [visibleRougherStories, setVisibleRougherStories] = useState(false)

  const [moments, setMoments] = useState([])
  const [visible, setVisible] = useState(false)

  const isFocused = useIsFocused()
  const cardPurple = require('./../assets/images/cardpurple.png')

  const [idEdit, setIdEdit] = useState(null)
  const [dateMarked, setDateMarked] = useState('')

  var selecionados: any

  const [storyDescribe, setStoryDescribe] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [disabledButtonSave, setDisabledButtonSave] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageAux, setSelectedImageAux] = useState(null)
  const [imageInBase64, setImageInBase64] = useState(null)
  const [stories, setStories] = useState<StorysProps[]>([])
  const [auxStories, setAuxStories] = useState<StorysProps[]>([])

  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  useFocusEffect(
    useCallback(() => {
      const dbName = 'Moment'
      const loadMoments = async () => {
        const realm = await getRealm()
        const data = realm.objects(dbName)
        setMoments(data)
        console.log('MOMENTS ', moments)
      }

      loadMoments()
    }, [props, isFocused])
  )

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => Alert.alert('AQUI')}>
        <MotiView
          style={styles.listContainer}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000 + index * 200 }}
        >
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="stretch"
              />
            ) : (
              <ImageBackground
                source={cardPurple}
                style={styles.imageBackground}
                resizeMode="stretch"
              >
                <Text style={{ color: '#ffffff' }}>{item.name}</Text>
              </ImageBackground>
            )}
          </View>
          <View style={{ alignContent: 'flex-start', bottom: 40 }}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.updatedAtText}>Updated {item.updatedAt}</Text>
            <Text style={styles.priceText}>{item.describe}</Text>
          </View>
        </MotiView>
      </TouchableOpacity>
    )
  }

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
        <TouchableOpacity onPress={showModal}>
          <Text style={{ textAlign: 'right', right: 20 }}>
            <Ionicons name="add-circle" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#ffffff' }}>
        <Text style={{ textAlign: 'center' }}>Moments</Text>
      </View>
      <SafeAreaView style={styles.container}>
        {/*   INICIO MODAL        */}
        <Modal visible={visible} animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            //keyboardVerticalOffset={80}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* @ts-ignore  */}
              <SafeAreaView style={[styles.container, styles.grey]}>
                <SafeAreaView
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      hideModal()
                      setStoryDescribe('')
                      //  setOptionsFeel([])
                      //setOptionsReason([])
                      setPlaceName('')
                      setSelectedImage(null)
                      setImageInBase64(null)
                      setIdEdit(null)
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#000000'
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  {idEdit !== null ? (
                    <TouchableOpacity
                      onPress={() => {}}
                      // disabled={disabledButtonSave}
                    >
                      <Text
                        style={{
                          fontSize: 18
                          //color: disabledButtonSave ? '#7673737e' : '#000000'
                        }}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {}}
                      // disabled={disabledButtonSave}
                    >
                      <Text
                        style={{
                          fontSize: 18
                          //color: disabledButtonSave ? '#7673737e' : '#000000'
                        }}
                      >
                        Save
                      </Text>
                    </TouchableOpacity>
                  )}
                </SafeAreaView>
                {/* @ts-ignore */}
                <View
                  style={{
                    alignItems: 'left',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    padding: 5
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#000000'
                    }}
                  >
                    Your story
                  </Text>

                  <Input
                    style={{
                      fontSize: 16,
                      color: '#000',
                      borderWidth: 1,
                      borderBottomWidth: 0.2,
                      marginTop: 20,
                      borderRadius: 6,
                      right: 0,
                      left: 0,
                      elevation: 0,
                      borderTopColor: '#a7a7a7',
                      borderBottomColor: '#a7a7a7',
                      borderRightColor: '#a7a7a7',
                      borderLeftColor: '#a7a7a7',
                      paddingLeft: 25,
                      paddingBottom: 20,
                      paddingRight: 25
                    }}
                    placeholder={
                      'Describe your day in one setence. Take the time to think about waht has made your day.'
                    }
                    value={storyDescribe}
                    onChangeText={(str) => setStoryDescribe(str)}
                    multiline={true}
                    cursorColor={'#000000'}
                    maxLength={50}
                    autoCapitalize={'none'}
                  />

                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 22,
                      fontWeight: 'bold'
                    }}
                  >
                    What is date?
                  </Text>

                  <Calendar
                    onDayPress={(date) => setDateMarked(date.dateString)}
                  />

                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000000'
                    }}
                  >
                    How did you feel?
                  </Text>

                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000000',
                      top: 20
                    }}
                  >
                    What was the reason?
                  </Text>

                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000000',
                      top: 30,
                      paddingBottom: 20
                    }}
                  >
                    Was thre a special place?
                  </Text>
                  <Input
                    style={{
                      fontSize: 16,
                      color: '#000',
                      borderWidth: 1,
                      borderBottomWidth: 0.2,
                      marginTop: 20,
                      borderRadius: 6,
                      right: 0,
                      left: 0,

                      elevation: 0,
                      borderTopColor: '#a7a7a7',
                      borderBottomColor: '#a7a7a7',
                      borderRightColor: '#a7a7a7',
                      borderLeftColor: '#a7a7a7',
                      paddingLeft: 25,
                      paddingBottom: 20
                    }}
                    placeholder={'type a place name'}
                    value={placeName}
                    onChangeText={(str) => setPlaceName(str)}
                    multiline={true}
                    cursorColor={'#000000'}
                    maxLength={40}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000000'
                    }}
                  >
                    Did you capture some moments?
                  </Text>

                  {selectedImage ? (
                    <View
                      style={{
                        height: 200,
                        width: '80%',
                        alignContent: 'center',
                        alignItems: 'center',
                        top: 10,
                        bottom: 6,
                        elevation: 5,
                        flexDirection: 'row'
                      }}
                    >
                      <TouchableOpacity onPress={() => setSelectedImage(null)}>
                        <Text style={{ top: 10, paddingLeft: 16 }}>
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color={'#000000'}
                          />
                        </Text>
                      </TouchableOpacity>
                      <Image
                        source={{ uri: selectedImage }}
                        style={{
                          height: 200,
                          width: '80%',
                          left: 30,
                          borderRadius: 6,
                          bottom: 5
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => {}}>
                      <View
                        style={{
                          //backgroundColor: '#dddddda7',
                          elevation: 8,
                          backgroundColor: '#ffffff',
                          alignItems: 'center',
                          alignContent: 'center',
                          width: 80,
                          height: 80,
                          padding: 12,
                          top: 8,
                          left: 120,
                          borderRadius: 6,
                          borderColor: '#000000'
                        }}
                      >
                        <Ionicons name="image" size={30} color={'#000000'} />
                        <Text>Add</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </SafeAreaView>
              {/*   FIM MODAL   */}
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <View>
          <TextInput
            style={{
              marginHorizontal: 20,
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 25,
              height: 40,
              paddingLeft: 10,
              marginTop: 5
            }}
            placeholder="Pesquisar"
            onChangeText={(str: string) => {}}
            autoCapitalize="none"
          />
          {moments && (
            <FlatList
              data={dataMoment}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={1}
              showsVerticalScrollIndicator={false}
            />
          )}
          {!moments && (
            <View
              style={{
                top: 250,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: '#000000',
                  fontSize: 20
                }}
              >
                Your moments will appear here
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    marginBottom: 150,
    paddingTop: 10
  },
  viewBlocoMoment: {
    backgroundColor: 'red',
    alignItems: 'center'
  },

  listContainer: {
    left: 25,
    width: Dimensions.get('window').width - 70,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 20,
    height: 280,
    elevation: 3
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: { width: '100%', height: '80%', top: 10, borderRadius: 6 },

  imageBackground: {
    width: '100%',
    height: '80%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    borderRadius: 6
  },
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15
  },
  updatedAtText: {
    top: 5,
    fontWeight: 'bold',
    marginLeft: 15
  },
  priceText: {
    color: 'orange',
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 20,
    bottom: 8
  },
  button: {
    backgroundColor: '#62513E',
    padding: 10,
    margin: 15,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  scrollView: {
    width: '100%'
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 50
  }
})
