<template>
	<main>
		<!-- Music Header -->
		<section class="w-full mb-8 py-14 text-center text-white relative">
			<div
				class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
				style="background-image: url(/assets/img/song-header.png)"
			></div>
			<div class="container mx-auto flex items-center">
				<!-- Play/Pause Button -->
				<button
					type="button"
					id="play-button"
					@click.prevent="newSong(song)"
					class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
				>
					<i class="fas fa-play"></i>
				</button>
				<div class="z-50 text-left ml-8">
					<!-- Song Info -->
					<div class="text-3xl font-bold">{{ song.modified_name }}</div>
					<div>{{ song.genre }}</div>
					<div class="song-price">{{ $n(1, "currency", "ja") }}</div>
				</div>
			</div>
		</section>
		<!-- Form -->
		<section class="container mx-auto mt-6" id="comments">
			<div class="bg-white rounded border border-gray-200 relative flex flex-col">
				<div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
					<!-- Comment Count -->
					<span class="card-title">{{
						$tc("song.comment_count", song.comment_count, {
							count: song.comment_count,
						})
					}}</span>
					<i class="fa fa-comments float-right text-green-400 text-2xl"></i>
				</div>
				<div class="p-6">
					<div
						v-if="comment_show_alert"
						:class="comment_alert_variant"
						class="text-white text-center font-bold p-4 mb-4"
					>
						{{ comment_alert_message }}
					</div>
					<vee-form v-if="userLoggedIn" @submit="addComment" :validation-schema="validationSchema">
						<vee-field
							as="textarea"
							name="comment"
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
								mb-4
							"
							placeholder="Your comment here..."
						/>
						<error-message name="comment" class="text-red-800" />
						<button
							type="submit"
							name="submit"
							:disabled="comment_in_submission"
							class="py-1.5 px-3 rounded text-white bg-green-600 block"
						>
							Submit
						</button>
					</vee-form>
					<!-- Sort Comments -->
					<select
						v-model="sort"
						class="
							block
							mt-4
							py-1.5
							px-3
							text-gray-800
							border border-gray-300
							transition
							duration-500
							focus:outline-none focus:border-black
							rounded
						"
					>
						<option value="1">Latest</option>
						<option value="2">Oldest</option>
					</select>
				</div>
			</div>
		</section>
		<ul class="container mx-auto">
			<comment-item
				v-for="comment in sortedComments"
				:key="comment.datePosted"
				:text="comment.content"
				:name="comment.name"
				:time="comment.datePosted"
			/>
		</ul>
	</main>
</template>

<script>
import {
	getSongByDocID,
	auth,
	addCommentsCollection,
	getCommentsCollection,
	incrementAmountOfComments,
} from "@/includes/firebase.js";
import CommentItem from "@/components/CommentItem.vue";
import { mapActions } from "vuex";

export default {
	components: { CommentItem },
	name: "Song",
	data() {
		return {
			song: {},
			comments: [],
			validationSchema: {
				comment: "required|min:3|max:300",
			},
			comment_in_submission: false,
			comment_show_alert: false,
			comment_alert_variant: "bg-blue-500",
			comment_alert_message: "Please wait! Your comment is being submitted",
			sort: "1",
		};
	},
	async beforeRouteEnter(to, from, next) {
		const song = await getSongByDocID(to.params.id);

		next((vm) => {
			const songData = song.data();
			if (!songData) {
				vm.$router.push({ name: "home" });
				return;
			}

			const { sort } = vm.$route.query;

			vm.sort = sort === "1" || sort === "2" ? sort : "1";

			vm.song = songData;
			vm.getComments();
		});
	},
	methods: {
		...mapActions("player", ["newSong"]),
		async addComment(values, { resetForm }) {
			this.comment_in_submission = true;
			this.comment_show_alert = true;
			this.comment_alert_variant = "bg-blue-500";
			this.comment_alert_message = "Please wait! Your comment is being submitted";

			const comment = {
				content: values.comment,
				datePosted: new Date().toString(),
				sid: this.$route.params.id,
				name: auth.currentUser.displayName,
				uid: auth.currentUser.uid,
			};
			try {
				await addCommentsCollection(comment);
			} catch {
				this.comment_in_submission = false;
				this.comment_alert_variant = "bg-red-500";
				this.comment_alert_message = "Error occured!";
			}
			this.comment_in_submission = false;
			this.comment_show_alert = true;
			this.comment_alert_variant = "bg-green-500";
			this.comment_alert_message = "Comment added!";

			resetForm();
			this.getComments();
			incrementAmountOfComments(this.$route.params.id, this.comments.length);
		},
		getComments() {
			getCommentsCollection(this.$route.params.id).then((comments) => {
				const arr = [];
				comments.forEach((doc) => {
					arr.push(doc.data());
				});
				this.comments = arr;
			});
		},
	},
	computed: {
		userLoggedIn() {
			return this.$store.state.auth.userLoggedIn;
		},
		sortedComments() {
			return this.comments.slice().sort((a, b) => {
				if (this.sort === "1") {
					return new Date(b.datePosted) - new Date(a.datePosted);
				}
				return new Date(a.datePosted) - new Date(b.datePosted);
			});
		},
	},
	watch: {
		sort(newVal) {
			if (newVal === this.$route.query.sort) {
				return;
			}
			this.$router.push({
				query: {
					sort: newVal,
				},
			});
		},
	},
};
</script>
