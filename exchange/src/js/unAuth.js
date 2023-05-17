firebase.initializeApp({
    apiKey: "AIzaSyCDI6FYeL03kFq3km8lQRN46cZCZcpAQN8",
    authDomain: "coin-depot.firebaseapp.com",
    projectId: "coin-depot",
    storageBucket: "coin-depot.appspot.com",
    messagingSenderId: "830148316905",
    appId: "1:830148316905:web:faa782416fd201bf60ea78"
});
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
    if (user) window.location.href = window.location.origin + '/html'
})