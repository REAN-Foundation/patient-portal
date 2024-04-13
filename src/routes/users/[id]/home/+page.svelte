<script lang="ts">
	import type { PageServerData } from "./$types";
    import { Modal } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import {PatientPortalHelper} from '$lib/utils/patient.portal.helper';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';

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
        goto(`/users/${patientUserId}/status?code=${status}`);
        }

     const handleCancel = () => {
		console.log('Delete cancelled.');
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
		window.location.href = '/';
    }

    const modal: ModalSettings = {
		type: 'confirm',
		title: 'Delete',
		body: 'Please note that once the account is deleted, all the associated data for your account will also be removed.',

		response: (clicked: boolean) => {
			if (clicked) {
                isConfirm = true;
                console.log('Confirm clicked')
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
<div class="bg-[#F3F4F6]">
    <div class="absolute top-0 right-0 mt-2 mr-2">
      <button on:click={handleLogout} class="variant-filled-secondary text-white px-4 py-2 rounded-lg hover:border">Sign Out</button>
      <button on:click={handleDelete} class="variant-filled-secondary text-white px-4 py-2 rounded-lg ml-2 hover:border">Delete Account</button>
    </div>
    <div class="variant-filled-secondary text-white py-4 text-center text-xl">
      Welcome {data.user.DisplayName ? data.user.DisplayName : '' }
    </div>
    <div class="flex justify-center items-center min-h-screen mx-8">
      <div class="relative w-full md:max-w-lg bg-white rounded-xl overflow-hidden shadow-lg">
        <div class="variant-filled-secondary text-white py-6 text-center text-xl">
        </div>
        <div class="p-8 text-black">
          <table class="border-collapse w-full ">
            <tr>
              <td class="py-2 px-4 text-lg font-semibold">First Name</td>
              <td class="py-2 px-4 text-lg">{data.user.FirstName ? data.user.FirstName : '' }</td>
            </tr>
            <tr>
              <td class="py-2 px-4 text-lg font-semibold">Last Name</td>
              <td class="py-2 px-4 text-lg">{data.user.LastName ? data.user.LastName : '' }</td>
            </tr>
            <tr>
              <td class="py-2 px-4 text-lg font-semibold">Gender</td>
              <td class="py-2 px-4 text-lg">{data.user.Gender ? data.user.Gender : '' }</td>
            </tr>
            <tr>
              <td class="py-2 px-4 text-lg font-semibold">Birth Date</td>
              <td class="py-2 px-4 text-lg">{data.user.BirthDate ? new Date(data.user.BirthDate).toLocaleDateString() : '' }</td>
            </tr>
            <tr>
              <td class="py-2 px-4 text-lg font-semibold">Phone</td>
              <td class="py-2 px-4 text-lg">{data.user.Phone ? data.user.Phone : '' }</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
