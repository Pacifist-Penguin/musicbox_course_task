import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getFirestore, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js"// Created only to be placed in .gitignore

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
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
  console.log(usersData)
  setDoc(doc(db, "users", key), {
    ...usersData
  })
};

export { getUsersCollection, addUsersCollection };
