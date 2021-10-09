<template>
	<nav-header />

	<router-view></router-view>

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
		this.$store.dispatch("init_login");
	},
};
</script>
