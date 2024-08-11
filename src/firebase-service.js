import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDocs,
    collection,
    query,
    orderBy
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
export const userLogin = (loginEmail, loginPassword) => {
    return signInWithEmailAndPassword(auth, loginEmail, loginPassword);
}
export const userRegister = (loginEmail, loginPassword) => {
    return createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
}
export const logout = () => {
    return signOut(auth);
}
export const pushResultsToDb = (userId, results) => {
    const userDocRef = doc(db, 'users', userId);
    const userCollectionRef = collection(userDocRef, 'results');
    return setDoc(doc(userCollectionRef), results);
}
export const getStats = (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const resultsCollectionRef = collection(userDocRef, 'results');
    const queryRef = query(resultsCollectionRef, orderBy('endTime', 'desc'));

    return getDocs(queryRef);
}
export default firebaseApp;