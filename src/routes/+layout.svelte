<script lang="ts">
	import { page } from '$app/stores'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'

	import '../app.css'
	import HeaderMobile from './HeaderMobile.svelte'

	const links = [
		{ name: 'Account parser', path: '/', isActive: (pathname: string) => pathname === '/' },
		{
			name: 'Address lookup table',
			path: '/address-lookup-table',
			isActive: (pathname: string) => pathname.includes('/address-lookup-table'),
		},
	]
</script>

<HeaderMobile />

<!-- <header class="flex w-full items-center justify-between py-5 px-5">
	<nav class="w-fit ml-auto">
		<ul class="flex gap-4">
			{#each links as { name, path, isActive }}
				<li class="text-[.95rem] font-medium">
					<a
						href={path}
						data-sveltekit-preload-data
						class="
							{isActive($page.url.pathname) ? 'text-gray-200' : 'text-gray-400'}
						">{name}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
<!-- </header> -->

<slot />

<style>
	@font-face {
		font-family: 'Manrope';
		src: url('/Manrope-VariableFont_wght.ttf');
		font-weight: 100 1000;
	}

	@font-face {
		font-family: 'Inconsolata';
		src: url('/Inconsolata-VariableFont_wdth,wght.ttf');
		font-weight: 100 1000;
	}

	:global(*) {
		font-family: 'Manrope';
	}

	:global([data-code]) {
		font-family: 'Inconsolata';
	}
</style>
