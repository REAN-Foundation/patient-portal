<!-- <script lang="ts">
    import toast, {Toaster} from 'svelte-french-toast'
	import '../app.postcss';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>
<Toaster />
<slot /> -->
<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { initFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
	import { initializeStores } from '@skeletonlabs/skeleton';

	//////////////////////////////////////////////////////////////////////////////
	
	const flash = initFlash(page);
	initializeStores();
	beforeNavigate((nav) => {
		if ($flash && nav.from?.url.toString() != nav.to?.url.toString()) {
			$flash = undefined;
		}
	});

	flash.subscribe(($flash) => {
		if (!$flash) return;

		toast($flash.message, {
			icon: $flash.type == 'success' ? '✅' : '❌'
		});

		flash.set(undefined);
	});
</script>

<Toaster />
<slot />
