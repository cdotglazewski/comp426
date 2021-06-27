(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCTcwOvC9QqMz1omtxtFzjGjjMSCdT7L3k",
        authDomain: "comp-426-final-fc5c2.firebaseapp.com",
        projectId: "comp-426-final-fc5c2",
        storageBucket: "comp-426-final-fc5c2.appspot.com",
        messagingSenderId: "564899597562",
        appId: "1:564899597562:web:9b30eb3618a859cbf90d43"
    };
    firebase.initializeApp(firebaseConfig);
    const email = document.getElementById('userEmail');
    const password = document.getElementById('userPassword');
    const loginButton = document.getElementById('signIn');
    const signUpButton = document.getElementById('signUp');
    const logoutButton = document.getElementById('signOut');

    loginButton.addEventListener('click', e => {
        const userEmail = email.value;
        const userPassword = password.value;
        const result = firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
        result
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            window.alert("Successful login! Welcome back " + userEmail + "!");
            // ...
          })
        .catch(e => console.log(e.message));
    });

    signUpButton.addEventListener('click', e => {
        const userEmail = email.value;
        const userPassword = password.value;
        const result = firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword);
        result
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            window.alert("Successful account creation! Welcome " + userEmail + "!");
            // ...
          })
        .catch(e => console.log(e.message));
    });

    logoutButton.addEventListener('click', e => {
        firebase.auth().signOut();
        window.alert("Succesfully logged out.");
    })

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            console.log(user);
            logoutButton.style.display = "block";
        } else {
            console.log('logged out');
            logoutButton.style.display = "none";
        }
    });
}());