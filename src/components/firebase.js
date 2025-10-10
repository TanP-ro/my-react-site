import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = { 
  apiKey : "AIzaSyBYMlfub_ih4Ftl6ZX9VVWSNPyFuiGR8iM" , 
  authDomain : "wleonel.firebaseapp.com" , 
  projectId : "wleonel" , 
  storageBucket : "wleonel.firebasestorage.app" , 
  messagingSenderId : "1071611924757" , 
  appId : "1:1071611924757:web:fe5f61c8fa71390c60991c" , 
  MeasurementId : "G-NM5WV63FB2", 
  databaseURL: "https://wleonel-default-rtdb.firebaseio.com",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Получение ссылки на базу данных
const db = getDatabase(app);

export { app, db }; // Экспортируйте оба объекта