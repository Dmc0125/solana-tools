import type { AddressLookupTableState, PublicKey } from '@solana/web3.js'
import { writable } from 'svelte/store'

type ALTDataType = {
	state: AddressLookupTableState
	address: PublicKey
}

type ALTStateType = {
	isLoading: boolean
	data: ALTDataType | null
}

export const ALTState = writable<ALTStateType>({
	isLoading: false,
	data: null,
})
