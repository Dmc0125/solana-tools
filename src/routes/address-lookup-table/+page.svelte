<script lang="ts">
	import {
		PublicKey,
		AddressLookupTableProgram,
		TransactionMessage,
		VersionedTransaction,
	} from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'
	import { sendTransaction } from 'solana-tx-utils'

	import Button from '$lib/components/Button.svelte'
	import Input from '$lib/components/Input.svelte'
	import { ALTState } from './ALTState'
	import { connection } from '$lib/global/connection'
	import AltManager from './ALTManager.svelte'
	import AltCreate from './ALTCreate.svelte'

	const actions = ['create', 'manage'] as const
	let view: typeof actions[number] = 'create'

	let altAddressInput = ''

	const loadALT = async () => {
		$ALTState.isLoading = true
		try {
			const altAccountPk = new PublicKey(altAddressInput)
			const altAccount = await connection.getAddressLookupTable(altAccountPk)

			if (!altAccount.value) {
				return
			}

			$ALTState.data = { state: altAccount.value.state, address: altAccountPk }
		} catch (error) {}
		$ALTState.isLoading = false
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
			addresses: addressesToExtend.slice(0, -1).map((addr) => new PublicKey(addr)),
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

<!-- <header class="w-full flex items-center justify-center gap-4 mt-8 mb-6">
	{#each actions as action}
		<button
			class="text-gray-400 hover:text-blue-500 text-base font-medium"
			on:click={() => (view = action)}>{action[0].toUpperCase()}{action.slice(1)}</button
		>
	{/each}
</header> -->

<!-- <main class="w-full bg-gray-700 ">dfasd</main> -->

<!-- {#if view === 'create'}
	<main class="max-w-[500px] w-full mx-auto bg-gray-800 rounded-md">
		<AltCreate />
	</main>
{:else}
	<main class="w-[80%] h-[80vh] mx-[10%] flex rounded-md rounded-r-xl bg-gray-700">
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

		<AltManager />
	</main>
{/if} -->
