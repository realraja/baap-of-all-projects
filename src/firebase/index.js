import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB4Qmn2kPRJAsQ181v-5JgyuNaKw8Ojwt8",
    authDomain: "ecommerce-raja.firebaseapp.com",
    projectId: "ecommerce-raja",
    storageBucket: "ecommerce-raja.appspot.com",
    messagingSenderId: "545731780028",
    appId: "1:545731780028:web:7195ab63f7eb84d89e1fb9",
    measurementId: "G-0ZQGLZ0ZD0"
  };

  const app = initializeApp(firebaseConfig);

 export const auth = getAuth(app);
