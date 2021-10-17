<template>
	<div class="border border-gray-200 p-3 mb-4 rounded">
		<div v-show="!showForm">
			<h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
			<button
				class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
				@click.prevent="deleteSong"
			>
				<i class="fa fa-times"></i>
			</button>
			<button
				class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
				@click.prevent="showForm = !showForm"
			>
				<i class="fa fa-pencil-alt"></i>
			</button>
		</div>
		<div v-show="showForm">
			<div v-show="show_alert" class="text-white text-center font-bold p-4 mb-4" :class="alert_variant">
				{{ alert_message }}
			</div>

			<vee-form :validation-schema="editSchema" @submit="edit" :initial-values="song">
				<div class="mb-3">
					<label class="inline-block mb-2">Song Title</label>
					<vee-field
						name="modified_name"
						type="text"
						class="
							block
							w-full
							py-1.5
							px-3
							text-gray-800
							border border-gray-300
							transition
							duration-500
							focus:outline-none focus:border-black
							rounded
						"
						placeholder="Enter Song Title"
						@input="updateUnsavedFlag(true)"
					/>
					<error-message class="text-red-600" name="modified_name" />
				</div>
				<div class="mb-3">
					<label class="inline-block mb-2">Genre</label>
					<vee-field
						name="genre"
						type="text"
						class="
							block
							w-full
							py-1.5
							px-3
							text-gray-800
							border border-gray-300
							transition
							duration-500
							focus:outline-none focus:border-black
							rounded
						"
						placeholder="Enter Genre"
						@input="updateUnsavedFlag(true)"
					/>
					<error-message class="text-red-600" name="genre  " />
				</div>
				<button :disabled="in_submission" type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
					Submit
				</button>
				<button
					:disabled="in_submission"
					@click.prevent="goBack"
					type="button"
					class="py-1.5 px-3 rounded text-white bg-gray-600"
				>
					Go Back
				</button>
			</vee-form>
		</div>
	</div>
</template>
<script>
import { updateSongDoc, deleteSongDoc, deleteSongFromStorage } from "@/includes/firebase";
export default {
	name: "CompositionItem",
	props: {
		song: {
			type: Object,
			required: true,
		},
		songIndex: {
			type: Number,
			required: true,
		},
		updateUnsavedFlag: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			showForm: false,
			editSchema: {
				modified_name: "required|min:1|max:100",
				genre: "required|min:3|max:100",
			},
			alert_message: "",
			alert_variant: "bg-blue-500",
			show_alert: false,
			in_submission: false,
		};
	},
	methods: {
		async edit(fieldsValue) {
			this.in_submission = true;
			this.show_alert = true;
			this.alert_variant = "bg-blue-500";
			this.alert_message = "Please wait! Updating song info.";
			try {
				await updateSongDoc(this.song.docID, fieldsValue);
				this.$emit("update-name", {
					songIndex: this.songIndex,
					modified_name: fieldsValue.modified_name,
					genre: fieldsValue.genre,
				});
			} catch {
				this.alert_variant = "bg-red-500";
				this.in_submission = false;
				this.alert_message = "Error occured! Try again later";
				return;
			}

			this.in_submission = false;
			this.alert_variant = "bg-green-500";
			this.alert_message = "Successfull edit!";
			this.updateUnsavedFlag(false);
		},
		async deleteSong() {
			await deleteSongDoc(this.song.docID);
			await deleteSongFromStorage(this.song.original_name);
			this.$emit("delete-song", this.songIndex);
		},
		goBack() {
			this.showForm = !this.showForm;
			this.updateUnsavedFlag(false);
		},
	},
};
</script>
