<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	
    import {
		getPublicLogoImageSource,
		getPublicFooterText,
		getPublicFooterLink,
		getSystemName,
	} from '$lib/themes/theme.selector';
    const logoImageSource = getPublicLogoImageSource();
    const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
    const footerLink = getPublicFooterLink();
    
    export let data: PageServerData;
    let phone = data.phone;
    let enteredOtp;

	let otp = ['', '', '', '', '', ''];
	let otpInputs: Array<HTMLInputElement> = [];

    $:console.log(otp)
    $: enteredOtp = otp.join('');
    $: console.log('OTP input elements',enteredOtp);
    $: console.log('Enter OTP input', enteredOtp);

	const handleOtpInput = (index: number) => {
		otp[index] = otp[index].replace(/\D/g, '');
		if (index < otpInputs.length - 1 && otp[index].length === 1) {
			otpInputs[index + 1].focus();
		}
	};
</script>

<div class="nav h-12 w-full bg-primary-700"></div>
<div class="w-full h-[92%]" id="background-image">
    <div class="bg-back-ground h-full w-full bg-primary-50">
        <div class="h-full w-full px-3">
            <div class=" flex justify-center flex-col items-center">
                <img
                    class="ct-image w-36 mt-7 mb-7"
                    alt="logo"
                    src={logoImageSource}
                />

                <form
                method="post"
	            action="?/login"
                use:enhance
				class=" shadow-bottom-right p-8 pb-1 pt-5 rounded-lg mt-5 bg-secondary-50 border border-slate-300 shadow-xl"
				>
					<div class="justify-center w-full mt-5 h-50">
						<label class="mb-2" for="phone">
							<span class="text-primary-500">Mobile Number</span>
							<span class="label-text-alt" />
						</label>
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
							<label class="mb-2 mt-2" for="password">
								<div class="grid grid-flow-col">
									<span class="text-left text-primary-500">Enter OTP</span>
								</div>
							</label>
                            
                            {#each Array(6) as _, i}
                                <input
                                    type="tel"
                                    bind:value={otp[i]}
                                    on:input={() => handleOtpInput(i)}
                                    maxlength="1"
                                    pattern="[0-9]"
                                    inputmode="numeric"
                                    class="w-10 m-1 px-2 py-2 border rounded-md text-center text-gray-700 mb-5"
                                    bind:this={otpInputs[i]}
                                    required
                                />
                            {/each}
                            <input hidden type="text" name=otp bind:value={enteredOtp}>
                            <input hidden type="text" name=phone bind:value={phone}>
							<br />
							<button type="submit" class="btn variant-filled-secondary mb-6 w-full">Submit</button>
						</div>
				</form>
            </div>
        </div>
    </div>
</div>

<footer class="w-full fixed bottom-0 bg-primary-900 text-center p-2">
    <a href={footerLink} class="!text-white">{footerText}</a>
</footer>

