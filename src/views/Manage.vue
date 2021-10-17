<template>
	<section class="container mx-auto mt-6">
		<div class="md:grid md:grid-cols-3 md:gap-4">
			<div class="col-span-1">
				<file-uploader @uploaded-song="addSong" :songData="songData" />
			</div>
			<div class="col-span-2">
				<div class="bg-white rounded border border-gray-200 relative flex flex-col">
					<div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
						<span class="card-title">My Songs</span>
						<i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
					</div>
					<div class="p-6">
						<!-- Composition Items -->
						<composition-item
							v-for="(song, index) in songs"
							:song="song"
							:key="song.docID"
							:songIndex="index"
							@update-name="updateSong"
							@delete-song="deleteSong"
							:updateUnsavedFlag="updateUnsavedFlag"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import FileUploader from "@/components/FileUploader.vue";
import CompositionItem from "../components/CompositionItem.vue";
import { getSongCollection } from "@/includes/firebase";
export default {
	name: "Manage",
	components: { FileUploader, CompositionItem },
	data() {
		return {
			songData: {
				title: "",
				genre: "",
			},
			songs: [],
			unsavedFlag: false,
		};
	},
	async mounted() {
		this.addSong();
	},
	methods: {
		updateSong(updateObj) {
			this.songs[updateObj.songIndex].modified_name = updateObj.modified_name;
			this.songs[updateObj.songIndex].genre = updateObj.genre;
		},
		deleteSong(songID) {
			this.songs.splice(songID, 1);
		},
		async addSong() {
			const snapshot = await getSongCollection();
			snapshot.forEach((doc) => {
				const song = {
					...doc.data(),
					docID: doc.id,
				};
				this.songs.push(song);
			});
		},
		updateUnsavedFlag(value) {
			this.unsavedFlag = value;
		},
	},
	beforeRouteLeave(to, from, next) {
		if (!this.unsavedFlag) {
			next();
		} else {
			const answer = confirm("U have unsaved changes, are u sure u want to leave?");
			next(answer);
		}
	},
};
</script>
