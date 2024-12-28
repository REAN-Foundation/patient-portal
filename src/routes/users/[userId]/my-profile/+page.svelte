<script lang="ts">
	import type { PageServerData } from './$types';
	import {
		getInitials,
		separatePhoneNumber,
		isValidEmail,
		formatBirthdate
	} from '$lib/utils.ts/functions';
	import Image from '$lib/components/image.svelte';
	import Icon from '@iconify/svelte';
	import { browser } from '$app/environment';
	import { db } from '$lib/utils.ts/local.db';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import ConfirmModal from '$lib/components/modal/confirm.modal.svelte';

	///////////////////////////////////////////////////////////////////////////

	export let form;
	export let data: PageServerData;

	$: data;
	const userId = $page.params.userId;
	const addressObject = data.healthProfile.Patient.User.Person.Addresses;

	const personObject = data.healthProfile.Patient.User.Person;
	const healthObject = data.healthProfile.Patient.HealthProfile;

	const displayName = personObject.DisplayName;
	const initials = getInitials(displayName);

	let firstname = personObject.FirstName || '';
	let lastname = personObject.LastName || '';
	let email = personObject.Email || '';
	let phone = personObject.Phone || '';
	let gender = personObject.Gender || '';
	let maritalStatus = healthObject.MaritalStatus || '';
	let imageUrl = personObject.ProfileImageURL ?? undefined;
	let imageResourceId = personObject.ImageResourceId ?? undefined;
	let dateOfBirth = formatBirthdate(personObject.BirthDate) || '';
	let formattedDateOfBirth = dateOfBirth.split('-').reverse().join('-');
	let race = healthObject.Race || '';
	let ethnicity = healthObject.Ethnicity || '';
	let strokeSurvivorOrCaregiver = healthObject.StrokeSurvivorOrCaregiver || '';
	let workedPriorToStroke =
		healthObject.WorkedPriorToStroke === true
			? 'true'
			: healthObject.WorkedPriorToStroke === false
				? 'false'
				: '';
	let livingAlone =
		healthObject.LivingAlone === true ? 'true' : healthObject.LivingAlone === false ? 'false' : '';

	let { countryCode, mobileNumber } = separatePhoneNumber(phone);

	let addressid: string = '';
	let addresLine: string = '';
	let city: string = '';
	let state: string = '';
	let country: string = '';
	let postalCode: string = '';

	$: if (addressObject.length > 0) {
		let firstAddress = addressObject[0];
		addressid = firstAddress.id || '';
		addresLine = firstAddress.AddressLine || '';
		city = firstAddress.City || '';
		state = firstAddress.State || '';
		country = firstAddress.Country || '';
		postalCode = firstAddress.PostalCode || '';
	}

	let previewImage = null;
	let fileInput: HTMLInputElement;

	let errorMessage = {
		Text: '',
		Colour: 'border-b-surface-700'
	};
	const MAX_FILE_SIZE = 1024 * 150;

	const onFileSelected = async (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		const fileSize = file.size;
		if (fileSize > MAX_FILE_SIZE) {
			errorMessage.Text = 'File should be less than 150 KB';
			errorMessage.Colour = 'error-text';
			fileInput.value = '';
			return;
		}
		errorMessage.Text = null;
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				previewImage = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const onDeleteImage = async () => {
		const response = await fetch(
			`/api/server/file-resources/delete?imageResourceId=${imageResourceId}`,
			{
				method: 'DELETE',
				headers: { 'content-type': 'application/json' }
			}
		);

		const resp = await response.text();
		const model = {
			ImageResourceId: imageResourceId,
			sessionId: data.sessionId,
			userId: userId
		};

		const response2 = await fetch(`/api/server/user/update-profile-image`, {
			method: 'POST',
			body: JSON.stringify(model),
			headers: { 'content-type': 'application/json' }
		});
		const url = imageUrl.toLowerCase();
		if (browser) {
			try {
				await db.imageCache.where({ srcUrl: url }).delete();
				console.log(`Deleted image from cache: ${url}`);
			} catch (error) {
				console.error('Error deleting image from cache:', error);
			}
		}

		invalidate('app:my-profile');
	};

	let showDeleteButton = false;
	let showModal = false;

	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
		showDeleteButton = false;
	};
</script>

