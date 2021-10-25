import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	getDoc,
	setDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	startAfter,
	startAt,
	orderBy,
	where,
	limit,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";
// Created only to be placed in .gitignore
import { getStorage, ref, deleteObject } from "firebase/storage";
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const storage = getStorage(firebase);
const auth = getAuth();
const commentsCollection = collection(db, "comments");

const addCommentsCollection = (comment) => {
	return addDoc(commentsCollection, {
		...comment,
	});
};

const incrementAmountOfComments = (songUID, commentCount) => {
	const exactSong = doc(db, "songs", songUID);
	return updateDoc(exactSong, { comment_count: commentCount });
};

const getCommentsCollection = (songUID) => {
	const q = query(commentsCollection, where("sid", "==", songUID));
	return getDocs(q);
};

const getUsersCollection = () => {
	let actualDoc;
	getDocs(collection(db, "users")).then((doc) =>
		doc.forEach((doc) => {
			actualDoc = doc;
			return;
		})
	);
	return actualDoc;
};

const addUsersCollection = (usersData, key = usersData.email) => {
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
	return reVal;
};

const updatePaginatedSongs = (lastDoc, countOfSongs = 1) => {
	const songRef = collection(db, "songs");
	let q = query(songRef, orderBy("docID"), startAfter(lastDoc), limit(countOfSongs));
	const reVal = getDocs(q);
	return reVal;
};

const getPaginatedSongs = (countOfSongs = 3) => {
	const songRef = collection(db, "songs");
	let q = query(songRef, orderBy("modified_name"), limit(countOfSongs));
	const reVal = getDocs(q);
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
	const songRef = ref(storage, `songs/${songOriginalName}`);
	return deleteObject(songRef);
};

const getSongByDocID = (docID) => {
	const docRef = doc(db, "songs", docID);
	return getDoc(docRef);
};

export {
	getUsersCollection,
	addUsersCollection,
	getAllSongsCollection,
	getSongCollection,
	getSongRef,
	getSongByDocID,
	getPaginatedSongs,
	updatePaginatedSongs,
	addSongCollection,
	updateSongDoc,
	deleteSongDoc,
	deleteSongFromStorage,
	storage,
	auth,
	db,
	commentsCollection,
	addCommentsCollection,
	getCommentsCollection,
	incrementAmountOfComments,
};
//Vue 17-4
