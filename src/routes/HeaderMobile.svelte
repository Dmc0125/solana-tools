<script lang="ts">
	import SvgIconWrapper from '$lib/components/SvgIconWrapper.svelte'
	import MobileMenu from './MobileMenu.svelte'

	let openMenu = false
</script>

<MobileMenu bind:show={openMenu} />

<header class="w-full h-12 flex items-center justify-between px-5">
	<h1 class="text-xl font-semibold text-gray-200">Solana Tools</h1>

	<button
		class="w-9 h-8 rounded-md px-1 hover:bg-gray-700 focus:bg-gray-700"
		on:click={() => (openMenu = true)}
	>
		<SvgIconWrapper class="text-gray-200">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke="currentColor"
				d="M4.5 8h15m-15 4h15m-15 4h15"
			/>
		</SvgIconWrapper>
	</button>
</header>
