// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6idgz3eJg1aNzQJ9c7TvQOPsT3lIRA1E",
  authDomain: "autonomatch.firebaseapp.com",
  projectId: "autonomatch",
  storageBucket: "autonomatch.appspot.com",
  messagingSenderId: "553887373831",
  appId: "1:553887373831:web:b1f3549a4c46d503a828a2",
  measurementId: "G-HZ21FZW1R8"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

