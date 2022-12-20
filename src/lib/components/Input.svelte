<script lang="ts">
	export let hideLabel = false
	export let label: string
	export let id = ''
	export let placeholder = ''
	export let value: string
</script>

<div class="flex flex-col">
	{#if !hideLabel}
		<label for={id.length ? id : label} class="text-[.95rem] text-gray-400 font-semibold mb-1"
			>{label}</label
		>
	{/if}
	<input
		type="text"
		id={id.length ? id : label}
		class="bg-gray-800 text-gray-200 h-10 w-full rounded-md px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
		{placeholder}
		bind:value
	/>
</div>