<form action="?/updateprofile" method="post" enctype="multipart/form-data">
	<div class="my-profile">
		<h1 class="my-settings">My Settings</h1>
		<div class="grid grid-cols-4 gap-8">
			<div>
				<h2 class="personal-Info">Personal Information</h2>
				<p class=" text-info">Your personal information and account security settings.</p>
				<div class="hidden md:flex items-center mt-7">
					<div class="profile-container flex flex-col items-center gap-4">
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="relative hidden md:flex justify-center items-center"
							on:mouseenter={() => (showDeleteButton = true)}
							on:mouseleave={() => (showDeleteButton = false)}
						>
							{#if previewImage !== null}
								<img src={previewImage} alt="Preview" class="profile-image" />
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{:else if imageUrl !== undefined}
								<Image source={imageUrl} w="36" h="36" cls="profile-image" />
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{:else}
								<label for="fileinput" class="cursor-pointer">
									<div
										class="bg-secondary text-info h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full flex items-center justify-center text-3xl my-4 border border-outline"
									>
										{initials}
									</div>
								</label>
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{/if}
							<input
								id="fileinput"
								type="file"
								class="hidden"
								accept="image/*"
								name="file"
								on:change={onFileSelected}
								bind:this={fileInput}
							/>
							{#if showDeleteButton && imageResourceId !== undefined}
								<button
									class="absolute -top-2 left-2 text-error-500 bg-white p-1 rounded-full shadow hover:bg-error-100"
									on:click|preventDefault={openModal}
								>
									<label class="camera-icon" title="Delete Image">
										<Icon icon="mdi:close" class="h-4 w-4" />
									</label>
								</button>
								<ConfirmModal
									bind:show={showModal}
									title="Delete Image"
									message="Are you sure you want to delete this image? This action cannot be undone."
									confirmButtonText="Delete"
									close={closeModal}
									confirm={onDeleteImage}
								/>
							{/if}
						</div>
						{#if errorMessage && errorMessage.Text}
							<p class={errorMessage.Colour}>{errorMessage.Text}</p>
						{/if}
						<div class="flex flex-col">
							<span class="display-name">{personObject.DisplayName || 'Unknown'}</span>
							<span class="display-name">{phone}</span>
						</div>
					</div>
					<input type="hidden" name="imageResourceId" value={imageResourceId} />
					{#if form?.errors?.imageResourceId}
						<p class="text-error-500 text-xs">{form?.errors?.imageResourceId[0]}</p>
					{/if}
				</div>
			</div>
			<div class="col-span-3 mx-6">
				<div class="flex md:hidden items-center">
					<!-- <div class="profile-container flex items-center gap-4">
						{#if imageUrl === undefined}
							<label for="fileinput" class="cursor-pointer">
								<div class="profile-icon">
									{initials}
								</div>
							</label>
							<input
								id="fileinput"
								name="fileinput"
								type="file"
								class="hidden"
								placeholder="Image"
								on:change={async (e) => await onFileSelected(e)}
							/>
						{:else}
							<label for="fileinput" class="cursor-pointer">
								<Image cls="h-36 w-36 rounded-full" source={imageUrl} w="36" h="36" />
							</label>
							<input
								id="fileinput"
								name="fileinput"
								type="file"
								class="hidden"
								bind:this={profileImage}
								placeholder="Image"
								on:change={async (e) => await onFileSelected(e)}
							/>
						{/if}
						<div class ="flex flex-col">
							<span class="text-lg text-info">{personObject.DisplayName || 'Unknown'}</span>
							<span class="text-info opacity-50">{phone}</span>
						</div>
					
					</div> -->
					<div class="profile-container flex flex-col items-center gap-4">
						<div class="relative flex md:hidden justify-center items-center">
							{#if previewImage !== null}
								<img src={previewImage} alt="Preview" class="profile-image" />
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{:else if imageUrl !== undefined}
								<Image source={imageUrl} w="20" h="36" cls="profile-image" />
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{:else}
								<label for="fileinput" class="cursor-pointer">
									<div
										class="bg-secondary text-info h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full flex items-center justify-center text-3xl my-4 border border-outline"
									>
										{initials}
									</div>
								</label>
								<label for="fileinput" class="absolute camera-icon" title="Update Image">
									<Icon icon="ant-design:camera-outlined" class="h-6 w-6" />
								</label>
							{/if}
							<input
								id="fileinput"
								type="file"
								class="hidden"
								accept="image/*"
								name="file"
								on:change={onFileSelected}
								bind:this={fileInput}
							/>
						</div>
						{#if errorMessage && errorMessage.Text}
							<p class={errorMessage.Colour}>{errorMessage.Text}</p>
						{/if}
						<div class="flex flex-col">
							<span class="display-name">{personObject.DisplayName || 'Unknown'}</span>
							<span class="display-name">{phone}</span>
						</div>
					</div>
					<input type="hidden" name="imageResourceId" value={imageResourceId} />
					{#if form?.errors?.imageResourceId}
						<p class="text-error-500 text-xs">{form?.errors?.imageResourceId[0]}</p>
					{/if}
				</div>

				<div>
					<label class="label" for="FirstName">First Name</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						placeholder="First Name"
						class="input"
						bind:value={firstname}
					/>
				</div>
				<div>
					<label class="label" for="LastName">Last Name</label>
					<input
						type="text"
						id="LastName"
						name="lastName"
						placeholder="Last Name"
						class="w-full input"
						bind:value={lastname}
					/>
				</div>
				<div>
					<label class="label" for="Gender">Sex</label>
					<div class="relative">
						<select id="Gender" class="input" name="gender" bind:value={gender}>
							<option value="" disabled selected>Select an option</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Intersex">Intersex</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>
				<!-- <div>
					<label class="label" for="BirthDate">Date Of Birth</label>
					<input
						type="date"
						id="BirthDate"
						placeholder="MM-DD-YYYY"
						name="birthDate"
						class=" input "
						bind:value={formattedDateOfBirth}
					/>
				</div> -->
				<div>
					<label class="label" for="MaritalStatus">Marital Status</label>
					<div class="relative">
						<select
							id="MaritalStatus"
							name="maritalStatus"
							class=" input"
							bind:value={maritalStatus}
						>
							<option value="Married">Married</option>
							<option value="Single">Single</option>
							<option value="Divorced">Divorced</option>
							<option value="Widowed">Widowed</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>
				<!-- <div>
					<label class="label" for="Phone">Mobile Number</label>
					<div class="flex flex-row space-x-2">
						<select class="select" name="countryCode" bind:value={countryCode}>
							<option value="+1">+1</option>
							<option value="+91">+91</option>
							<option value="+44">+44</option>
							<option value="+61">+61</option>
						</select>
						<input
							type="tel"
							id="Phone"
							placeholder="Phone"
							name="phone"
							pattern="[0-9]*"
							inputmode="numeric"
							minlength="10"
							maxlength="10"
							class="input"
							bind:value={mobileNumber}
							required
						/>
					</div>
				</div> -->
				<input hidden type="text" name="phone" bind:value={phone} />
				<!-- <input hidden type="text" name="countryCode" bind:value={countryCode} /> -->
				<div>
					<label class="label" for="email">Email</label>
					<input
						type="email"
						id="email"
						placeholder="Email"
						name="email"
						class="input"
						bind:value={email}
					/>
					{#if !isValidEmail(email) && email}
						<p class="error-text">Please enter a valid email address.</p>
					{/if}
				</div>
			</div>
		</div>
		<hr class="hr-line" />
		<div class="grid grid-cols-4 gap-8">
			<div>
				<h2 class="demogrphic-info">Demographic Information</h2>
			</div>
			<div class="col-span-3 mx-6">
				<div>
					<label class="label" for="Race">What is your race?</label>
					<div class="relative">
						<select id="Race" name="race" class="input" bind:value={race}>
							<option value="Prefer not to say" selected>Prefer not to say</option>
							<option value="American Indian/Alaskan Native">American Indian/Alaskan Native</option>
							<option value="Asian">Asian</option>
							<option value="Black/African American">Black/African American</option>
							<option value="Native Hawaiin or Other Pacific Islander"
								>Native Hawaiin or Other Pacific Islander</option
							>
							<option value="White">White</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>
				<div>
					<label class="label" for="Ethnicity">What is your ethnicity?</label>
					<div class="relative">
						<select id="Ethnicity" name="ethnicity" class="input" bind:value={ethnicity}>
							<option value="Prefer not to say" selected>Prefer not to say</option>
							<option value="Hispanic/Latino">Hispanic/Latino</option>
							<option value="Not Hispanic/Latino">Not Hispanic/Latino</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<hr class=" hr-line" />
		<div class="grid grid-cols-4 gap-8">
			<div>
				<h2 class="health-history">Health And Stroke History</h2>
			</div>
			<div class="col-span-3 mx-6">
				<div>
					<label class="label" for="StrokeSurvivorOrCaregiver"
						>Are you a stroke survivor or caregiver?</label
					>
					<div class="relative">
						<select
							id="StrokeSurvivorOrCaregiver"
							name="strokeSurvivorOrCaregiver"
							class="input"
							bind:value={strokeSurvivorOrCaregiver}
						>
							<option value="Survivor">Survivor</option>
							<option value="Caregiver">Caregiver</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>
				<div>
					<label class="label" for="WorkedPriorToStroke">Did you work prior to your stroke?</label>
					<div class="relative">
						<select
							id="WorkedPriorToStroke"
							name="workedPriorToStroke"
							class=" input"
							bind:value={workedPriorToStroke}
						>
							<option value="true">Yes</option>
							<option value="false">No</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>

				<div>
					<label class="label" for="LivingAlone">Do you live alone?</label>
					<div class="relative">
						<select id="LivingAlone" name="livingAlone" class=" input" bind:value={livingAlone}>
							<option value="true">Yes</option>
							<option value="false">No</option>
						</select>
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon icon="mdi:chevron-down" class="text-xl text-info" />
						</div>
					</div>
				</div>

				<div class="flex justify-end">
					<button class="save-changes" type="submit"> Save changes </button>
				</div>
			</div>
		</div>
	</div>
</form>
