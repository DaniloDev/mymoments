import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  PermissionsAndroid,
  useWindowDimensions
} from 'react-native'
import { Input } from 'react-native-elements'
import RNFS from 'react-native-fs'
import getRealm from '../services/realm'
import { MomentsProps } from '../models/Moments.interface'
import { StorysProps } from '../models/Stories.interface'
import StatusWrapper from '../components/StatusWrapper'
import dataMoment from '../dataMoment'
import { useFocusEffect } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'

import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { MotiView } from 'moti'
import Calendar from 'react-native-calendars/src/calendar'

import { getID } from '../utils/functions'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import BottomSheet from '../components/BottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'

import Ionicons from 'react-native-vector-icons/Ionicons'
import PopupMenu from '../components/PopupMenu'
Ionicons.loadFont
const Home = ({ navigation, props }: any) => {
  const SELECT_IMAGE = 'SELECT_IMAGE'
  const TAKE_PICTURE = 'TAKE_PICTURE'
  const [goodTimes, setGoodTimes] = useState<StorysProps[]>([])
  const [routherTimes, setRoutherTimes] = useState<StorysProps[]>([])
  const [visibleGoodStories, setVisibleGoodStories] = useState(false)
  const [visibleRougherStories, setVisibleRougherStories] = useState(false)

  const [moments, setMoments] = useState<MomentsProps[]>([])
  const [auxMoments, setAuxMoments] = useState<MomentsProps[]>([])

  const [visible, setVisible] = useState(false)

  const isFocused = useIsFocused()
  const cardPurple = require('./../assets/images/cardpurple.png')

  const [idEdit, setIdEdit] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageAux, setSelectedImageAux] = useState(null)
  const [imageInBase64, setImageInBase64] = useState(null)

  const [momentName, setMomentName] = useState('')
  const [dateMarked, setDateMarked] = useState<any>(null)
  const [momentDescribe, setMomentDescribe] = useState('')

  const [searchText, setSeaechText] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const { height } = useWindowDimensions()
  const bottomSheetRef = useRef()

  const pressHandler = useCallback(() => {
    bottomSheetRef.current.expand()
  }, [])

  const pressHandlerClose = useCallback(() => {
    bottomSheetRef.current.close()
  }, [])

  const getAndSetImage = (param: string) => {
    checkPermission(param)
  }
  const checkPermission = async (param) => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      //downloadFile()
      //handleDownload() CHAMA A FUNCÃO DE PEGAR IMAGEM DO CELULAR
      if (param == SELECT_IMAGE) {
        selectImage()
      } else if (param == TAKE_PICTURE) {
        takeaPicture()
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Permisson',
            message: 'We need permissson to that!'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          // downloadFile()
          //handleDownload() CHAMA A FUNCÃO DE PEGAR IMAGEM DO CELULAR
          if (param == SELECT_IMAGE) {
            selectImage()
          } else if (param == TAKE_PICTURE) {
            takeaPicture()
          }
          //console.log('Storage Permission Granted.')
          /*Alert.alert(
            translate('GenarateQrcode.permissions.alerts.success.title'),
            translate('GenarateQrcode.permissions.alerts.success.message')
          )*/
          console.log('Storage Permission Granted.')
          Alert.alert('Success', 'Permmison to acess storage')
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Permisson',
                message: 'We need permissson to that!'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Start downloading
              // downloadFile()
              //handleDownload() CHAMA A FUNCÃO DE PEGAR IMAGEM DO CELULAR
              if (param == SELECT_IMAGE) {
                selectImage()
              } else if (param == TAKE_PICTURE) {
                takeaPicture()
              }
              //console.log('Storage Permission Granted.')
              /*Alert.alert(
                  translate('GenarateQrcode.permissions.alerts.success.title'),
                  translate('GenarateQrcode.permissions.alerts.success.message')
                )*/
              console.log('Storage Permission Granted.')
              Alert.alert('Success', 'Permmison to acess storage')
            } else {
              Alert.alert('Error', 'Some Error here')
            }
          } catch (error) {}
        }
      } catch (err) {
        // To handle permission related exception
        //   console.log('++++' + err)
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user ', user)
      setUser(user)
      loadMoments()
    })
  }, [user?.uid])

  useFocusEffect(
    useCallback(() => {
      loadMoments()
    }, [props, isFocused])
  )

  const loadMoments = async () => {
    try {
      const dbName = 'Moment'
      const realm = await getRealm()
      const response = realm
        .objects<MomentsProps[]>(dbName)
        .filtered('deletedAT =' + 0)
        .filtered(`userId = '${user?.uid}'`)
        .sorted('createdAT', true)
        .toJSON()
      setMoments(response)
      setAuxMoments(response)
      console.log('MOMENTS ', moments)

      if (response.length === 0) {
        console.log('Warning', 'There are no moments yet')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Good Times', 'ERROR in Good Times')
    } finally {
      //realm.close()
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <MotiView
          style={styles.listContainer}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000 + index * 200 }}
        >
          <TouchableOpacity
            style={{ bottom: 16 }}
            onPress={() => {
              navigation.navigate('Stories', {
                moment_id: item.id
              })
              setSeaechText('')
            }}
          >
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="stretch"
                />
              ) : (
                <ImageBackground
                  source={cardPurple}
                  style={styles.imageBackground}
                  resizeMode="stretch"
                >
                  <Text style={{ color: '#ffffff', bottom: 10 }}>
                    {item.name}
                  </Text>
                </ImageBackground>
              )}
            </View>
            <View
              style={{
                alignContent: 'flex-start',
                bottom: item.image ? 40 : 70,
                left: 10
              }}
            >
              <Text style={styles.nameText}>{item.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  style={{ top: 6, paddingLeft: 16 }}
                  name="calendar-sharp"
                  size={18}
                  color={'#154'}
                />
                <Text style={styles.dateText}>
                  {
                    format(item.date, 'EEEE, MMM dd, yyyy')
                    /*formatDistance(new Date(item.updatedAT), new Date(), {
                locale: undefined,
                addSuffix: false
              })*/

                    /* item.date
                  .toISOString()
                  .substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('-')*/
                  }
                </Text>
              </View>
              <Text style={styles.describeText}>{item.describe}</Text>
            </View>
          </TouchableOpacity>
        </MotiView>

        <View style={{ flexDirection: 'column' }}>
          <TouchableOpacity
            onPress={() => {
              setIdEdit(item.id)
              setMomentName(item.name)
              setDateMarked(item.date.toISOString().substr(0, 10))
              setMomentDescribe(item.describe)
              setSelectedImage(item.image)
              setSelectedImageAux(item.image)
              setImageInBase64(item.image)
              showModal()
            }}
          >
            <Text style={{ top: 30, left: 12 }}>
              <Ionicons name="pencil" size={20} color={'#154'} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert('Delete', 'Are you sure to delete that ? ', [
                {
                  text: 'Cancel',
                  onPress: () => {}
                },
                {
                  text: 'OK',
                  onPress: () => {
                    deleteMoment(item.id)
                    loadMoments()
                  }
                }
              ])
            }}
          >
            <Text style={{ top: 44, left: 12 }}>
              <Ionicons name="trash" size={20} color={'#154'} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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

  const removeAccent = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const searchMoments = (str: string) => {
    setSeaechText(str)
    const arrMoments = auxMoments

    console.log('searchMoments ', auxMoments)
    str = removeAccent(str).toUpperCase()
    setMoments(
      arrMoments.filter(
        (s) =>
          removeAccent(s.name).toUpperCase().includes(str) ||
          removeAccent(s.describe).toUpperCase().includes(str)
      )
    )
  }

  const filterFeelEmojis = (id: string) => {
    if (id.length > 0) {
      let feelEmojis = [
        { text: '😄', id: 'awesome' },
        { text: '😊', id: 'pretty_good' },
        { text: '😐', id: 'quite_ok' },
        { text: '😔', id: 'kind_of_bad' },
        { text: '😥', id: 'horrible' }
      ]

      let sendFeelEmojis = feelEmojis.filter((element) => element.id === id)

      return sendFeelEmojis[0].text
    }
  }

  const filterReasonEmojis = (id: string) => {
    if (id.length > 0) {
      let reasonEmojis = [
        { text: '👪', id: 'family' },
        { text: '🍲', id: 'food' },
        { text: '👬', id: 'friends' },
        { text: '👨🏼‍⚕️', id: 'health' },
        { text: '🪂', id: 'hobbies' },
        { text: '🚴', id: 'sport' },
        { text: '💼', id: 'work' },
        { text: '❤️', id: 'relationship' }
      ]

      let sendReasonEmojis = reasonEmojis.filter((element) => element.id === id)

      return sendReasonEmojis[0].text
    }
  }

  const saveMoment = async (data: MomentsProps) => {
    const realm = await getRealm()
    const dbName = 'Moment'
    const id = await getID(22)

    const dadosMoment = {
      id: id,
      userId: data.userId,
      name: data.name,
      describe: data.describe,
      image: data.image,
      date: data.date,
      createdAT: data.createdAT,
      updatedAT: data.updatedAT,
      deletedAT: data.deletedAT
    }
    realm.write(() => {
      realm.create(dbName, dadosMoment)
    })

    loadMoments()
  }

  const selectImage = async () => {
    pressHandlerClose()
    launchImageLibrary(
      {
        title: 'Selecione uma imagem',
        storageOptions: {
          //skipBackup: true,
          path: 'images'
        }
      },
      (response) => {
        // console.log('RES{ONSE', response)
        if (response.didCancel) {
          console.log('Seleção de imagem cancelada')
          setSelectedImage(selectedImageAux)
        } else if (response.error) {
          console.error('Erro ao selecionar imagem:', response.error)
        } else {
          console.log('RESPONSE IN selectImage ', response)
          setSelectedImage(response.assets[0].uri)
          setSelectedImageAux(response.assets[0].uri)
          const imagePath = response.assets[0].originalPath
          RNFS.readFile(imagePath, 'base64').then((base64String) => {
            setImageInBase64(
              `data:${response.assets[0].type};base64,${base64String}`
            )
            // console.log('IMAGEINBASE64 ', imageInBase64)
          })
        }
      }
    )
  }

  const takeaPicture = async () => {
    pressHandlerClose()
    launchCamera(
      {
        title: 'Selecione uma imagem',
        storageOptions: {
          //skipBackup: true,
          path: 'images'
        }
      },
      (response) => {
        // console.log('RES{ONSE', response)
        if (response.didCancel) {
          console.log('Seleção de imagem cancelada')
          setSelectedImage(selectedImageAux)
        } else if (response.error) {
          console.error('Erro ao selecionar imagem:', response.error)
        } else {
          console.log('RESPONSE IN selectImage ', response)
          setSelectedImage(response.assets[0].uri)
          setSelectedImageAux(response.assets[0].uri)
          const imagePath = response.assets[0].originalPath
          RNFS.readFile(imagePath, 'base64').then((base64String) => {
            setImageInBase64(
              `data:${response.assets[0].type};base64,${base64String}`
            )
            // console.log('IMAGEINBASE64 ', imageInBase64)
          })
        }
      }
    )
  }

  const handleCanSave = async () => {
    if (momentName.trim().toString().length >= 6) {
      try {
        const data = {
          userId: user?.uid,
          name: momentName,
          describe: momentDescribe,
          image: imageInBase64,
          date: dateMarked == null ? new Date() : new Date(dateMarked),
          createdAT: new Date(),
          updatedAT: new Date(),
          deletedAT: 0
        }

        await saveMoment(data)

        setMomentName('')
        setMomentDescribe('')
        setDateMarked(null)
        setSelectedImage(null)
        setImageInBase64(null)
        hideModal()
        Keyboard.dismiss()
        Alert.alert('Success', 'Nice')
      } catch (err) {
        Alert.alert(err)
      }
    } else {
      Alert.alert(
        'Error',
        'Fill in the  "Your MOMENT" field which must have at least 6 characters and select "How did you feel"'
      )
    }
  }

  const updateMoment = async () => {
    if (idEdit === null) {
      Alert.alert('Você não pode editar!')
      return
    }

    const realm = await getRealm()
    const dbName = 'Moment'
    const response = {
      id: idEdit,
      name: momentName,
      describe: momentDescribe,
      image: imageInBase64,
      date: dateMarked == null ? new Date() : new Date(dateMarked),
      updatedAT: new Date()
    }

    await realm.write(() => {
      realm.create(dbName, response, 'modified')
    })

    setIdEdit(null)
    // setCanEdited(false)
    setMomentName('')
    setDateMarked(null)
    setMomentDescribe('')
    setSelectedImage(null)
    setImageInBase64(null)
    hideModal()
    loadMoments()
    Keyboard.dismiss()
  }

  const deleteMoment = async (id: string) => {
    const dbName = 'Moment'
    const realm = await getRealm()

    realm.write(() => {
      let moment = realm.objects(dbName).filtered(`id = '${id}'`)
      if (moment.length > 0) {
        const response = {
          id: id,
          name: moment[0].name,
          describe: moment[0].describe,
          image: moment[0].image,
          date: moment[0].date,
          updatedAT: moment[0].updatedAT,
          deletedAT: 1
        }
        //realm.delete(realm.objects(dbName).filtered(`id = '${id}'`))

        realm.create(dbName, response, 'modified')
      }
    })
  }

  const toDoBackup = () => {
    const uid = user?.uid
    const momentsArray = moments

    fetch()
  }

  return (
    <>
      <View
        style={{
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}
      >
        <TouchableOpacity onPress={showModal}>
          <Text style={{}}>
            <Ionicons name="add-circle" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
        <PopupMenu />
      </View>
      <View style={{ backgroundColor: '#ffffff' }}>
        <Text
          style={{
            textAlign: 'left',
            left: 30,
            fontWeight: 'bold',
            fontSize: 32
          }}
        >
          Moments
        </Text>
      </View>
      <SafeAreaView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          activeHeight={height * 0.5}
          backgroundColor={'white'}
          backDropColor={'black'}
        />
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
                      setMomentName('')
                      setMomentDescribe('')
                      setDateMarked(null)
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
                      onPress={() => updateMoment()}
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
                      onPress={() => handleCanSave()}
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
                    Moment Name
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
                      'Give a name to your Moment Name to identification'
                    }
                    value={momentName}
                    onChangeText={(str) => setMomentName(str)}
                    multiline={true}
                    cursorColor={'#000000'}
                    maxLength={31}
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
                    initialDate={
                      dateMarked == null
                        ? new Date().toISOString().substr(0, 10)
                        : new Date(dateMarked).toISOString().substr(0, 10)
                    }
                    onDayPress={(date) => setDateMarked(date.dateString)}
                    markingType="multi-dot"
                    markedDates={{
                      [dateMarked]: {
                        selected: true,
                        selectedColor: '#8c04bd',
                        selectedTextColor: 'white',
                        marked: true
                      }
                    }}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#00adf5',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#00adf5',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e'
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#000000',
                      top: 30,
                      paddingBottom: 20
                    }}
                  >
                    Descripition
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
                    placeholder={'Describe that moment'}
                    value={momentDescribe}
                    onChangeText={(str) => setMomentDescribe(str)}
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
                    <TouchableOpacity onPress={() => pressHandler()}>
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
          <BottomSheet
            ref={bottomSheetRef}
            activeHeight={height * 0.5}
            backgroundColor={'white'}
            backDropColor={'black'}
          >
            <Text style={{ textAlign: 'center', fontSize: 22 }}>
              Choose the option below :
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
              <TouchableOpacity onPress={() => pressHandlerClose()}>
                <View
                  style={{
                    top: 40,
                    width: 100,
                    padding: 6,
                    borderRadius: 7,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column',
                    left: 20,
                    alignContent: 'center',
                    alignItems: 'center',
                    height: '50%'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 40 }}
                    name="close-circle"
                    size={32}
                    color={'red'}
                  />
                  <Text style={{ fontSize: 13, bottom: 30 }}>Cancel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => getAndSetImage(SELECT_IMAGE)}>
                <View
                  style={{
                    top: 40,
                    width: 100,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column',
                    left: 20,
                    alignContent: 'center',
                    alignItems: 'center',
                    height: '50%'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 40 }}
                    name="image"
                    size={32}
                    color={'#000000'}
                  />
                  <Text style={{ fontSize: 13, bottom: 30 }}>
                    Select a Image
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => getAndSetImage(TAKE_PICTURE)}>
                <View
                  style={{
                    top: 40,
                    width: 100,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    elevation: 3,
                    borderColor: '#000000',
                    flexDirection: 'column',
                    left: 20,
                    alignContent: 'center',
                    alignItems: 'center',
                    height: '50%'
                  }}
                >
                  <Ionicons
                    style={{ paddingBottom: 50 }}
                    name="camera"
                    size={32}
                    color={'#000000'}
                  />
                  <Text style={{ fontSize: 13, bottom: 30 }}>
                    Take a picture
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        </Modal>

        <View>
          <TextInput
            style={{
              marginHorizontal: 20,
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 25,
              height: 40,
              paddingLeft: 10
            }}
            value={searchText}
            placeholder="Pesquisar"
            onChangeText={(str: string) => searchMoments(str)}
            autoCapitalize="none"
          />
          {moments.toString().length > 0 && (
            <FlatList
              data={moments}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={1}
              showsVerticalScrollIndicator={false}
            />
          )}
          {moments.toString().length == 0 && (
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
    backgroundColor: '#ffffff',
    padding: 10,
    paddingBottom: 50
  },
  viewBlocoMoment: {
    backgroundColor: 'red',
    alignItems: 'center'
  },

  listContainer: {
    left: 15,
    width: Dimensions.get('window').width - 70,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 20,
    height: 280,
    elevation: 3,
    padding: 10
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: { width: '95%', height: '75%', top: 10, borderRadius: 6, left: 10 },

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
  dateText: {
    top: 5,
    fontWeight: 'bold',
    marginLeft: 5
  },
  describeText: {
    color: '#6d20dab8',
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
  grey: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    bottom: 14,
    top: 14,
    elevation: 3
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 50
  }
})
