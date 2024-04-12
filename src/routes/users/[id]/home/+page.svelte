<script lang="ts">
	import type { PageServerData } from "./$types";
    import { Modal } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import {PatientPortalHelper} from '$lib/utils/patient.portal.helper';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { goto, invalidate, invalidateAll } from '$app/navigation';

    const modalStore = getModalStore();

    export let data: PageServerData;
    console.log(data.user);
    const patientUserId = data.user.PatientUserId;
    console.log('PatientUserId',patientUserId);
    let isConfirm = false;
    const handleDelete = async () => {
		 modalStore.trigger(modal);
	};

    const handleConfirm = async () => {
        console.log('handling on confirm .....')

        // Do login with phone & otp and set cookies 
        // const response = await fetch(`/api/server/login`, {
		// 	method: 'POST',
		// 	body: JSON.stringify({
        //         phone,
        //         otp,
        //     }),
		// 	headers: {
		// 		'content-type': 'application/json'
		// 	}
		// });

        // const data = await response.json();

        // console.log('Data',data);
        // if (data.Status === 'failure' || data.HttpCode !== 200) {
        //     const status = PatientPortalHelper.getLoginStatus(data);
        //     goto(`/patient/delete/confirm/status?phone=${phone}&code=${status}`)
        // } else {
        // //Perform Delete patient
        // let patientId = data.PatientUserId;
        // console.log('Patient Id',patientId);
        const deleteResponse = await fetch(`/api/server/delete`, {
			method: 'DELETE',
			body: JSON.stringify({
                patientUserId
            }),
			headers: {
				'content-type': 'application/json'
			}
		});
        const deletedData = await deleteResponse.json();

        console.log('Deleted Data',deletedData);
        const status = PatientPortalHelper.getPatientDeleteStatus(deletedData);
        // goto(`/patient/delete/confirm/status?code=${status}`);
        goto(`/users/${patientUserId}/status?code=${status}`);
        }

     const handleCancel = () => {
		console.log('Delete cancelled.');
        // goto(`/patient/delete/confirm/status?code=cancel`);
        goto(`/users/${patientUserId}/status?code=cancel`);
	};

    const handleLogout = async () => {
        console.log('Handling sign out click...');
        const response = await fetch(`/api/server/logout`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }
		});

		const resp = await response.text();
		console.log(`resp: ${JSON.stringify(resp, null, 2)}`);
		// LocalStorageUtils.removeItem('userRoles');
        // invalidate('app');
		window.location.href = '/';
        // goto('/');
    }

    const modal: ModalSettings = {
		type: 'confirm',
		title: 'Delete',
		body: 'Please note that once the account is deleted, all the associated data for your account will also be removed.',

		response: (clicked: boolean) => {
			if (clicked) {
                isConfirm = true;
                console.log('Confirm clicked')
				// const otpValue = otp.join('');
                handleConfirm();
 			} else {
                isConfirm = true;
                console.log('Cancelled clicked')
                handleCancel();
           }
		}
	};
</script>
<Modal background="bg-white text-black "/>
<h1>This is home page of the user</h1>
<h1>{JSON.stringify(data.user)}</h1>
<button on:click={handleDelete}>Delete Account</button>
<button on:click={handleLogout}>Logout</button>
