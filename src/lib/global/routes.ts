type Route = {
	name: string
	path: string
	isActive: (pathname: string) => boolean,
	icon?: string
	hasChildren?: boolean,
}

const searchIcon = `
<svg class="w-full h-full text-current" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
	<path
		d="M15 15L19.5 19.5M16.5 10.5C16.5 13.8137 13.8137 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C13.8137 4.5 16.5 7.18629 16.5 10.5Z"
		stroke="currentColor"
		stroke-linecap="round"
	/>
</svg>
`

const dbIcon = `
<svg class="w-full h-full text-current" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
	<path
		d="M19.5 8C19.5 8 20 4.5 12 4.5C4.00005 4.5 4.5 8 4.5 8M19.5 8C19.5 8 20.0001 11.5 12 11.5C4.00005 11.5 4.5 8 4.5 8M19.5 8V12M4.5 8V12M4.5 12C4.5 12 3.99995 15.5 12 15.5C20.0001 15.5 19.5 12 19.5 12M4.5 12L4.49999 16C4.49999 16 3.99995 19.5 12 19.5C20 19.5 19.5 16 19.5 16V12"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
`

export const routes: Route[] = [
	{
		name: 'Account parser',
		path: '/',
		isActive: (pathname: string) => pathname === '/',
		hasChildren: false,
		icon: searchIcon,
	},
	{
		name: 'Address lookup table',
		path: '/address-lookup-table',
		isActive: (pathname: string) => pathname.includes('/address-lookup-table'),
		hasChildren: true,
		icon: dbIcon,
	},
]

export const childRoutes: Record<string, Route[]> = {
	'/address-lookup-table': [
		{
			name: 'Create',
			path: '/address-lookup-table/create',
			isActive: (pathname: string) => pathname.includes('/address-lookup-table/create'),
		},
		{
			name: 'Manage',
			path: '/address-lookup-table/manage',
			isActive: (pathname: string) => pathname.includes('/address-lookup-table/manage'),
		},
	],
}
