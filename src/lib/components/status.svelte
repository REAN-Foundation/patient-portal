<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let message: string;
    export let generateOtp: boolean = false;
    export let invalidOtp: boolean = false;
    export let title: string;
    
    const dispatch = createEventDispatcher();

    const handleOnClick = () => {
        if (generateOtp) {
            dispatch('generateOtp');
        }
        if (invalidOtp) {
            dispatch('reenterOtp');
        }
        dispatch('home')
    }

    let buttonName: string = null;

    if (generateOtp) {
        buttonName = 'Generate Otp';
    }

    if (invalidOtp) {
        buttonName = 'Ok';
    }

    if (! generateOtp && ! invalidOtp) {
        buttonName = "Home"
    }

</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="border-2 rounded-xl bg-white text-black w-full sm:w-2/5 md:w-2/5 lg:w-2/5 xl:w-2/5 h-auto p-4 space-y-2 shadow-md text-center">
    <div class=" flex justify-center">
        {#if title === 'cancel'}
            <img src="/thanks.png" alt="success" class="mr-1 w-6 h-6 ">
            {:else if title === 'success'}
                <img src="/Success.png" alt="success" class="mr-1 w-6 h-6 ">
                {:else if title === 'invalidotp' || title === 'regenerate'}
                    <img src="/alert.png" alt="success" class="mr-1 w-6 h-6 ">
                {:else}
                    <img src="/error.png" alt="success" class="mr-1 w-6 h-6 ">
                {/if}

        
       <p class="card-body max-h-[200px] overflow-hidden text-black ">{message}</p>
        </div>
   
        {#if buttonName}
            <div class="border-b-2 border-blur"></div>
            <button on:click={handleOnClick} class="btn variant-filled-secondary mb-6 w-[30%]">{buttonName}</button>
        {/if}
        
    </div>
</div>
