// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmoZ5SLTqJfxdWEzuO8wzJbUdwmjbXhgI",
    authDomain: "quiz-ai.firebaseapp.com",
    projectId: "quiz-ai",
    storageBucket: "quiz-ai.appspot.com",
    messagingSenderId: "746483787680",
    appId: "1:746483787680:web:628cd87098824ec35066c5",
    measurementId: "G-RDNFQZ3VN0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore()

let currentUser = {};

//Listen for auth state changes
auth.onAuthStateChanged(function (user) {
    if (user) {
        // document.getElementById('dash-main').style.display = 'block';
        document.getElementById('displayName').innerHTML = user.displayName;
        console.log('user', user, currentUser);
    } else {
        // console.log('no user');
        // document.getElementById('dash-main').style.display = 'none';
    }
});

//Register
function signup(event) {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password.length >= 6 && password === confirmPassword) {
        auth.createUserWithEmailAndPassword(email, password).then(function (result) {
            console.log('signup result', result);
            result.user.updateProfile({
                displayName: fullname
            }).then(function () {
                currentUser = { ...result.user };
            });
            const uid = result.user.uid;
            addUser({ fullname, email, password, uid });

        }).catch(function (error) {
            alert(error.message);
            console.log('signup error', error);
        });
    } else {
        alert('Password must be at least 6 characters long');
    }

}

//Adding user to firestore
function addUser({ fullname, email, password, uid }) {
    db.collection('users').doc(uid).set({
        uid: uid,
        fullname: fullname,
        email: email,
        password: password
    })
        .then(function (docRef) {
            console.log('currentUser', currentUser);
            console.log('Document written: ');
            alert('Signed up');
            window.location.replace('/dashboard');
        })
        .catch(function (error) {
            console.error('Error adding document: ', error);
        });
}

//Getting user from firestore
function getUser({ uid }) {
    db.collection('users').doc(uid).get().then(function (doc) {
        console.log('user', uid);
        if (doc.exists) {
            currentUser = doc.data();
            console.log('Document data:', doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
    }).catch(function (error) {
        console.log('Error getting document:', error);
    });
}

//Login
function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password).then(function (result) {
        console.log('login result', result);
        // getUser({ uid: result.user.uid });
        alert('Logged in');
        window.location.replace('/dashboard');
    }).catch(function (error) {
        console.log('login error', error);
    });
}

//Logout
function logout(event) {
    event.preventDefault();
    auth.signOut().then(function () {
        console.log('Logged out');
        alert('Logged out');
        window.location.replace('/');
    }).catch(function (error) {
        console.log('logout error', error);
        alert(error.message);
    });

}