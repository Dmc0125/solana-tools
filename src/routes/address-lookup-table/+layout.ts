import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ url }) => {
  if (url.pathname === '/address-lookup-table') {
    throw redirect(301, '/address-lookup-table/create')
  }
}