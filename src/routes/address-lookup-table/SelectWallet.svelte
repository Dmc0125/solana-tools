<script lang="ts">
	import { browser } from '$app/environment'
	import { fade, fly } from 'svelte/transition'
	import {
		walletStore,
		initialize,
		WalletNotSelectedError,
	} from '@svelte-on-solana/wallet-adapter-core'
	import {
		SolflareWalletAdapter,
		SolflareWalletName,
		PhantomWalletAdapter,
		PhantomWalletName,
		GlowWalletAdapter,
		GlowWalletName,
		BackpackWalletAdapter,
		BackpackWalletName,
	} from '@solana/wallet-adapter-wallets'

	export let show: boolean

	const walletAdapters = [
		new SolflareWalletAdapter(),
		new PhantomWalletAdapter(),
		new GlowWalletAdapter(),
		new BackpackWalletAdapter(),
	]
	const walletNames = [SolflareWalletName, PhantomWalletName, GlowWalletName, BackpackWalletName]

	if (browser) {
		initialize({
			wallets: walletAdapters,
			autoConnect: false,
			localStorageKey: 'walletAdapter',
			onError: (err) => {
				console.log({ err })
			},
		})
	}

	let walletError: null | string = null
	const handleConnectWallet = async () => {
		walletError = null
		try {
			await $walletStore.connect()
		} catch (err) {
			const error = err as Error
			switch (error.name) {
				case 'WalletNotReadyError': {
					walletError = 'Wallet is not installed on this device.'
					break
				}
				case 'WalletNotSelectedError': {
					walletError = 'Please select wallet before connecting.'
					break
				}
				case 'WalletConnectionError': {
					walletError = 'Could not collect to wallet. Please try again.'
					break
				}
			}
		}
	}

	const handleMenuCloseWithEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			show = false
		}
	}
	$: {
		if (show && browser) {
			walletError = null
			window.addEventListener('keydown', handleMenuCloseWithEscape)
		} else if (browser && !show) {
			window.removeEventListener('keydown', handleMenuCloseWithEscape)
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key show}
	<dialog
		open={show}
		class="fixed top-0 left-0 h-screen w-screen bg-white/5 p-0"
		on:click={() => (show = false)}
		transition:fade={{ duration: 200 }}
	>
		{#key show}
			<div
				transition:fly={{ duration: 200, opacity: 0, y: 200 }}
				class="absolute bottom-0 w-full rounded-t-lg bg-gray-800 p-5"
				on:click|stopPropagation
			>
				{#if $walletStore.connected}
					<h3 class="text-lg font-semibold text-gray-200 mb-3">{$walletStore.name} is connected</h3>
				{:else}
					<h3 class="text-lg font-semibold text-gray-200">Connect your Solana wallet</h3>
					<p class="mt-3 mb-2 text-sm font-medium text-gray-500">
						Choose one of the following wallets
					</p>
				{/if}
				<ul class="flex flex-col gap-3">
					{#each walletNames as walletName, i}
						<li class="h-fit w-full">
							<button
								class="
									flex w-full items-center gap-4 rounded-md bg-gray-700 py-3 px-4
									focus:bg-gray-600 hover:bg-gray-600
									{walletName === $walletStore.wallet?.name
									? 'outline focus:outline outline-offset-2 outline-2 outline-blue-500'
									: 'focus:outline-none'}
								"
								disabled={$walletStore.connected}
								on:click={() => {
									$walletStore.select(walletName)
								}}
							>
								<img src={walletAdapters[i].icon} alt="{walletName} icon" class="w-6" />
								<span class="font-medium text-gray-300">
									{walletName}
								</span>
							</button>
						</li>
					{/each}
				</ul>

				<div class="mt-4">
					{#if walletError?.length}
						<p class="text-red-500 font-medium text-sm mb-2">{walletError}</p>
					{/if}

					{#if $walletStore.connected}
						<button
							class="w-full h-12 bg-gray-900 rounded-md text-gray-200 focus:outline-none focus:bg-gray-600 hover:bg-gray-600"
							on:click={() => {
								$walletStore.disconnect()
							}}
						>
							Disconnect
						</button>
					{:else}
						<button
							class="
								w-full h-12 bg-blue-500 rounded-md hover:bg-blue-400 focus:bg-blue-400 focus:outline-none
								text-gray-200 font-medium flex items-center justify-center
							"
							on:click={handleConnectWallet}
						>
							{#if $walletStore.connecting}
								<div
									class="w-4 h-4 border-2 border-gray-200 border-b-gray-200/40 rounded-full animate-spin"
								/>
							{:else}
								Connect
							{/if}
						</button>
					{/if}
				</div>
			</div>
		{/key}
	</dialog>
{/key}
