import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";
// Created only to be placed in .gitignore
import { getStorage } from "firebase/storage";
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

const getSongCollection = () => {
	const songsRef = collection(db, "songs");
	const q = query(songsRef, where("uid", "==", auth.currentUser.uid));
	const reVal = getDocs(q);
	return reVal;

	// let actualDoc;
	// getDocs(collection(db, "songs")).then((doc) =>
	//   doc.forEach((doc) => {
	//     actualDoc = doc;
	//     return;
	//   })
	// );
	// return actualDoc;
};

const addSongCollection = (songData) => {
	addDoc(collection(db, "songs"), {
		...songData,
	});
};

export { getUsersCollection, addUsersCollection, getSongCollection, addSongCollection, storage, auth };
//Vue 13-20
