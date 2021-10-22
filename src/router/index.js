import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";
import store from "@/store";

import SongComponent from "@/views/Song.vue";
const routes = [
	{
		name: "home",
		path: "/", //example.com/
		component: Home,
	},
	{
		name: "about",
		path: "/about",
		component: About,
	},
	{
		name: "manage",
		path: "/manage-music",
		meta: {
			requiresAuth: true,
		},
		component: Manage,
		beforeEnter: (to, from, next) => {
			console.log("manage guard");

			next();
		},
	},
	// {
	//   name: "manage",
	//   alias: "/manage",
	//   path: "/manage-music",
	//   component: Manage
	// },
	{
		path: "/manage",
		redirect: { name: "manage" },
	},
	{
		path: "/:catchAll(.*)*",
		redirect: { name: "home" },
	},
	{
		name: "song",
		path: "/song/:id",
		component: SongComponent,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
	if (
		!to.matched.some((record) => {
			record.meta.requiresAuth;
		})
	) {
		next();
		return;
	}

	if (store.state.userLoggedIn) {
		next();
	} else {
		next({ name: "home" });
	}
});

export default router;
