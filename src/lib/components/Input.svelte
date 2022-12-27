<script lang="ts">
	export let hideLabel = false
	export let label: string
	export let id = ''
	export let placeholder = ''
	export let value: string
</script>

<div class="flex flex-col">
	{#if !hideLabel}
		<label for={id.length ? id : label} class="mb-1 text-[.95rem] font-semibold text-gray-400"
			>{label}</label
		>
	{/if}
	<input
		type="text"
		id={id.length ? id : label}
		class="h-10 w-full rounded-md bg-gray-800 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
		{placeholder}
		bind:value
	/>
</div>
