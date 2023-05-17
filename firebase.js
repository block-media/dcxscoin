const firebase = require('firebase/app');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: "AIzaSyCDI6FYeL03kFq3km8lQRN46cZCZcpAQN8",
    authDomain: "coin-depot.firebaseapp.com",
    projectId: "coin-depot",
    storageBucket: "coin-depot.appspot.com",
    messagingSenderId: "830148316905",
    appId: "1:830148316905:web:faa782416fd201bf60ea78"
})

exports.firebase = firebase;

exports.db = firebase.firestore();