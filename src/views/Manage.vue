<template>
	<section class="container mx-auto mt-6">
		<div class="md:grid md:grid-cols-3 md:gap-4">
			<div class="col-span-1">
				<file-uploader :songData="songData" :addSong="addSong" />
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
							:index="index"
							:updateSong="updateSong"
							@submit="submit"
						/>
						<!-- It's considered to be a bad practice to pass functions through props. 
						Made only for demonstration purposes  -->
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
		};
	},
	async created() {
		const snapshot = await getSongCollection();
		snapshot.forEach(this.addSong);
	},
	methods: {
		updateSong(index, values) {
			this.songs[index].modified_name = values.modified_name;
			this.songs[index].genre = values.genre;
		},
		addSong(doc) {
			const song = {
				...doc.data(),
				docID: doc.id,
			};
			console.log(song);
			this.songs.push(song);
		},
	},
};
</script>
