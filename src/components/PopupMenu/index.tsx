import React, { useRef, useState, useEffect } from 'react'
import {
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  Animated,
  Easing,
  View,
  Linking,
  Platform,
  Alert
} from 'react-native'
//import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
//import RewardedAdModal from '../RewardedAdModal'
//import { purchasedCheck } from '../../services/purchase'
import { authFirebase } from '../../services/firebase'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { User, onAuthStateChanged } from 'firebase/auth'
import { MomentsProps } from '../../models/Moments.interface'
import getRealm from '../../services/realm'
import { StorysProps } from '../../models/Stories.interface'

import { useNetInfo } from '@react-native-community/netinfo'
Ionicons.loadFont

//import Share from 'react-native-share'
//import useValidatePurchase from '../../hooks/useValidatePurchase'
//import * as IAP from 'react-native-iap'
//import {useTranslation} from 'react-i18next'

const PopupMenu = (props) => {
  const netInfo = useNetInfo()
  //const { t: translate, i18n } = useTranslation()
  const myProduct = 'rniapt_699_1m'
  const adID = 'ca-app-pub-6891561300564361/5342473394'
  const isFocused = useIsFocused()

  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)
  const [adWatched, setAdWatched] = useState(false)
  const [adModalVisible, setAdModalVisible] = useState(false)
  const [comprou, setComprou] = useState(false)
  const scale = useRef(new Animated.Value(0)).current

  const [user, setUser] = useState<User | null>(null)
  const [moments, setMoments] = useState<MomentsProps[]>([])
  const [stories, setStories] = useState<StorysProps[]>([])

  //const { purchased, setPurchased, requestSubscritionHook } = useValidatePurchase()
  //const { products, setProducts } = useValidatePurchase()
  //ca-app-pub-3940256099942544/5224354917
  const ads = {
    BANNER: '',
    REWARDED: '',
    ...Platform.select({
      android: {
        BANNER: 'ca-app-pub-3940256099942544/6300978111',
        REWARDED: 'ca-app-pub-1039301532390120/4875500731'
      },
      ios: {}
    })
  }

  useEffect(() => {
    onAuthStateChanged(authFirebase, async (user) => {
      console.log('user ', user)
      setUser(user)
      await loadMoments()
      await loadStories()
    })
  }, [user?.uid])

  useEffect(() => {
    if (isFocused) {
      checkPerchased()
    }
  }, [props, isFocused /*purchased*/])

  const checkPerchased = async () => {
    //setComprou(purchased)
  }

  const loadMoments = async () => {
    try {
      const dbName = 'Moment'
      const realm = await getRealm()
      const response = realm
        .objects<MomentsProps[]>(dbName)
        .filtered(`userId = '${user?.uid}'`)
        .sorted('createdAT', true)
        .toJSON()
      setMoments(response)

      // console.log('loadMoments in popup ', moments)

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

  const loadStories = async () => {
    try {
      const dbName = 'Story'
      const realm = await getRealm()
      const response = realm
        .objects<StorysProps[]>(dbName)
        .filtered(`userId = '${user?.uid}'`)
        .sorted('createdAT', true)
        .toJSON()
      setStories(response)

      //console.log('loadStories in popup ', stories)

      if (response.length === 0) {
        console.log('Warning', 'There are no stories yet')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Good Times', 'ERROR in Good Times')
    } finally {
      //realm.close()
    }
  }

  const backupData = async () => {
    if (netInfo.isConnected) {
      Alert.alert(
        'Atenção',
        'Tem certeza que deseja realizar o backup ? ' +
          '\n' +
          ' Essa operação apagará seu backup anterior, se você ja tinha feito um backup anterior, faça o logout, realize o login e faça recovery dos seus dados, antes de realizar um novo backup!',
        [
          {
            text: 'Cancel',
            onPress: () => {}
          },
          {
            text: 'OK',
            onPress: () => {
              // Nesse trecho tem que verificar se a internet
              setTimeout(async () => {
                await backupMoments()
                await backupStories()
              }, 300)
            }
          }
        ]
      )
    } else {
      Alert.alert(
        'SEM CONEXÃO',
        'Seu dispositivo não está conectado a internet, logo não sera possivel fazer backup'
      )
    }
  }

  const backupMoments = async () => {
    await loadMoments()
    console.log('moments in backupMoments ', moments)

    if (moments.toString().length > 0) {
      try {
        const data = await fetch(
          'https://europe-west2-mymoments-d9088.cloudfunctions.net/backupMoments',
          {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ data: moments })
          }
        ).then((res) => {
          res.json().then((r) => {
            console.log('R SUPPORT backupMoments', r)
            if (r.result.success == false) {
              console.log('DEU PAU MOPAI backupMoments')
            } else if (r.result.success == true) {
              setTimeout(() => {
                console.log('AI MOPAI backupMoments')
              }, 100)

              //navigation.goBack(null)
            } else {
              console.log('DEU PAU MOPAI ELSE backupMoments')
            }
          })
        })
      } catch (error) {
        console.log('DEU PAU MOPAI CATCH backupMoments')
      }
    } else {
      Alert.alert('CAIU NO ELSE DO BACKUP MOMENTS')
    }
  }

  const backupStories = async () => {
    await loadStories()

    console.log('stories in backupStories ', stories)

    if (stories.toString().length > 0) {
      try {
        const data = await fetch(
          'https://europe-west2-mymoments-d9088.cloudfunctions.net/backupStories',
          {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ data: stories })
          }
        ).then((res) => {
          res.json().then((r) => {
            console.log('R SUPPORT backupStories', r)
            if (r.result.success == false) {
              console.log('DEU PAU MOPAI backupStories')
            } else if (r.result.success == true) {
              setTimeout(() => {
                console.log('AI MOPAI backupStories')
              }, 100)

              //navigation.goBack(null)
            } else {
              console.log('DEU PAU MOPAI ELSE backupStories')
            }
          })
        })
      } catch (error) {
        console.log('DEU PAU MOPAI CATCH backupStories')
      }
    } else {
      Alert.alert('CAIU NO ELSE DO BACKUP STORIES')
    }
  }

  const share = async () => {
    const options = {
      message:
        'https://play.google.com/store/apps/details?id=com.developtecnologia.text_repeater_master'
    }

    setTimeout(async () => {
      try {
        const shareResponse = await Share.open(options)
        console.log(JSON.stringify(shareResponse))
      } catch (error) {
        console.log('Error => ', error)
      }
    }, 305)
  }
  const options = [
    {
      title: 'Sair',
      icon: 'log-out',
      action: () => authFirebase.signOut()
    },

    {
      title: 'Fazer Backup',
      icon: 'cloud-upload',
      action: async () => await backupData()
    }
  ]

  const onAdWatched = () => {
    setAdWatched(true)
    setAdModalVisible(false)
    resizeBox(1)
  }
  const onAdDimissed = () => {
    setAdWatched(false)
    setAdModalVisible(false)
  }

  const RewardAds = () => {
    // Reward Ads Here
    return adWatched ? resizeBox(1) : setAdModalVisible(true)
  }

  const resizeBox = (to: Number) => {
    loadMoments()
    loadStories()
    to === 1 && setVisible(true)
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 300,
      easing: Easing.linear
    }).start(() => to === 0 && setVisible(false))
  }

  const ReturnView = () => {
    return (
      <TouchableOpacity onPress={() => resizeBox(1)}>
        <Ionicons
          style={{ paddingRight: 10 }}
          name="ellipsis-vertical"
          size={26}
          color={'#000000'}
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <ReturnView />

      <Modal transparent visible={visible}>
        <SafeAreaView style={{ flex: 1 }} onTouchStart={() => resizeBox(0)}>
          <Animated.View
            style={[
              styles.popup,
              {
                opacity: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              },
              {
                transform: [{ scale }]
              }
            ]}
          >
            {options.map((op, i) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  { borderBottomWidth: i === options.length - 1 ? 0 : 1 }
                ]}
                key={i}
                onPress={op.action}
              >
                <Text style={styles.title}>{op.title}</Text>
                <Ionicons name={op.icon} size={26} color={'#212121'} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  )
}
export default PopupMenu

const styles = StyleSheet.create({
  popup: {
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 40,
    right: 8
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomColor: '#ccc'
  },
  title: {
    paddingRight: 20,
    color: '#212121'
  }
})
