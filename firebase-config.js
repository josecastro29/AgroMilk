// Configuração do Firebase - AgroMilk
const firebaseConfig = {
    apiKey: "AIzaSyBncO-dohg2Ih1UQn14tpPk-2OSb6S6NbU",
    authDomain: "agromilk-96cdf.firebaseapp.com",
    databaseURL: "https://agromilk-96cdf-default-rtdb.firebaseio.com",
    projectId: "agromilk-96cdf",
    storageBucket: "agromilk-96cdf.firebasestorage.app",
    messagingSenderId: "645005764528",
    appId: "1:645005764528:web:9ff32b222aa1e6f8319875",
    measurementId: "G-NRMC1RG493"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados
const database = firebase.database();

console.log('🔥 Firebase inicializado com sucesso!');
