<script lang="ts">
	import {
		PublicKey,
		type AddressLookupTableState,
		AddressLookupTableProgram,
		TransactionMessage,
		VersionedTransaction,
	} from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'
	import { sendTransaction } from 'solana-tx-utils'

	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { connection } from '$lib/global/connection'

	let altAddressInput = ''
	let addressLookupTableData: AddressLookupTableState | null = null
	let isLoading = false

	const loadALT = async () => {
		isLoading = true
		try {
			const altAccountPk = new PublicKey(altAddressInput)
			const altAccount = await connection.getAddressLookupTable(altAccountPk)

			if (!altAccount.value) {
				return
			}

			addressLookupTableData = altAccount.value.state
		} catch (error) {}
		isLoading = false
	}

	let addressesToExtend: string[] = ['']
	$: {
		if (addressesToExtend.at(-1)?.length) {
			addressesToExtend.push('')
		}

		if (
			!addressesToExtend.at(-2)?.length &&
			!addressesToExtend.at(-1)?.length &&
			addressesToExtend.length > 1
		) {
			addressesToExtend.pop()
		}
	}

	const extendALT = async () => {
		if (!$walletStore.connected) {
			return
		}
		const extendIx = AddressLookupTableProgram.extendLookupTable({
			payer: $walletStore.publicKey!,
			authority: $walletStore.publicKey!,
			lookupTable: new PublicKey(altAddressInput),
			addresses: addressesToExtend.map((addr) => new PublicKey(addr)),
		})
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
		const msg = new TransactionMessage({
			payerKey: $walletStore.publicKey!,
			instructions: [extendIx],
			recentBlockhash: blockhash,
		}).compileToV0Message()
		const tx = new VersionedTransaction(msg)
		const signedTx = await $walletStore.signTransaction!(tx)
		const res = await sendTransaction({
			transaction: signedTx,
			lastValidBlockHeight,
			connection,
		})
		console.log(res)
	}
</script>

<main class="w-[80%] h-[80vh] mt-16 mx-[10%] flex rounded-md rounded-r-xl bg-gray-700">
	<div class="w-full py-4 px-6 overflow-y-auto">
		<form on:submit|preventDefault={loadALT}>
			<h2 class="text-gray-200 font-semibold text-lg mb-3">Load Address Lookup Table</h2>
			<Input label="load-atl" hideLabel bind:value={altAddressInput} placeholder="Address" />
			<Button type="submit" class="bg-blue-400 hover:bg-blue-500 mt-4 block ml-auto">Load</Button>
		</form>

		<form class="mt-6" on:submit|preventDefault={extendALT}>
			<h2 class="text-gray-200 font-semibold text-lg mb-3">Extend Address Lookup Table</h2>

			<ul class="flex flex-col gap-3">
				{#each addressesToExtend as address}
					<Input label="Account address" placeholder="Address" bind:value={address} />
				{/each}
			</ul>

			<Button type="submit" class="bg-blue-400 hover:bg-blue-500 mt-4 block ml-auto">Add</Button>
		</form>
	</div>

	<div class="w-full max-h-full bg-gray-900 rounded-xl pl-6 pt-4 pb-10 grid grid-rows-[auto_1fr]">
		<h2 class="text-gray-400 font-semibold text-xl">Accounts</h2>

		{#if isLoading}
			<div class="w-full h-full flex items-center justify-center">
				<div
					class="w-10 h-10 border-2 border-blue-500 border-b-blue-400 rounded-full animate-spin"
				/>
			</div>
		{:else if addressLookupTableData}
			<ul class="w-full h-full flex flex-col gap-2 mt-3 overflow-y-auto">
				{#each addressLookupTableData.addresses as accountAddress, i}
					<li data-code class="text-gray-300 font-medium text-base">
						<span class="mr-2 text-gray-500" data-code>{i + 1}.</span>{accountAddress}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>
