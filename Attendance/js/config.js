const firebaseConfig = {
  apiKey: "AIzaSyAS2gjIdQQUO9Xj1zRBxr_2ZtV8PQKpH88",
  authDomain: "attendance-d087f.firebaseapp.com",
  databaseURL: "https://attendance-d087f-default-rtdb.firebaseio.com",
  projectId: "attendance-d087f",
  storageBucket: "attendance-d087f.firebasestorage.app",
  messagingSenderId: "59324413177",
  appId: "1:59324413177:web:2d1f5039fffdeb0676de28",
  measurementId: "G-RVL06GL215"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()

console.log ('connected to firebase')

function  logout() {
  // body...
  firebase.auth().signOut().then(function (){
    window.location.href = "index.html"
  }).catch((error) =>{
    alert("Error while you try to logout")
  })
}