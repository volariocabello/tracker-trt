// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBR1iuii-yi_rKNbUVWpJIgB46u0_Ise3Y",
	authDomain: "tracker-trt.firebaseapp.com",
	projectId: "tracker-trt",
	storageBucket: "tracker-trt.appspot.com",
	messagingSenderId: "611110790647",
	appId: "1:611110790647:web:4bdfe8f3c76a5ecbcafaf2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
	return app;
};
export const db = getFirestore(app);
