import app from "firebase/app";
import * as fb from "../../constants/fb";
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
  }
}

export default Firebase;
