<script lang="ts">
	import {
		AddressLookupTableProgram,
		PublicKey,
		TransactionMessage,
		VersionedTransaction,
	} from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'

	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { connection } from '$lib/global/connection'
	import { sendTransaction } from 'solana-tx-utils'

	let altAccountAddresses: string[] = ['']
	$: {
		if (altAccountAddresses.at(-1)?.length) {
			altAccountAddresses.push('')
		}

		if (
			!altAccountAddresses.at(-2)?.length &&
			!altAccountAddresses.at(-1)?.length &&
			altAccountAddresses.length > 1
		) {
			altAccountAddresses.pop()
		}
	}

	const createALT = async () => {
		try {
			if (!$walletStore.connected) {
				return
			}

			const userPublicKey = $walletStore.wallet!.publicKey!
			const altAccounts = altAccountAddresses.slice(0, -1).map((addr) => new PublicKey(addr))

			const userWalletPk = $walletStore.publicKey!

			const slot = await connection.getSlot()
			const [createALTIx, ALTAddress] = AddressLookupTableProgram.createLookupTable({
				authority: userWalletPk,
				payer: userWalletPk,
				recentSlot: slot,
			})

			const extendALTIx = AddressLookupTableProgram.extendLookupTable({
				payer: userWalletPk,
				authority: userPublicKey,
				lookupTable: ALTAddress,
				addresses: altAccounts,
			})

			const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

			const txMessage = new TransactionMessage({
				instructions: [createALTIx],
				payerKey: userPublicKey,
				recentBlockhash: blockhash,
			}).compileToV0Message()
			const tx = new VersionedTransaction(txMessage)
			const signedTx = await $walletStore.signTransaction!(tx)
			const res = await sendTransaction(
				{ transaction: signedTx, lastValidBlockHeight, connection },
				{ log: true },
			)
		} catch (error) {
			console.log(error)
		}
	}
</script>

<form on:submit|preventDefault class="p-6">
	<h2 class="text-gray-200 font-semibold text-lg mb-3">Create Address Lookup Table</h2>
	<div class="flex flex-col gap-4">
		{#each altAccountAddresses as accountAddress, i}
			<Input label="Account address" id="account-addr-{i}" bind:value={accountAddress} />
		{/each}
	</div>
	<Button type="button" class="bg-blue-500 font-medium mt-4 ml-auto block" on:click={createALT}
		>Create ALT</Button
	>
</form>
