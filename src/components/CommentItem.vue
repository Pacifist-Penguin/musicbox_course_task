<template>
	<li class="p-6 bg-gray-50 border border-gray-200">
		<!-- Comment Author -->
		<div class="mb-5">
			<div class="font-bold">{{ name }}</div>
			<time>{{ time }}</time>
		</div>

		<p>
			{{ text }}
		</p>
	</li>
</template>

<script>
export default {
	name: "CommentItem",
	props: {
		name: {
			type: String,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
};
</script>

<style></style>
