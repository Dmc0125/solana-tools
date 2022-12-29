<script lang="ts">
	import { AddressLookupTableProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core'
	import { buildTransaction, sendTransaction } from 'solana-tx-utils'

	import Button from '$lib/components/Button.svelte'
	import { connection } from '$lib/global/connection'

	let ALTAddresses: string[] = ['']
	let ALTErrors: (string | null)[] = []

	const validateAddresses = () => {
		let err = false
		ALTAddresses.slice(0, -1).forEach((addr, i) => {
			try {
				const x = new PublicKey(addr)
				ALTErrors[i] = null
			} catch {
				err = true
				ALTErrors[i] = 'Invalid address'
			}
		})
		return err
	}

	$: {
		if (ALTErrors.some(Boolean) && ALTAddresses.length > 1) {
			validateAddresses()
		}
	}

	const removeALTAddress = (i: number) => {
		ALTAddresses = ALTAddresses.filter((_, _i) => _i !== i)
		ALTErrors = ALTErrors.filter((_, _i) => _i !== i)
	}

	$: {
		if (ALTAddresses.at(-1)?.length && ALTAddresses.length < 256) {
			ALTAddresses.push('')
		}
	}

	const createALT = async () => {
		const err = validateAddresses()

		if (!$walletStore.publicKey || err) {
			return
		}

		const slot = await connection.getSlot()
		const [createALTIx, ALTAddress] = AddressLookupTableProgram.createLookupTable({
			payer: $walletStore.publicKey,
			authority: $walletStore.publicKey,
			recentSlot: slot,
		})

		const addrsBatches: PublicKey[][] = []
		if (ALTAddresses.length > 1 && ALTAddresses.length < 15) {
			const extendALTIx = AddressLookupTableProgram.extendLookupTable({
				payer: $walletStore.publicKey,
				authority: $walletStore.publicKey,
				lookupTable: ALTAddress,
				addresses: ALTAddresses.map((addr) => new PublicKey(addr)),
			})
			const { transaction, lastValidBlockHeight } = await buildTransaction(
				{
					instructions: [createALTIx, extendALTIx],
					payerKey: $walletStore.publicKey,
				},
				connection,
			)
			await $walletStore.signTransaction!(transaction)
			const res = await sendTransaction(
				{
					lastValidBlockHeight,
					transaction,
					connection,
				},
				{ log: true },
			)
			console.log(res)
		} else if (ALTAddresses.length) {
			let addresses: PublicKey[] = []
			ALTAddresses.forEach((addr, i) => {
				addresses.push(new PublicKey(addr))

				if (addresses.length === 16 || (!addrsBatches.length && addresses.length === 15)) {
					addrsBatches.push(addresses)
					addresses = []
				}
			})
			addrsBatches.push(addresses)
		}
	}
</script>

<svelte:head>
	<title>Create address lookup table</title>
</svelte:head>

<form
	class="h-full w-full px-4 py-5 bg-gray-700 rounded-t-lg flex flex-col gap-6"
	on:submit|preventDefault={createALT}
>
	<header class="w-full">
		<h2 class="mb-3 font-medium text-xl text-gray-200">Create address lookup table</h2>
		<p class="text-gray-400">
			Address lookup table (ALT) can be created with or without account addresses.
		</p>
	</header>

	<div class="h-full grid grid-rows-[auto_1fr_auto]">
		<h3 class="font-medium text-base text-gray-200">ALT Addresses</h3>

		<ul class="w-full mt-2 flex flex-col gap-4">
			{#each ALTAddresses as addr, i}
				<li class="flex items-center gap-2 {ALTErrors[i] ? 'mb-5' : ''}">
					<div
						class="
							w-full pl-4 bg-gray-800 rounded-md h-10 flex items-center focus-within:outline outline-2 outline-offset-2 relative
							{ALTErrors[i] ? 'outline outline-red-500' : 'outline-blue-500'}
						"
					>
						<span class="text-gray-500 text-base mr-3">{i + 1}</span>
						<input
							class="w-full h-10 pr-4 placeholder:text-base placeholder:text-gray-400 bg-transparent text-gray-200 focus:outline-none"
							type="text"
							bind:value={addr}
							placeholder="Address"
						/>
						{#if ALTErrors[i]}
							<p
								class="text-red-400 font-medium text-sm absolute left-0 -bottom-1 translate-y-full block w-full pl-4"
							>
								{ALTErrors[i]}
							</p>
						{/if}
					</div>
					{#if (i > 0 || ALTAddresses.length > 1) && i < ALTAddresses.length - 1}
						<button
							class="w-10 h-10 p-1 flex items-center justify-center hover:bg-gray-800 rounded-md shrink-0"
							type="button"
							on:click={() => removeALTAddress(i)}
						>
							<svg class="w-full h-full text-red-500" viewBox="0 0 24 24" fill="none">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke="currentColor"
									d="M10.5 11.5V15.5M4.5 8.5H6.5H4.5ZM19.5 8.5H17.5H19.5ZM17.5 8.5V18.5C17.5 19.0523 17.0523 19.5 16.5 19.5H7.5C6.94771 19.5 6.5 19.0523 6.5 18.5V8.5H17.5ZM17.5 8.5H16H17.5ZM6.5 8.5H8H6.5ZM8 8.5V6.5C8 5.94772 8.44772 5.5 9 5.5H15C15.5523 5.5 16 5.94772 16 6.5V8.5H8ZM8 8.5H16H8ZM13.5 11.5V15.5V11.5Z"
								/>
							</svg>
						</button>
					{/if}
				</li>
			{/each}
		</ul>

		{#if $walletStore.connected}
			<Button
				type="submit"
				class="w-full mt-4  font-medium text-gray-200 hover:bg-blue-400 bg-blue-500"
				>Create ALT</Button
			>
		{:else}
			<Button type="submit" class="w-full mt-4  font-medium text-gray-200 bg-gray-900" disabled
				>Wallet not connected</Button
			>
		{/if}
	</div>
</form>
