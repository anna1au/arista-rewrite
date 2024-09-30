<script lang="ts">
	import type { PageData } from "./$types";
	import { goto, invalidateAll } from "$app/navigation";
	import { superForm } from "sveltekit-superforms";
	import { pb, currentUser } from "$lib/pocketbase";
	import { enhance, deserialize, applyAction } from "$app/forms";
	import ErrorComponent from "$lib/components/ErrorComponent.svelte";
	import InputField from "$lib/components/InputField.svelte";
	import { type ModalSettings } from "@skeletonlabs/skeleton";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { ActionResult } from "@sveltejs/kit";

	const modalStore = getModalStore();

	async function logout() {
		pb.authStore.clear();
		await goto("/");
	}

	export let data: PageData;
	const formObj = superForm(data.form);
	const { form, errors, constraints } = formObj;

	async function handleDeleteAccount(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		const confirmDelete: ModalSettings = {
			type: "confirm",
			title: "Delete account",
			body: "Are you sure you want to delete your account?",
			response: async (r: boolean) => {
				if (r) {
					const data = new FormData();
					console.log("Deleting account", event.currentTarget);
					// @ts-ignore
					const response = await fetch("/settings?/delete_account", {
						method: "POST",
						body: data
					});

					const result: ActionResult = deserialize(await response.text());

					if (result.type === "success") {
						// rerun all `load` functions, following the successful update
						await invalidateAll();
					}
					logout();
					applyAction(result);
				}
			}
		};
		modalStore.trigger(confirmDelete);
	}
</script>

<main class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Settings</h1>
	{#if $currentUser}
		<section>
			<h2 class="h2" style = "padding-bottom: 10px;">Profile</h2>
			<div style = "font-size: 18px;">
				<p style = "padding-bottom: 5px;"><b>Name: </b> {$currentUser.name}</p>
				<p style = "padding-bottom: 5px;"><b> Email:</b> {$currentUser.email}</p>
				<p style = "padding-bottom: 5px;"><b> OSIS:</b> {$currentUser.osis}</p>
				<p style = "padding-bottom: 5px;"><b> Homeroom:</b> {$currentUser.homeroom}</p>
				<p style = "padding-bottom: 5px;"><b> Committees:</b> {JSON.stringify($currentUser.committees)}</p>
				<p><b> Is tutee?:</b> {$currentUser.is_tutee}</p>
			</div>
		</section>
		<section>
			<form
				method="POST"
				action="?/change_password"
				class="card p-4 w-full text-token space-y-4"
				use:enhance
			>
				<ErrorComponent errors={$errors._errors} />
				<h3 class="h3">Change Password</h3>

				<InputField
					style = "padding-bottom: 15px;"
					form={formObj}
					field="password"
					label="Current password:"
					type="password"
				/>
				<InputField
					style = "padding-bottom: 15px"
					form={formObj}
					field="newPassword"
					label="New password:"
					type="password"
				/>
				<InputField
					style = "padding-bottom: 15px"
					form={formObj}
					field="newPasswordConfirm"
					label="Confirm new password:"
					type="password"
				/>

				<button type="submit" class="btn variant-filled">Change Password</button>
			</form>
		</section>
		<a href="/" on:click={logout} class="btn variant-outline-primary">Logout</a>
		<br />
		<form method="POST" on:submit|preventDefault={handleDeleteAccount} action="?/delete_account">
			<button type="submit" class="btn variant-filled-error">Delete My Account</button>
		</form>
	{:else}
		<h2 class="h2">You must be logged in to view this page.</h2>
	{/if}
</main>
