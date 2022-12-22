<script lang="ts">
	import {
		AddressLookupTableProgram,
		TransactionMessage,
		VersionedTransaction,
	} from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'

	import { connection } from '$lib/global/connection'
	import { ALTState } from './ALTState'
	import { sendTransaction } from 'solana-tx-utils'
	import Button from '$lib/components/Button.svelte'

	const deactivateALTAccount = async () => {
		if (!$ALTState.data || !$walletStore.connected) {
			return
		}

		const userPublicKey = $walletStore.wallet!.publicKey!
		const deactivateALTAccountIx = AddressLookupTableProgram.deactivateLookupTable({
			authority: userPublicKey,
			lookupTable: $ALTState.data.address,
		})
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
		const txMessage = new TransactionMessage({
			instructions: [deactivateALTAccountIx],
			payerKey: userPublicKey,
			recentBlockhash: blockhash,
		}).compileToV0Message()
		const tx = new VersionedTransaction(txMessage)
		const signedTx = await $walletStore.signTransaction!(tx)
		const res = await sendTransaction(
			{ transaction: signedTx, lastValidBlockHeight, connection },
			{ log: true },
		)
		console.log(res)
	}

	const closeALTAccount = async () => {
		if (!$ALTState.data || !$walletStore.connected) {
			return
		}

		const userPublicKey = $walletStore.wallet!.publicKey!
		const closeALTAccountIx = AddressLookupTableProgram.closeLookupTable({
			authority: userPublicKey,
			recipient: userPublicKey,
			lookupTable: $ALTState.data.address,
		})
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
		const txMessage = new TransactionMessage({
			instructions: [closeALTAccountIx],
			payerKey: userPublicKey,
			recentBlockhash: blockhash,
		}).compileToV0Message()
		const tx = new VersionedTransaction(txMessage)
		const signedTx = await $walletStore.signTransaction!(tx)
		const res = await sendTransaction(
			{ transaction: signedTx, lastValidBlockHeight, connection },
			{ log: true },
		)
		console.log(res)
	}
</script>

<div class="w-full max-h-full bg-gray-900 rounded-xl pt-4 pb-10 grid grid-rows-[auto_1fr]">
	<header class="flex items-center justify-between px-6">
		<h2 class="text-gray-400 font-semibold text-xl">Accounts</h2>

		{#if $ALTState.data}
			<div class="flex gap-2 items-center">
				<Button type="button" class="text-red-400 hover:bg-gray-800" on:click={deactivateALTAccount}
					>Deactivate</Button
				>
				<button
					class="w-10 h-10 p-1 text-red-400 hover:bg-gray-700 rounded-md"
					on:click={closeALTAccount}
				>
					<svg style="width: 100; height: 100%" viewBox="0 0 24 24" fill="none">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke="currentColor"
							d="M10.5 11.5V15.5M4.5 8.5H6.5H4.5ZM19.5 8.5H17.5H19.5ZM17.5 8.5V18.5C17.5 19.0523 17.0523 19.5 16.5 19.5H7.5C6.94771 19.5 6.5 19.0523 6.5 18.5V8.5H17.5ZM17.5 8.5H16H17.5ZM6.5 8.5H8H6.5ZM8 8.5V6.5C8 5.94772 8.44772 5.5 9 5.5H15C15.5523 5.5 16 5.94772 16 6.5V8.5H8ZM8 8.5H16H8ZM13.5 11.5V15.5V11.5Z"
						/>
					</svg>
				</button>
			</div>
		{/if}
	</header>

	{#if $ALTState.isLoading}
		<div class="w-full h-full flex items-center justify-center">
			<div class="w-10 h-10 border-2 border-blue-500 border-b-blue-400 rounded-full animate-spin" />
		</div>
	{:else if $ALTState.data}
		<ul class="w-full h-full pl-6 flex flex-col gap-2 mt-3 overflow-y-auto">
			{#each $ALTState.data.state.addresses as accountAddress, i}
				<li data-code class="text-gray-300 font-medium text-base">
					<span class="mr-2 text-gray-500" data-code>{i + 1}.</span>{accountAddress.toString()}
				</li>
			{/each}
		</ul>
	{/if}
</div>
