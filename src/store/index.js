import { createStore } from "vuex";
import { addUsersCollection } from "@/includes/firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default createStore({
	state: {
		authModalShowed: false,
		userLoggedIn: false,
		currentSong: {},
		sound: {},
		seek: "00:00",
		duration: "00:00",
		playerProgress: "0%",
	},
	mutations: {
		toggleAuthModal(state) {
			state.authModalShowed = !state.authModalShowed;
		},
		toggleAuth(state) {
			state.userLoggedIn = !state.userLoggedIn;
		},
		newSong(state, payload) {
			state.currentSong = payload;
			state.sound = new Howl({
				src: [payload.url],
				html5: true,
			});
		},
		updatePosition(state) {
			state.seek = helper(state.sound.seek());
			state.duration = helper(state.sound.duration());
			state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
		},
	},
	getters: {
		playing: (state) => {
			if (state.sound.playing) {
				return state.sound.playing();
			}

			return false;
		},
	},
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
		async newSong({ commit, state, dispatch }, payload) {
			if (state.sound instanceof Howl) {
				state.sound.unload();
			}

			commit("newSong", payload);

			state.sound.play();

			state.sound.on("play", () => {
				requestAnimationFrame(() => {
					dispatch("progress");
				});
			});
		},
		async toggleAudio({ state }) {
			if (!state.sound.playing) {
				return;
			}
			if (state.sound.playing()) {
				state.sound.pause();
			} else {
				state.sound.play();
			}
		},
		progress({ commit, state, dispatch }) {
			commit("updatePosition");
			if (state.sound.playing()) {
				requestAnimationFrame(() => {
					dispatch("progress");
				});
			}
		},
		updateSeek({ state, dispatch }, payload) {
			const { x, width } = payload.currentTarget.getBoundingClientRect();
			const clickX = payload.clientX - x;
			const percentage = clickX / width;
			const seconds = state.sound.duration() * percentage;

			state.sound.seek(seconds);

			state.sound.on("seek", () => {
				dispatch("progress");
			});
		},
	},
});
