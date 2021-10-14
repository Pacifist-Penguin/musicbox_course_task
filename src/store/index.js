import { createStore } from "vuex";
import { addUsersCollection } from "@/includes/firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default createStore({
	state: {
		authModalShowed: false,
		userLoggedIn: false,
	},
	mutations: {
		toggleAuthModal(state) {
			state.authModalShowed = !state.authModalShowed;
		},
		toggleAuth(state) {
			state.userLoggedIn = !state.userLoggedIn;
		},
	},
	getters: {},
	actions: {
		async register({ commit }, payload) {
			let userCredentials;
			const auth = getAuth();
			await createUserWithEmailAndPassword(auth, payload.email, payload.password).then((data) => {
				userCredentials = data;
			});
			await addUsersCollection(
				{
					name: payload.name,
					email: payload.email,
					age: payload.age,
					country: payload.country,
				},
				userCredentials.user.uid
			);

			commit("toggleAuth");
		},
		async login({ commit }, payload) {
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, payload.email, payload.password).then(() => {
				commit("toggleAuth");
			});
		},
		init_login({ commit }) {
			const user = getAuth().currentUser;

			if (user) {
				commit("toggleAuth");
			}
		},
		async sign_out({ commit }) {
			await signOut(getAuth());
			commit("toggleAuth");
		},
	},
	modules: {},
});
