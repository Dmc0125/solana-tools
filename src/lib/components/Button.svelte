<script lang="ts">
	export let type: 'submit' | 'button'

	let className = ''
	export { className as class }
</script>

<button on:click {type} class="h-10 min-w-[5rem] rounded-md px-5 {className}">
	<slot />
</button>
