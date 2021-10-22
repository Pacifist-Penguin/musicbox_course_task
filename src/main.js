import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import Icon from "./directives/icon";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./assets/tailwind.css";
import "./assets/main.css";

let app;
const auth = getAuth();
onAuthStateChanged(auth, () => {
	if (!app) {
		app = createApp(App).use(store).use(router).use(VeeValidatePlugin).directive("icon", Icon).mount("#app");
	}
});
