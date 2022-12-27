<script lang="ts">
	import { page } from '$app/stores'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'

	import SelectWallet from './SelectWallet.svelte'

	const ALTActions = [
		{
			name: 'Create',
			path: '/address-lookup-table/create',
		},
		{
			name: 'Manage',
			path: '/address-lookup-table/manage',
		},
	] as const
	$: activePathname = $page.url.pathname

	let showSelectWalletMenu = false
</script>

<SelectWallet bind:show={showSelectWalletMenu} />

<main class="w-full px-5">
	<header class="flex w-full items-center justify-between">
		<nav class="w-full py-5">
			<ul class="flex items-center gap-1">
				{#each ALTActions as { name, path }}
					<li class="">
						<a
							href={path}
							data-sveltekit-preload-data
							class="{activePathname === path
								? 'bg-gray-700 font-medium text-gray-200'
								: 'font-regular text-gray-400'} block rounded-md px-3 py-1 hover:bg-gray-700"
							>{name}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<button
			class="shrink-0 font-medium text-gray-300 hover:text-gray-100"
			on:click={() => (showSelectWalletMenu = true)}
		>
			{#if $walletStore.connected}
				{$walletStore.publicKey?.toString().slice(0, 4)}...{$walletStore.publicKey
					?.toString()
					.slice(-4)}
			{:else}
				Connect wallet
			{/if}
		</button>
	</header>

	<slot />
</main>
