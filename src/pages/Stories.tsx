import React, { useState, useCallback, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  PermissionsAndroid,
  Image,
  Keyboard,
  LogBox,
  useWindowDimensions
} from 'react-native'
import { formatDistance } from 'date-fns'
import { MotiView } from 'moti'
import { Input } from 'react-native-elements'
import CheckBoxFeel from '../components/CheckBoxFeel'
import CheckBoxReason from '../components/CheckBoxReason'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { StorysProps } from '../models/Stories.interface'
import getRealm from '../services/realm'
import { getID } from '../utils/functions'
import { useFocusEffect } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import RNFS from 'react-native-fs'

import Calendar from 'react-native-calendars/src/calendar'

import { TextInput } from 'react-native-gesture-handler'
import StatusWrapper from '../components/StatusWrapper'
import BottomSheet from '../components/BottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

LogBox.ignoreAllLogs(true)

const Stories = (props: any) => {
  const SELECT_IMAGE = 'SELECT_IMAGE'
  const TAKE_PICTURE = 'TAKE_PICTURE'
  var selecionados: any
  const [visible, setVisible] = useState(false)
  const [canEdited, setCanEdited] = useState(false)
  const [storyDescribe, setStoryDescribe] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [searchText, setSearchText] = useState('')
  const [disabledButtonSave, setDisabledButtonSave] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageAux, setSelectedImageAux] = useState(null)
  const [imageInBase64, setImageInBase64] = useState(null)
  const [stories, setStories] = useState<StorysProps[]>([])
  const [auxStories, setAuxStories] = useState<StorysProps[]>([])

  const [visibleStories, setVisibleStories] = useState(false)
  const [moment_Id, setMoment_Id] = useState('')

  const [changeStory, setChangeStory] = useState('')

  const [openModal, setOpenModal] = useState(false)

  const [dateMarked, setDateMarked] = useState('')

  const [idEdit, setIdEdit] = useState(null)

  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const isFocused = useIsFocused()

  const [optionsFeel, setOptionsFeel] = useState([])
  const [optionsReason, setOptionsReason] = useState([])

  const opFeel1 = { text: '😄 Awesome', id: 'awesome' }
  const opFeel2 = { text: '😊 Pretty good', id: 'pretty_good' }
  const opFeel3 = { text: '😐 Quite OK', id: 'quite_ok' }
  const opFeel4 = { text: '😔 Kind of bad', id: 'kind_of_bad' }
  const opFeel5 = { text: '😥 Horrible', id: 'horrible' }

  const opReason1 = { text: '👪 Family', id: 'family' }
  const opReason2 = { text: '🍲 Food', id: 'food' }
  const opReason3 = { text: '👬 Friends', id: 'friends' }
  const opReason4 = { text: '👨🏼‍⚕️ Health', id: 'health' }
  const opReason5 = { text: '🪂 Hobbies', id: 'hobbies' }
  const opReason7 = { text: '🚴 Sport', id: 'sport' }
  const opReason8 = { text: '💼 Work', id: 'work' }
  const opReason6 = {
    text: '❤️ Relation' + '\n' + 'ship',
    id: 'relationship'
  }

  const optionsFeelMultiple = [opFeel1, opFeel2, opFeel3, opFeel4, opFeel5]
  const optionsReasonMultiple = [
    opReason1,
    opReason2,
    opReason3,
    opReason4,
    opReason5,
    opReason6,
    opReason7,
    opReason8
  ]

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

  useFocusEffect(
    useCallback(() => {
      //  if (props.route.params.open === true) {
      //    setOpenModal(open)
      //   }

      if (props.route.params?.moment_id) {
        setMoment_Id(props.route.params.moment_id)
      }
      loadStories()
    }, [props, isFocused, moment_Id])
  )

  const loadStories = async () => {
    try {
      const dbName = 'Story'
      const realm = await getRealm()
      const response = realm
        .objects<StorysProps[]>(dbName)
        .filtered(`moment_id = '${moment_Id}'`)
        .sorted('date')
        .toJSON()
      setStories(response)
      setAuxStories(response)
      console.log('Stories ', stories)

      if (response.length === 0) {
        console.log('Warning', 'There are no stories yet')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Good Times', 'ERROR in Good Times')
    } finally {
      //realm.close()
    }
    // console.log('STORIES', stories)

    if (props.route.params.storyEdit[0].id !== null) {
      setIdEdit(props.route.params.storyEdit[0].id)
      setIdEdit(props.route.params.storyEdit[0].id)
      setStoryDescribe(props.route.params.storyEdit[0].describe)
      setOptionsFeel(props.route.params.storyEdit[0].feel)
      setOptionsReason(props.route.params.storyEdit[0].reason)
      setPlaceName(props.route.params.storyEdit[0].placeName)
      setSelectedImage(props.route.params.storyEdit[0].image)
      setSelectedImageAux(props.route.params.storyEdit[0].image)
      setImageInBase64(props.route.params.storyEdit[0].image)
      showModal()
    }
  }

  const removeAccent = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const searchStories = (str: string) => {
    setSearchText(str)
    const arrStories = auxStories
    str = removeAccent(str).toUpperCase()
    setStories(
      arrStories.filter(
        (s) =>
          removeAccent(s.describe).toUpperCase().includes(str) ||
          removeAccent(s.placeName).toUpperCase().includes(str)
      )
    )
  }

  const filterFeelEmojis = (id: string) => {
    if (id.length > 0) {
      if (id == 'awesome') {
        return '😄'
      } else if (id == 'pretty_good') {
        return '😊'
      } else if (id == 'quite_ok') {
        return '😐'
      } else if (id == 'kind_of_bad') {
        return '😔'
      } else if (id == 'horrible') {
        return '😥'
      }
    }
  }

  const filterReasonEmojis = (id: string) => {
    if (id.length > 0) {
      if (id == 'family') {
        return '👪'
      } else if (id == 'food') {
        return '🍲'
      } else if (id == 'friends') {
        return '👬'
      } else if (id == 'health') {
        return '👨🏼‍⚕️'
      } else if (id == 'hobbies') {
        return '🪂'
      } else if (id == 'sport') {
        return '🚴'
      } else if (id == 'work') {
        return '💼'
      } else if (id == 'relationship') {
        return '❤️'
      }
    }
  }
  const saveStory = async (data: StorysProps) => {
    const realm = await getRealm()
    const dbName = 'Story'
    const id = await getID(22)

    const dadosStory = {
      id: id,
      moment_id: data.moment_id,
      describe: data.describe,
      feel: data.feel,
      reason: data.reason,
      placeName: data.placeName,
      image: data.image,
      date: data.date,
      emojiCategory: data.emojiCategory
    }
    realm.write(() => {
      realm.create(dbName, dadosStory)
    })
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

  const checkCategoryToTheMoment = (feeloption: string) => {
    if (
      feeloption == 'awesome' ||
      feeloption == 'pretty_good' ||
      feeloption == 'quite_ok'
    ) {
      return 'goodTime'
    } else {
      return 'rougherTime'
    }
  }

  const handleCanSave = async () => {
    //  console.log(storyDescribe)
    console.log('optionsFeel ', optionsFeel)
    console.log('optionsReason ', optionsReason)
    if (
      storyDescribe.trim().toString().length >= 6 &&
      optionsFeel.toString().length > 0
    ) {
      try {
        const emojiCategory = checkCategoryToTheMoment(optionsFeel[0])

        const data = {
          moment_id: moment_Id,
          describe: storyDescribe,
          feel: optionsFeel[0],
          reason: optionsReason[0],
          placeName: placeName,
          image: imageInBase64,
          date: new Date(),
          emojiCategory: emojiCategory
        }

        await saveStory(data)

        setStoryDescribe('')
        setOptionsFeel([])
        setOptionsReason([])
        setPlaceName('')
        setSelectedImage(null)
        setImageInBase64(null)
        hideModal()
        Keyboard.dismiss()
        loadStories()
        Alert.alert('Success', 'Nice')
      } catch (err) {
        Alert.alert(err)
      }
    } else {
      Alert.alert(
        'Error',
        'Fill in the  "Your story" field which must have at least 6 characters and select "How did you feel"'
      )
    }
  }

  const updateStory = async () => {
    if (idEdit === null) {
      Alert.alert('Você não pode editar!')
      return
    }

    const emojiCategory = checkCategoryToTheMoment(optionsFeel[0])

    const realm = await getRealm()
    const dbName = 'Story'
    const response = {
      id: idEdit,
      describe: storyDescribe,
      feel: optionsFeel[0],
      reason: optionsReason[0],
      placeName: placeName,
      image: imageInBase64,
      date: new Date(),
      emojiCategory: emojiCategory
    }

    await realm.write(() => {
      realm.create(dbName, response, 'modified')
    })
    props.route.params.storyEdit[0].id = null

    setIdEdit(null)
    setCanEdited(false)
    setStoryDescribe('')
    setOptionsFeel([])
    setOptionsReason([])
    setPlaceName('')
    setSelectedImage(null)
    setImageInBase64(null)
    hideModal()
    loadStories()

    console.log('IN UPDATE PROPS ', props.route.params.storyEdit[0].id)

    Keyboard.dismiss()
  }

  const renderItem = ({ item, index }: StorysProps) => {
    //console.log('renderItem ', stories)
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('StoryView', {
            story: [
              {
                id: item.id,
                image: item.image,
                date: item.date,
                describe: item.describe,
                placeName: item.placeName,
                feel: item.feel,
                reason: item.reason
              }
            ]
          })
          setSearchText('')
        }}
      >
        <MotiView
          style={styles.listContainer}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000 + index * 200 }}
        >
          <Text style={styles.text}>
            {item.describe.toString().legth <= 40
              ? item.describe
              : item.describe.toString().substr(0, 37) + '...'}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              style={{ top: 10, paddingLeft: 16 }}
              name="calendar-sharp"
              size={18}
              color={'#154'}
            />
            <Text style={styles.date}>
              {formatDistance(new Date(item.date), new Date(), {
                locale: undefined,
                addSuffix: false
              })}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                left: 130,
                top: 7
              }}
            >
              <Text style={{ color: '#000000' }}>
                {filterFeelEmojis(item.feel)}
              </Text>
              <Text style={{ color: '#000000' }}>
                {filterReasonEmojis(item.reason)}
              </Text>
            </View>
          </View>
        </MotiView>
      </TouchableOpacity>
    )
  }
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.goBack(null)}
            style={{ width: 25, height: 25, left: 22 }}
          >
            <Text style={{ textAlign: 'center' }}>
              <Ionicons name="arrow-back-outline" size={25} color={'#000000'} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisibleStories(true)}
            style={{
              width: 25,
              height: 25,
              left: 110,
              marginRight: 8
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              <Ionicons name="images" size={25} color={'#000000'} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showModal}
            style={{
              width: 25,
              height: 25,
              right: 30,
              marginRight: 2
            }}
          >
            <Text style={{ textAlign: 'center' }}>
              <Ionicons name="add-circle" size={25} color={'#000000'} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#ffffff' }}>
          <Text style={{ textAlign: 'center' }}>My Stories</Text>
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
                        setStoryDescribe('')
                        setOptionsFeel([])
                        setOptionsReason([])
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
                        onPress={() => updateStory()}
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
                    <CheckBoxFeel
                      options={optionsFeelMultiple}
                      onChange={(op) => setOptionsFeel(op)}
                      multiple={false}
                      option={idEdit !== null ? [optionsFeel] : null}
                    />

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
                    <CheckBoxReason
                      options={optionsReasonMultiple}
                      onChange={(op) => setOptionsReason(op)}
                      multiple={false}
                      option={idEdit !== null ? [optionsReason] : null}
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
                        <TouchableOpacity
                          onPress={() => setSelectedImage(null)}
                        >
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
                paddingLeft: 10,
                marginTop: 5
              }}
              value={searchText}
              placeholder="Pesquisar"
              onChangeText={(str: string) => searchStories(str)}
              autoCapitalize="none"
            />
            {stories.length > 0 && (
              <FlatList
                data={stories}
                // @ts-ignore
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                numColumns={1}
                showsVerticalScrollIndicator={false}
              />
            )}
            {stories.length == 0 && (
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
                  Your stories will appear here
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
        {visibleStories && stories.length > 0 && (
          <StatusWrapper
            statusData={stories}
            visible={visibleStories}
            onClose={(data: Boolean) => setVisibleStories(false)}
          />
        )}
      </GestureHandlerRootView>
    </>
  )
}

export default Stories

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10
  },
  listContainer: {
    width: Dimensions.get('window').width - 50,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderBottomWidth: 0.1,
    elevation: 1,
    height: Dimensions.get('window').height / 10,
    padding: 10
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15
  },
  date: {
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10
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
  grey: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    bottom: 14,
    top: 14,
    elevation: 3
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
