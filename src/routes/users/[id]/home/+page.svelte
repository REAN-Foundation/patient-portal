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
<!-- <h1>This is home page of the user</h1>
<h1>{JSON.stringify(data.user)}</h1>
<button on:click={handleDelete}>Delete Account</button>
<button on:click={handleLogout}>Logout</button> -->
<div class="bg-[#F3F4F6]">
<div class="absolute top-0 right-0 mt-2 mr-2">
    <button on:click={handleLogout} class="variant-filled-secondary text-white px-4 py-2 rounded-lg">Sign Out</button>
    <button on:click={handleDelete} class="variant-filled-secondary text-white px-4 py-2 rounded-lg ml-2">Delete Account</button>
  </div>
<div class="flex justify-center items-center min-h-screen mx-8">
    <div class="relative w-full md:max-w-md bg-white rounded-xl overflow-hidden shadow-lg">
      <div class="variant-filled-secondary text-white py-4 text-center text-xl">
        Welcome User!
      </div>
      <div class="p-8">
        <p class="text-lg text-black">
          <span class="font-semibold ">First Name:</span> {data.user.FirstName}<br>
          <span class="font-semibold">Middle Name:</span> {data.user.MiddleName}<br>
          <span class="font-semibold">Last Name:</span> {data.user.LastName}<br>
          <span class="font-semibold">Gender:</span> {data.user.Gender}<br>
          <span class="font-semibold">Birth Date:</span> {data.user.BirthDate}<br>
          <span class="font-semibold">Phone:</span> {data.user.Phone}
        </p>
      </div>
    </div>
  </div>
</div>
