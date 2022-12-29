import { Connection } from '@solana/web3.js'
import { PUBLIC_APP_ENV } from '$env/static/public'

const RPC_URL = PUBLIC_APP_ENV === 'prod' ? 'https://rpc.ankr.com/solana' : 'http://127.0.0.1:8899'

export const connection = new Connection(RPC_URL)
