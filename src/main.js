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
import GlobalComponents from "./includes/_globals";
import ProgressBar from "./includes/progress-bar";
import "nprogress/nprogress.css";

ProgressBar(router);

let app;
const auth = getAuth();
onAuthStateChanged(auth, () => {
	if (!app) {
		app = createApp(App)
			.use(i18n)
			.use(store)
			.use(router)
			.use(VeeValidatePlugin)
			.use(GlobalComponents)
			.directive("icon", Icon)
			.mount("#app");
	}
});
