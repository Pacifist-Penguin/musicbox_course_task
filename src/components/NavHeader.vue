<template>
	<header id="header" class="bg-gray-700">
		<nav class="container mx-auto flex justify-start items-center py-5 px-4">
			<!-- App Name -->

			<router-link
				class="text-white font-bold uppercase text-2xl mr-4"
				:to="{ name: 'home' }"
				exact-active-class="no-active"
			>
				<!-- exact-active-class used to stop this element from highlighting -->
				Music
			</router-link>

			<div class="flex flex-grow items-center">
				<!-- Primary Navigation -->
				<ul class="flex flex-row mt-1">
					<!-- Navigation Links -->

					<li>
						<router-link class="px-2 text-white" :to="{ name: 'about' }"> About </router-link>
					</li>

					<li v-if="!userLoggedIn">
						<a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
					</li>
					<template v-else>
						<li>
							<router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
						</li>
						<li>
							<a @click.prevent="signOut" class="px-2 text-white" href="#">Logout</a>
						</li>
					</template>
				</ul>
				<ul class="flex flex-row mt-1 ml-auto">
					<li>
						<a class="px-2 text-white" href="#" @click.prevent="changeLocale">
							{{ currentLocale }}
						</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapMutations } from "vuex";

export default {
	name: "NavHeader",
	methods: {
		...mapMutations(["toggleAuthModal"]),
		signOut() {
			this.$store.dispatch("sign_out");
			if (this.$route.meta.requiresAuth) {
				this.$router.push({ name: "home" });
			}
		},
		changeLocale() {
			this.$i18n.locale = this.$i18n.locale === "ru" ? "en" : "ru";
		},
	},
	computed: {
		userLoggedIn() {
			return this.$store.state.userLoggedIn;
		},
		currentLocale() {
			return this.$i18n.locale === "ru" ? "Russian" : "English";
		},
	},
};
</script>
