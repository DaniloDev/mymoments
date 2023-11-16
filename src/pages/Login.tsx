import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  SignInMethod,
  User
} from 'firebase/auth'
import { authFirebase } from '../services/firebase'

import auth from '@react-native-firebase/auth'
import getRealm from '../services/realm'
import { StorysProps } from '../models/Stories.interface'
import { MomentsProps } from '../models/Moments.interface'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState()
  const [moments, setMoments] = useState<MomentsProps[]>([])
  const [stories, setStories] = useState<StorysProps[]>([])

  useEffect(() => {
    onAuthStateChanged(authFirebase, async (userHere) => {
      setUser(userHere)

      console.log('user IN LOGIN AT onAuthStateChanged', user)
    })
    GoogleSignin.configure({
      webClientId:
        '299954349494-4jgjnj04qmn4h43n7pf36ak6187vhii5.apps.googleusercontent.com'
    })
  }, [])

  const loadMoments = async (userId: any) => {
    try {
      const dbName = 'Moment'
      const realm = await getRealm()
      const response = realm
        .objects<MomentsProps[]>(dbName)
        .filtered(`userId = '${userId}'`)
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

  const loadStories = async (userId: any) => {
    try {
      const dbName = 'Story'
      const realm = await getRealm()
      const response = realm
        .objects<StorysProps[]>(dbName)
        .filtered(`userId = '${userId}'`)
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

  const verifiedIfThereDatas = async (userId: string) => {
    try {
      const userInfo = {
        userId: userId
      }
      const data = await fetch(
        'https://europe-west2-mymoments-d9088.cloudfunctions.net/RecoveryMoments',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: userInfo })
        }
      ).then((res) => {
        res.json().then(async (r) => {
          console.log('R SUPPORT verifiedIfThereDatas', r)
          if (r.result.success == false) {
            console.log('DEU PAU MOPAI verifiedIfThereDatas')
          } else if (r.result.success == true) {
            setTimeout(async () => {
              console.log(
                'AI MOPAI verifiedIfThereDatas dataStoreMoments',
                r.result.data
              )

              let arrayVerifiedMoments: any

              arrayVerifiedMoments = r.result.data

              if (arrayVerifiedMoments.length > 0) {
                return true
              } else {
                return false
              }
            }, 100)
          } else {
            console.log('DEU PAU MOPAI ELSE verifiedIfThereDatas')
          }
        })
      })
    } catch (error) {
      console.log('DEU PAU MOPAI CATCH verifiedIfThereDatas')
    }
  }

  const RecoveryData = async (userId: any) => {
    try {
      const userInfo = {
        userId: userId
      }
      const data = await fetch(
        'https://europe-west2-mymoments-d9088.cloudfunctions.net/RecoveryMoments',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: userInfo })
        }
      ).then((res) => {
        res.json().then(async (r) => {
          console.log('R SUPPORT verifiedIfThereDatas', r)
          if (r.result.success == false) {
            console.log('DEU PAU MOPAI verifiedIfThereDatas')
          } else if (r.result.success == true) {
            setTimeout(async () => {
              console.log(
                'AI MOPAI verifiedIfThereDatas dataStoreMoments',
                r.result.data
              )

              let arrayVerifiedMoments: any

              arrayVerifiedMoments = r.result.data

              if (arrayVerifiedMoments.length > 0) {
                Alert.alert(
                  'Atenção',
                  'Deseja verificar e realizar recuperação de dados dessa conta ? ' +
                    '\n' +
                    ' Essa operação apagará seus "moments", se você ja fez registro de novos "moments" e não fez ainda não fez backup, faça antes de fazer a recuperação pois os dados serão apagados!',
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
                          await loadMoments(userId)
                          await loadStories(userId)
                        }, 150)
                        setTimeout(async () => {
                          await RecoveryMoments(userId)
                          await RecoveryStories(userId)
                        }, 300)
                      }
                    }
                  ]
                )
              }
            }, 100)
          } else {
            console.log('DEU PAU MOPAI ELSE verifiedIfThereDatas')
          }
        })
      })
    } catch (error) {
      console.log('DEU PAU MOPAI CATCH verifiedIfThereDatas')
    }
  }

  const RecoveryMoments = async (userId: any) => {
    try {
      const userInfo = {
        userId: userId
      }

      console.log('USERINFO IN RECOVERYDATA ', userInfo)
      const data = await fetch(
        'https://europe-west2-mymoments-d9088.cloudfunctions.net/RecoveryMoments',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: userInfo })
        }
      ).then((res) => {
        res.json().then(async (r) => {
          console.log('R SUPPORT RecoveryMoments', r)
          if (r.result.success == false) {
            console.log('DEU PAU MOPAI RecoveryMoments')
          } else if (r.result.success == true) {
            setTimeout(async () => {
              console.log(
                'AI MOPAI RecoveryMoments dataStoreMoments',
                r.result.data
              )

              await deleteMoments()
              let arrayMoments: any

              arrayMoments = r.result.data
              console.log('ARRAY MOMENTS  ', arrayMoments)
              console.log('ARRAY MOMENTS  LENGTH', arrayMoments.length)

              for (let i = 0; i < arrayMoments.length; i++) {
                const realm = await getRealm()
                const dbName = 'Moment'

                const dadosMoment = {
                  id: arrayMoments[i].id,
                  userId: arrayMoments[i].userId,
                  name: arrayMoments[i].name,
                  describe: arrayMoments[i].describe,
                  image: arrayMoments[i].image,
                  date: new Date(arrayMoments[i].date),
                  createdAT: new Date(arrayMoments[i].createdAT),
                  updatedAT: new Date(arrayMoments[i].updatedAT),
                  deletedAT: arrayMoments[i].deletedAT
                }
                realm.write(() => {
                  realm.create(dbName, dadosMoment)
                })
              }
            }, 100)
          } else {
            console.log('DEU PAU MOPAI ELSE RecoveryMoments')
          }
        })
      })
    } catch (error) {
      console.log('DEU PAU MOPAI CATCH RecoveryMoments')
    }
  }

  const RecoveryStories = async (userId: any) => {
    try {
      const userInfo = {
        userId: userId
      }
      const data = await fetch(
        'https://europe-west2-mymoments-d9088.cloudfunctions.net/RecoveryStories',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: userInfo })
        }
      ).then((res) => {
        res.json().then(async (r) => {
          console.log('R SUPPORT RecoveryStories', r)
          if (r.result.success == false) {
            console.log('DEU PAU MOPAI RecoveryStories')
          } else if (r.result.success == true) {
            setTimeout(async () => {
              console.log('AI MOPAI RecoveryStories', r.result.data)

              await deleteStories()

              let arrayStories: any

              arrayStories = r.result.data
              console.log('ARRAY STORIES  0', arrayStories)
              console.log('ARRAY STORIES  LENGTH', arrayStories.length)

              for (let i = 0; i < arrayStories.length; i++) {
                const realm = await getRealm()
                const dbName = 'Story'

                const dadosStory = {
                  id: arrayStories[i].id,
                  userId: arrayStories[i].userId,
                  moment_id: arrayStories[i].moment_id,
                  describe: arrayStories[i].describe,
                  feel: arrayStories[i].feel,
                  reason: arrayStories[i].reason,
                  placeName: arrayStories[i].placeName,
                  image: arrayStories[i].image,
                  date: new Date(arrayStories[i].date),
                  createdAT: new Date(arrayStories[i].createdAT),
                  updatedAT: new Date(arrayStories[i].updatedAT),
                  emojiCategory: arrayStories[i].emojiCategory,
                  deletedAT: arrayStories[i].deletedAT
                }
                realm.write(() => {
                  realm.create(dbName, dadosStory)
                })
              }
            }, 100)
          } else {
            console.log('DEU PAU MOPAI ELSE RecoveryStories')
          }
        })
      })
    } catch (error) {
      console.log('DEU PAU MOPAI CATCH RecoveryStories')
    }
  }

  const deleteMoments = async () => {
    console.log('MOMENTS in deleteMoments ', moments)
    const dbName = 'Moment'
    const realm = await getRealm()

    for (let i = 0; i < moments.length; i++) {
      realm.write(() => {
        if (
          realm.objects(dbName).filtered(`userId = '${moments[i].userId}'`)
            .length > 0
        ) {
          realm.delete(
            realm.objects(dbName).filtered(`userId = '${moments[i].userId}'`)
          )
        }
      })
    }
  }

  const deleteStories = async () => {
    console.log('STORIES in deleteStories ', stories)
    const dbName = 'Story'
    const realm = await getRealm()

    for (let i = 0; i < stories.length; i++) {
      realm.write(() => {
        if (
          realm.objects(dbName).filtered(`userId = '${stories[i].userId}'`)
            .length > 0
        ) {
          realm.delete(
            realm.objects(dbName).filtered(`userId = '${stories[i].userId}'`)
          )
        }
      })
    }
  }

  const loginWithEmailAndPassword = async () => {
    signInWithEmailAndPassword(authFirebase, email, password)
      .then(async () => {
        const usuarioAtual = authFirebase.currentUser

        await RecoveryData(usuarioAtual?.uid)

        if (usuarioAtual?.emailVerified) {
          props.navigation.navigate('Home')
        } else {
          Alert.alert('Error', 'Email não verificado')
        }
      })
      .catch((error) => {
        Alert.alert(error.message)
      })
  }

  const signUpWithEmailAndPassword = () => {
    /*  createUserWithEmailAndPassword(auth, email, password)
      .then((result: any) => {
        console.log('RESULT ', result)
      })
      .catch((error) => {
        Alert.alert(error.message)
      })*/

    createUserWithEmailAndPassword(authFirebase, email, password)
      .then(() => {
        console.log('User account created & signed in!')
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!')
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!')
        }

        console.error(error)
      })
  }

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const { idToken, user } = await GoogleSignin.signIn()
      console.log('IDTOKEN ', idToken)
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      console.log('USER LOGIN ', user)
      return auth().signInWithCredential(googleCredential)
    } catch (error: any) {
      console.log(error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <Input
          value={email}
          onChangeText={(str) => setEmail(str)}
          placeholder="Email"
          style={{ fontSize: 18 }}
        />
        <Input
          value={password}
          onChangeText={(str) => setPassword(str)}
          placeholder="Senha"
          secureTextEntry={true}
          style={{ fontSize: 18 }}
        />
        <TouchableOpacity
          onPress={loginWithEmailAndPassword}
          style={{
            backgroundColor: '#0d8f1a',
            width: 200,
            height: 50,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6
          }}
        >
          <Text style={styles.signINText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('SignUP')}>
          <Text style={styles.createAccount}>
            Não possui conta? clique aqui
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Login

const styles = StyleSheet.create({
  signINText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#ffffff'
  },

  createAccount: {
    top: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#000000'
  }
})
