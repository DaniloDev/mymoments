import React, { useState, useCallback, useRef } from 'react'
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

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getID } from '../utils/functions'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
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
  const [momentDescribe, setMomentDescribe] = useState('')

  const [dateMarked, setDateMarked] = useState('')

  const [searchText, setSeaechText] = useState('')

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

  useFocusEffect(
    useCallback(() => {
      const dbName = 'Moment'
      const loadMoments = async () => {
        const realm = await getRealm()
        const data = realm.objects(dbName)
        setMoments(data)
        setAuxMoments(data)
        console.log('MOMENTS ', moments)
      }

      loadMoments()
    }, [props, isFocused])
  )

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Stories', {
            moment_id: item.id
          })
          setSeaechText('')
        }}
      >
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
            <Text style={styles.updatedAtText}>
              Updated{' '}
              {formatDistance(new Date(item.date), new Date(), {
                locale: undefined,
                addSuffix: false
              })}
            </Text>
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
      name: data.name,
      describe: data.describe,
      image: data.image,
      date: data.date
    }
    realm.write(() => {
      realm.create(dbName, dadosMoment)
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

  const handleCanSave = async () => {
    if (momentName.trim().toString().length >= 6) {
      try {
        const data = {
          name: momentName,
          describe: momentDescribe,
          image: imageInBase64,
          date: new Date()
        }

        await saveMoment(data)

        setMomentName('')
        setMomentDescribe('')
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

  /*const updateMoment = async () => {
    if (idEdit === null) {
      Alert.alert('Você não pode editar!')
      return
    }

    const realm = await getRealm()
    const dbName = 'Moment'
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

    setStoryDescribe('')
    setOptionsFeel([])
    setOptionsReason([])
    setPlaceName('')
    setSelectedImage(null)
    setImageInBase64(null)
    hideModal()
    Keyboard.dismiss()
  }*/
  return (
    <>
      <View style={{ backgroundColor: '#ffffff' }}>
        <TouchableOpacity onPress={showModal}>
          <Text style={{ textAlign: 'right', right: 28 }}>
            <Ionicons name="add-circle" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
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
                      // setStoryDescribe('')
                      //  setOptionsFeel([])
                      //setOptionsReason([])
                      //   setPlaceName('')
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
                    onDayPress={(date) => setDateMarked(date.dateString)}
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
                    maxLength={60}
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
    backgroundColor: '#ffff',
    padding: 10
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
    marginBottom: 10,
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
