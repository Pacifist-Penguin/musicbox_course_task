<template>
	<nav-header />

	<router-view v-slot="{ Component }">
		<transition name="fade" mode="out-in">
			<component :is="Component"></component>
		</transition>
	</router-view>
	<!-- Player -->
	<audio-player />

	<!-- Auth Modal -->
	<auth-modal />
</template>

<script>
import NavHeader from "./components/NavHeader.vue";
import AuthModal from "./components/AuthModal.vue";
import AudioPlayer from "./components/AudioPlayer.vue";

export default {
	name: "App",
	components: {
		NavHeader,
		AuthModal,
		AudioPlayer,
	},
	created() {
		this.$store.dispatch("auth/init_login");
	},
};
</script>

<style scoped>
.fade-enter-from {
	opacity: 0;
}

.fade-enter-active {
	transition: all 0.5s linear;
}

.fade-leave-to {
	transition: all 0.5s linear;
	opacity: 0;
}
</style>
