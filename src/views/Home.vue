<template>
	<main>
		<!-- Introduction -->
		<nav-intro />

		<!-- Main Content -->
		<section class="container mx-auto">
			<div class="bg-white rounded border border-gray-200 relative flex flex-col">
				<div
					class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
					v-icon-secondary="{ icon: 'headphones-alt', right: true }"
				>
					<span class="card-title">Songs</span>
				</div>
				<!-- Playlist -->
				<ol id="playlist">
					<song-item v-for="song in songs" :key="song.docID" :song="song" />
				</ol>
				<!-- end Playlist -->
			</div>
		</section>
	</main>
</template>

<script>
import NavIntro from "@/components/NavIntro.vue";
import SongItem from "@/components/SongItem.vue";
import { getPaginatedSongs, updatePaginatedSongs } from "@/includes/firebase";
import IconSecondary from "@/directives/icon-secondary";

export default {
	name: "Home",
	components: {
		NavIntro,
		SongItem,
	},
	directives: {
		"icon-secondary": IconSecondary,
	},
	data() {
		return {
			songs: [],
			maxPerPage: 5,
		};
	},
	created() {
		this.getSongs();
		window.addEventListener("scroll", this.handleScroll);
	},
	beforeUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	},
	methods: {
		handleScroll() {
			const { scrollTop, offsetHeight } = document.documentElement;
			const { innerHeight } = window;
			const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
			if (bottomOfWindow) {
				this.updateSongs();
			}
		},
		async getSongs() {
			getPaginatedSongs(this.maxPerPage).then((data) => {
				data.forEach((document) => {
					this.songs.push({
						docID: document.id,
						...document.data(),
					});
				});
			});
		},
		async updateSongs() {
			updatePaginatedSongs(this.songs[this.songs.length - 1].docID, this.maxPerPage).then((data) => {
				data.forEach((snap) => {
					this.songs.push(snap.data());
				});
			});
		},
	},
};
</script>
