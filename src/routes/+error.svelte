<script>
    import {page} from '$app/stores'
    import Status from '$lib/components/status.svelte';
</script>

<!-- <div class="flex justify-center items-center h-screen">
    <h1>{$page.status} : {$page.error?.message}</h1>
</div> -->

<Status title={($page.status).toString()} message={$page.error?.message}></Status>

