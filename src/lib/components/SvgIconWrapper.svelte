<script lang="ts">
	let className = ''
	export { className as class }
</script>

<svg class="w-full h-full {className}" viewBox="0 0 24 24" fill="none">
	<slot />
</svg>
