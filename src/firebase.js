import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, browserPopupRedirectResolver, inMemoryPersistence, initializeAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAZnKaFhYvgpaYQBErz3B6j8yFP4w_Em3E',
  authDomain: 'login-bb056.firebaseapp.com',
  projectId: 'login-bb056',
  storageBucket: 'login-bb056.firebasestorage.app',
  messagingSenderId: '106443687821',
  appId: '1:106443687821:web:4a337e3f3abdf14b845fc4',
  measurementId: 'G-JTTVNC5LBK',
}

const app = initializeApp(firebaseConfig)
export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
})
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })