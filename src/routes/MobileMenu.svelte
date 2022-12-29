<script lang="ts">
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'

	import SvgIconWrapper from '$lib/components/SvgIconWrapper.svelte'
	import { connection } from '$lib/global/connection'
	import { routes, childRoutes } from '$lib/global/routes'

	export let show = false
</script>

{#key show}
	<dialog
		open={show}
		class="fixed w-[calc(100vw+200px)] h-screen top-0 -left-[200px] bg-white/5 z-50 p-0"
		transition:fly|local={{
			duration: 200,
			opacity: 0,
			x: 200,
		}}
	>
		<div class="max-w-[320px] w-full h-full ml-auto bg-gray-800 rounded-l-lg p-5">
			<header class="flex gap-4">
				<button
					class="w-8 h-8 shrink-0 hover:bg-gray-700 focus:bg-gray-700 rounded-md"
					on:click={() => (show = false)}
				>
					<svg class="w-full h-full text-gray-200" viewBox="0 0 24 24" fill="none">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke="currentColor"
							d="m5.5 5.5 13 13m-13 0 13-13"
						/>
					</svg>
				</button>

				<div class="w-full flex flex-col bg-gray-700 rounded-md px-4 py-1 text-right">
					<label for="rpc-node" class="text-gray-400 text-[.95rem]">RPC Node</label>
					<p id="rpc-node" class="text-gray-200 text-base font-medium">{connection.rpcEndpoint}</p>
				</div>
			</header>
			<nav class="mt-12">
				<ul class="flex flex-col gap-4">
					{#each routes as { name, icon, path, isActive, hasChildren }}
						<li class="text-right">
							{#if hasChildren && childRoutes[path]}
								<p
									class="flex items-center justify-end gap-2 font-medium {isActive(
										$page.url.pathname,
									)
										? 'text-gray-200'
										: 'text-gray-400'}"
								>
									<span class="w-6 h-6">
										<SvgIconWrapper>
											<path
												d="M5 8.5L12 15.5L19 8.5"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</SvgIconWrapper>
									</span>
									{name}
									<span class="w-6 h-6">
										{@html icon}
									</span>
								</p>
								<ul class="mt-2 flex flex-col gap-2">
									{#each childRoutes[path] as { name: childName, path: childPath, isActive: childIsActive }}
										<li class="pr-10">
											<a
												href={childPath}
												class={childIsActive($page.url.pathname)
													? 'text-gray-200'
													: 'text-gray-400 hover:text-gray-200 focus:text-gray-200'}>{childName}</a
											>
										</li>
									{/each}
								</ul>
							{:else}
								<a
									href={path}
									data-sveltekit-preload-data
									class="flex items-center justify-end gap-2 font-medium {isActive(
										$page.url.pathname,
									)
										? 'text-gray-200'
										: 'text-gray-400 hover:text-gray-200 focus:text-gray-200'}"
								>
									{name}
									<span class="w-6 h-6">
										{@html icon}
									</span>
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</dialog>
{/key}
