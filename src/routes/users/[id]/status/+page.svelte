<script lang="ts">
	import { goto } from '$app/navigation';
    import type { PageServerData } from './$types'
    import Status from '$lib/components/status.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import {
        invalidOtpMessage,
        regenerateMessage,
        serverErrorMessage,
        successMessage,
        thanksMessage
    } from '$lib/types/message.types';

    export let data: PageServerData;
    $: statusCode = data.statusCode;
    $: phone = data.phone;
    const patientUserId = data.patientUserId;
    $: console.log('STATUS CODE ',statusCode)
    const handleGenerateOtpClick = async (e) => {

        console.log('handling generate otp click...',phone);
        const response = await fetch('/api/server/otp', {
            method: "POST",
            body: JSON.stringify({
                phone,
                purpose: 'Login',
            }),
            headers: {
				'content-type': 'application/json'
			}
        })

        const data = await response.json();

        if (data.Status === 'failure' || data.HttpCode !== 200) {
            goto(`/patient/delete/confirm/status?code=${serverErrorMessage}`)
        } else {
            toast.success('OTP has been successfully generated!');
            goto(`/patient/delete/confirm/?phone=${phone}`);
        }
    }

    const handleReenterOtpClick = () => {
        console.log('handling re enter otp click...');
        goto(`/patient/delete/confirm/?phone=${phone}`);
    }

    const handleHomeClick = (event) => {
        console.log('handling home click...');
        // const result = event.detail.statusCode === 'cancel'
        // console.log(result);
        if (event.detail.statusCode === 'cancel') {
            goto(`/users/${patientUserId}/home`);
        } else {
            goto(`/`);
        }
        
    }
</script>

<div  >
    {#if statusCode === 'cancel'}
        <Status title={statusCode} on:home={handleHomeClick} message={thanksMessage}></Status>
    {:else if statusCode === 'success'}
        <Status title={statusCode} on:home={handleHomeClick} message={successMessage}></Status>
        {:else if statusCode === 'invalidotp'}
            <Status title={statusCode} on:reenterOtp={handleReenterOtpClick}  message={invalidOtpMessage} invalidOtp={true} ></Status>
                {:else if statusCode === 'regenerate'}
                    <Status title={statusCode} on:generateOtp={handleGenerateOtpClick}  message={regenerateMessage} generateOtp={true}></Status>
                {:else}
                    <Status title={statusCode} on:home={handleHomeClick} message={statusCode}></Status>
    {/if}
</div>
