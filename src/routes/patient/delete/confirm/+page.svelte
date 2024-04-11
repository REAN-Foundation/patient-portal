<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { PageServerData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
    import {PatientPortalHelper} from '$lib/utils/patient.portal.helper';
    import toast, { Toaster } from 'svelte-french-toast';
	
    export let data: PageServerData;
    let phone = data.phone;
    let isConfirm = false;
    const modalStore = getModalStore();
    let enteredOtp;

	let otp = ['', '', '', '', '', ''];

	// Array to hold references to OTP input elements
	let otpInputs: Array<HTMLInputElement> = [];

    $:console.log(otp)
    $: enteredOtp = otp.join('');

    $: console.log('Enter OTP input', enteredOtp);
	// Function to handle OTP input and auto-focus
	const handleOtpInput = (index: number) => {
		// Remove non-numeric characters from the input
		otp[index] = otp[index].replace(/\D/g, '');

		// Auto-focus on the next input if available
		if (index < otpInputs.length - 1 && otp[index].length === 1) {
			otpInputs[index + 1].focus();
		}
	};

	const handleSubmit = async () => {
		 modalStore.trigger(modal);
	};

	const handleConfirm = async (phone: string, otp: string) => {
        console.log('handling on confirm .....')

        // Do login with phone & otp and set cookies 
        const response = await fetch(`/api/server/login`, {
			method: 'POST',
			body: JSON.stringify({
                phone,
                otp,
            }),
			headers: {
				'content-type': 'application/json'
			}
		});

        const data = await response.json();

        console.log('Data',data);
        if (data.Status === 'failure' || data.HttpCode !== 200) {
            const status = PatientPortalHelper.getLoginStatus(data);
            goto(`/patient/delete/confirm/status?phone=${phone}&code=${status}`)
        } else {
        //Perform Delete patient
        let patientId = data.PatientUserId;
        console.log('Patient Id',patientId);
        const deleteResponse = await fetch(`/api/server/delete`, {
			method: 'DELETE',
			body: JSON.stringify({
                patientId
            }),
			headers: {
				'content-type': 'application/json'
			}
		});
        const deletedData = await deleteResponse.json();

        console.log('Deleted Data',deletedData);
        const status = PatientPortalHelper.getPatientDeleteStatus(deletedData);
        goto(`/patient/delete/confirm/status?code=${status}`);
        }
 	};

	const handleCancel = () => {
		console.log('Delete cancelled.');
        goto(`/patient/delete/confirm/status?code=cancel`);
	};

	// Modal settings
	const modal: ModalSettings = {
		type: 'confirm',
		title: 'Delete',
		body: 'Please note that once the account is deleted, all the associated data for your account will also be removed.',

		response: (clicked: boolean) => {
			if (clicked) {
                isConfirm = true;
                console.log('Confirm clicked')
				const otpValue = otp.join('');
                handleConfirm(phone, otpValue);
 			} else {
                isConfirm = true;
                console.log('Cancelled clicked')
                handleCancel();
           }
		}
	};
</script>

<!-- Svelte component structure -->
<Modal background="bg-white text-black "/>

<!-- Fixed header with a specific color -->
<div class="fixed top-0 h-20 w-full bg-[#7165e3]"></div>

<!-- Main content area with a white background -->
<div class=" bg-white">
	<!-- Form for mobile number and OTP input -->
	<form 
    on:submit|preventDefault={handleSubmit}
    class=" relative z-30">
		<div class="flex items-center justify-center h-screen">
			<div class="border-2 rounded-3xl py-16 px-8 bg-gray-100">
				<!-- Input field for mobile number -->
				<div class="text-start mb-4">
					<label for="mobile" class="block mb-2 text-black">Mobile no :</label>
					<input
						type="tel"
						bind:value={phone}
                        disabled
						name='phone'
						pattern="[0-9]*"
						inputmode="numeric"
						placeholder=""
						class=" w-[280px] px-4 py-2 border rounded-xl text-gray-700"
						readonly={phone !== ''}
						required
					/>
				</div>

				<!-- Input fields for OTP -->
				<label for="otp" class="block mb-2 text-black"> Enter Otp :</label>
				<div class="flex gap-2">
					{#each Array(6) as _, i}
						<input
							type="tel"
							bind:value={otp[i]}
							on:input={() => handleOtpInput(i)}
							maxlength="1"
							pattern="[0-9]"
							inputmode="numeric"
							class="w-10 px-2 py-2 border rounded-md text-center text-gray-700"
							bind:this={otpInputs[i]}
							required
						/>
					{/each}
				</div>
                <input type="text" hidden name="otp" bind:value={enteredOtp}>
                <input type="text" hidden name="isConfirm" bind:value={isConfirm}>
				<!-- Submit button -->
				<div class="flex justify-center">
					<button type="submit" class="mt-8 px-28 py-2 bg-[#7165e3] text-white rounded-md"
						>Submit</button
					>
				</div>
			</div>
		</div>
	</form>
</div>

<!-- Fixed footer with a specific color -->
<div class=" fixed z-10 bottom-0 h-[400px] w-full bg-[#5832a1]"></div>
