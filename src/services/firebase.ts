import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth
} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCY20ejHTuw1gex2UDZdrqGg3Z19NyIUzk',
  authDomain: 'mymoments-d9088.firebaseapp.com',
  projectId: 'mymoments-d9088',
  storageBucket: 'mymoments-d9088.appspot.com',
  messagingSenderId: '299954349494',
  appId: '1:299954349494:web:53869f24e07dfcee4d0d17'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
let auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

auth = getAuth(app)
export { auth, app }

// Android 299954349494-ormmk2q36vecelmhsf075klf100kqhut.apps.googleusercontent.com
