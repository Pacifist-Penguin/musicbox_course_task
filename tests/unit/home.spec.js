import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";

jest.mock("@/includes/firebase", () => {});

describe("Home.vue", () => {
	const songs = [{}, {}, {}];

	Home.methods.getSong = () => false;

	const component = shallowMount(Home, {
		data() {
			return {
				songs,
			};
		},
		methods: {
			async getSongs() {
				this.songs.push({});
			},
		},
	});
	const items = component.findAllComponents(SongItem);

	expect(items).toHaveLength(songs.length);
});
