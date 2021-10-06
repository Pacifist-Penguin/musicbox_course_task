import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "./includes/validation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./assets/tailwind.css";
import "./assets/main.css";

let appMounted = false
const auth = getAuth()
onAuthStateChanged(auth, () => {
    if (!appMounted) {
        createApp(App).use(store).use(router).use(VeeValidatePlugin).mount("#app");
    }
})