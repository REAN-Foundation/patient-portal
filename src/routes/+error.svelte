<script>
    import {page} from '$app/stores'
    import Status from '$lib/components/status.svelte';
</script>

<Status title={($page.status).toString()} message={$page.error?.message}></Status>

