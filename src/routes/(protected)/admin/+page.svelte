<script lang="ts">
	import calculateCredits from "$lib/calculateCredits";
	import { determinteEventCredits } from "$lib/determinteCredits";
	import type { PageData } from "./$types";
	import { Paginator } from "@skeletonlabs/skeleton";
	import type { PaginationSettings } from "@skeletonlabs/skeleton";
	export let data: PageData;

	let paginationSettings = {
		page: 0,
		limit: 25,
		size: data.users.length,
		amounts: [25, 50, 100, 150, 500, 1000]
	} satisfies PaginationSettings;

	$: paginatedUsers = data.users.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
</script>

<main class="container mx-auto p-8 space-y-8">
	<hgroup>
		<h1 class="h1">Admin Panel</h1>
		<p>Members with is_tutee of FALSE are ARISTA members.</p>
		<p>Members with is_tutee of TRUE are NOT ARISTA members.</p>
	</hgroup>

	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Homeroom</th>
					<th>Is-Tutee</th>
					<th>4-digit ID</th>
					<th>Committees</th>
					<th>Events Credits</th>
					<th>Tutoring Credits</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedUsers as row, i}
					<tr>
						<td>{row.name}</td>
						<td>{row.email}</td>
						<td>{row.homeroom}</td>
						<td>
							{row.is_tutee}
						</td>
						<td>{row.four_digit_id}</td>
						<td>{row.committees.join(", ")}</td>
						<td>{calculateCredits(row.credits, "events")}</td>
						<td>{calculateCredits(row.credits, "tutoring")}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={true}
		showPreviousNextButtons={true}
	/>
</main>
