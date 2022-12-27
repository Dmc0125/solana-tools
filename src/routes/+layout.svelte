<script>
	import { page } from '$app/stores'
	import { walletStore, initialize } from '@svelte-on-solana/wallet-adapter-core'
	import { onMount } from 'svelte'

	import Button from '$lib/components/Button.svelte'

	import '../app.css'

	const links = [
		{ name: 'Account parser', path: '/' },
		{ name: 'Address lookup table', path: '/address-lookup-table' },
	]

	// onMount(async () => {
	// 	const { SolflareWalletAdapter, SolflareWalletName } = await import(
	// 		'@solana/wallet-adapter-wallets'
	// 	)

	// 	initialize({
	// 		wallets: [new SolflareWalletAdapter()],
	// 		autoConnect: false,
	// 		localStorageKey: 'walletAdapter',
	// 		onError: (err) => {
	// 			console.log({ err })
	// 		},
	// 	})

	// 	$walletStore.select(SolflareWalletName)
	// })

	// const handleWalletButton = async () => {
	// 	try {
	// 		if ($walletStore.connected) {
	// 			await $walletStore.disconnect()
	// 		} else {
	// 			await $walletStore.connect()
	// 		}
	// 	} catch (error) {
	// 		console.log('Could not connect wallet')
	// 	}
	// }
</script>

<header class="flex w-full items-center justify-between py-5 px-[10%]">
	<nav class="w-fit">
		<ul class="flex gap-8">
			{#each links as { name, path }}
				<li class="text-base font-medium text-gray-300">
					<a
						href={path}
						data-sveltekit-preload-data
						class="hover:text-red-400 {$page.url.pathname.endsWith(path)
							? 'text-red-300 underline underline-offset-4'
							: ''}">{name}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="flex">
		{#if $walletStore.connected}
			<div class="mr-4 flex items-center gap-2">
				<span class="text-base text-gray-200">
					{$walletStore.wallet?.name}
				</span>
				<img
					class="h-8 w-8"
					src={$walletStore.wallet?.icon}
					alt="{$walletStore.wallet?.name} icon"
				/>
			</div>
		{/if}
	</div>
</header>

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
