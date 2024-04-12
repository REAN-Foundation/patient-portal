<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="flex h-96 flex-col justify-center items-center">
    <h1 class="m-10 font-extrabold text-[7rem] text-primary-500">{$page.status}</h1>
    <h2 class="m-6 font-semibold text-[1.8rem]">{$page.error.message}</h2>
</div>
