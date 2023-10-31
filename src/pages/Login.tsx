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
import { auth, app } from '../services/firebase'
//import signInWithPopup from '@react-native-firebase/auth'
//import firebase from 'firebase/app'

//import auth from '@react-native-firebase/auth'c

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '299954349494-3a1c6l44uj0oeqfka4acdvvtha0g10ep.apps.googleusercontent.com',
      forceCodeForRefreshToken: true

      //android/app/google-services.json - 299954349494-4n7ukadlrfq8png48jdhguc6v771khiq.apps.googleusercontent.com
    })
  }, [])

  const loginWithEmailAndPassword = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result: User) => {
        console.log('RESULT ', result)

        if (result.emailVerified) {
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

    createUserWithEmailAndPassword(auth, email, password)
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

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleCredentials = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(auth, googleCredentials)
    } catch (error: any) {
      console.log('got error ', error.message)
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

  const signInWithGoogle = async () => {
    const googleAuthProvider = new GoogleAuthProvider()

    // signInWithPopup()
  }
  /*
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn()

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
  }*/
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
