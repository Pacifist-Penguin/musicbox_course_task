<template>
	<vee-form :validation-schema="registerSchema" :initial-values="userData" @submit="register">
		<div class="text-white text-center font-bold p-5 mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
			{{ reg_alert_msg }}
		</div>
		<!-- Name -->
		<div class="mb-3">
			<label class="inline-block mb-2">Name</label>
			<vee-field
				name="name"
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
				placeholder="Enter Name"
				:rule="{
					required: true,
				}"
			/>
			<error-message class="text-red-800" name="name" />
		</div>
		<!-- Email -->
		<div class="mb-3">
			<label class="inline-block mb-2">Email</label>
			<vee-field
				name="email"
				type="email"
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
				placeholder="Enter Email"
			/>
			<error-message class="text-red-800" name="email" />
		</div>
		<!-- Age -->
		<div class="mb-3">
			<label class="inline-block mb-2">Age</label>
			<vee-field
				type="number"
				name="age"
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
			/>
			<error-message class="text-red-800" name="age" />
		</div>
		<!-- Password -->
		<div class="mb-3">
			<label class="inline-block mb-2">Password</label>
			<vee-field name="password" :bails="false" v-slot="{ field, errors }">
				<input
					type="password"
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
					placeholder="Password"
					v-bind="field"
				/>
				<div class="text-red-800" v-for="error in errors" :key="error">
					{{ error }}
				</div>
			</vee-field>
			<error-message class="text-red-800" name="password" />
		</div>
		<!-- Confirm Password -->
		<div class="mb-3">
			<label class="inline-block mb-2">Confirm Password</label>
			<vee-field
				name="confirm_password"
				type="password"
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
				placeholder="Confirm Password"
			/>
			<error-message name="confirm_password" class="text-red-800" />
		</div>
		<!-- Country -->
		<div class="mb-3">
			<label class="inline-block mb-2">Country</label>
			<vee-field
				as="select"
				name="country"
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
			>
				<option value="USA">USA</option>
				<option value="Mexico">Mexico</option>
				<option value="Germany">Germany</option>
				<option value="Antarctica">Antarctica</option>
			</vee-field>
			<error-message name="country" class="text-red-800" />
		</div>
		<!-- TOS -->
		<div class="mb-3 pl-6">
			<vee-field type="checkbox" name="tos" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
			<label class="inline-block">Accept terms of service</label>
			<error-message name="tos" class="text-red-800 block" />
		</div>
		<button
			type="submit"
			:disabled="reg_in_submission"
			class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
		>
			Submit
		</button>
	</vee-form>
</template>

<script>
export default {
	data() {
		return {
			name: "RegisterForm",
			registerSchema: {
				name: "required|min:3|max:100|alpha_spaces",
				email: "required|email|max:100",
				age: "required|min_value:18|max_value:100",
				password: "required|min:6|max:100",
				confirm_password: "passwords_mismatch:@password",
				country: "required|country_excluded:Antarctica",
				tos: "tos",
			},
			userData: {
				country: "USA",
			},
			reg_show_alert: false,
			reg_in_submission: false,
			reg_alert_variant: "bg-blue-500",
			reg_alert_msg: "Creating account...",
		};
	},
	methods: {
		async register(values) {
			this.reg_show_alert = true;
			this.reg_in_submission = true;
			this.reg_alert_variant = "bg-blue-500";
			this.reg_alert_msg = "Please wait! Your account is being created.";
			let userCredentials;
			try {
				console.log(values);
				await this.$store.dispatch("register", values);
			} catch (error) {
				this.reg_in_submission = false;
				this.reg_alert_variant = "bg-red-600";
				this.reg_alert_msg = "An unexpected error occured. Please try again later";
				return;
			}
			this.$store.commit("toggleAuth");
			this.reg_alert_variant = "bg-green-500";
			this.reg_alert_msg = "Success! Your account has been created";
		},
	},
};
</script>
