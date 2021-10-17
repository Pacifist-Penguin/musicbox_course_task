import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	setDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";
// Created only to be placed in .gitignore
import { getStorage, ref, deleteObject } from "firebase/storage";
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const storage = getStorage(firebase);
const auth = getAuth();
const getUsersCollection = () => {
	let actualDoc;
	getDocs(collection(db, "users")).then((doc) =>
		doc.forEach((doc) => {
			console.log(doc);
			actualDoc = doc;
			return;
		})
	);
	return actualDoc;
};
/*Input will be like this
{
  name: "name",
  email: "email",
  age: "age",
  country: "country",
  }
*/
const addUsersCollection = (usersData, key = usersData.email) => {
	console.log(usersData);
	setDoc(doc(db, "users", key), {
		...usersData,
	});
};
//returns Snapshot
const getSongCollection = () => {
	const songsRef = collection(db, "songs");
	const q = query(songsRef, where("uid", "==", auth.currentUser.uid));
	const reVal = getDocs(q);
	return reVal;
};

const getAllSongsCollection = () => {
	const songs = collection(db, "songs");
	return getDocs(songs);
};

const getSongRef = (original_name) => {
	const songRef = collection(db, "songs");
	const q = query(songRef, where("original_name", "==", original_name));
	const reVal = getDocs(q)[0];
	console.log(reVal);
	return reVal;
};
const updateSongDoc = (songUID, fieldsValue) => {
	const exactSong = doc(db, "songs", songUID);
	return updateDoc(exactSong, fieldsValue);
};

const addSongCollection = (songData) => {
	return addDoc(collection(db, "songs"), {
		...songData,
	});
};

const deleteSongDoc = (songUID) => {
	const exactSong = doc(db, "songs", songUID);
	return deleteDoc(exactSong);
};

const deleteSongFromStorage = (songOriginalName) => {
	console.log(songOriginalName);
	const songRef = ref(storage, `songs/${songOriginalName}`);
	return deleteObject(songRef);
};

export {
	getUsersCollection,
	addUsersCollection,
	getAllSongsCollection,
	getSongCollection,
	getSongRef,
	addSongCollection,
	updateSongDoc,
	deleteSongDoc,
	deleteSongFromStorage,
	storage,
	auth,
	db,
};
//Vue 14-1
