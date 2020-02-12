import app from "firebase/app";
import * as fb from "../../constants/fb";
import "firebase/auth";
import "firebase/database";
const config = fb.firebase.dev;
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }
  // *** Auth API ***
  getCurrentUser = () => {
    return this.auth.currentUser;
  };
  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
  // *** Database API ***
  auctions = () => this.db.ref("auctions");
  users = () => this.db.ref("users");
  user = uid => this.db.ref(`users/${uid}`);
  products = () => this.db.ref("products");
  bids = () => this.db.ref("bids");
  bid = bid => this.db.ref(`bids/${bid}`);
}

export default Firebase;
