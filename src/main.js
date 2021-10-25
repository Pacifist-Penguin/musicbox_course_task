import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import Icon from "./directives/icon";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./assets/tailwind.css";
import "./assets/main.css";
import i18n from "./includes/i18n";
import "./registerServiceWorker";

let app;
const auth = getAuth();
onAuthStateChanged(auth, () => {
	if (!app) {
		app = createApp(App)
			.use(i18n)
			.use(store)
			.use(router)
			.use(VeeValidatePlugin)
			.directive("icon", Icon)
			.mount("#app");
	}
});
