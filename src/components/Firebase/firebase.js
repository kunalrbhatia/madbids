import app from "firebase/app";
import * as fb from "../../constants/fb";
import "firebase/auth";
const config = {
  apiKey: fb.firebase.dev.apiKey,
  authDomain: fb.firebase.dev.authDomain,
  projectId: fb.firebase.dev.projectId,
  storageBucket: fb.firebase.dev.storageBucket,
  messagingSenderId: fb.firebase.dev.messagingSenderId
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;