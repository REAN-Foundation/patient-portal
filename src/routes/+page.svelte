<script lang="ts">
	import { enhance } from "$app/forms";


    import CountryCode from "$lib/components/country.code.svelte";
    import {
		getPublicLogoImageSource,
		getPublicFooterText,
		getPublicFooterLink,
		getSystemName,
	} from '$lib/themes/theme.selector';
    const logoImageSource = getPublicLogoImageSource();
    const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
    const footerLink = getPublicFooterLink();
    let countryCode = '';
    let phone;

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
	            action="?/generateOtp"

                class=" shadow-bottom-right p-8 pb-1 pt-5 rounded-lg mt-5 bg-secondary-50 border border-slate-300 shadow-xl"
				>
					<div class="justify-center w-full mt-5 h-50">
                        <label class="mb-2" for="phone">
							<span class="text-primary-500">Country Code</span>
							<span class="label-text-alt" />
						</label>
                        <CountryCode bind:countryCode stypeString = " w-[280px] px-4 py-2 border rounded-xl text-gray-700"></CountryCode>
						<input hidden type="text" name='countryCode' bind:value={countryCode}>
                        <label class="mb-2 mt-2" for="phone">
							<span class="text-primary-500">Mobile Number</span>
							<span class="label-text-alt" />
						</label>
                        <input
                            type="tel"
                            name='phone'
                            bind:value={phone}
                            pattern="[0-9]*"
                            inputmode="numeric"
                            placeholder=""
                            class=" w-[280px] px-4 py-2 border rounded-xl text-gray-700"
                            required
                        />
                        <br />
						<!-- <input
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
                        /> -->
							<!-- <label class="mb-2" for="password">
								<div class="grid grid-flow-col">
									<span class="text-left text-primary-500">Enter Otp :</span>
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
                            {/each} -->
							<br />
							<button type="submit" class="btn variant-filled-secondary mb-6 w-full">Login</button>
						</div>
				</form>
            </div>
        </div>
    </div>
</div>

<footer class="w-full fixed bottom-0 bg-primary-900 text-center p-2">
    <a href={footerLink} class="!text-white">{footerText}</a>
</footer>
<!-- <div class="fixed top-0 h-20 w-full bg-[#7165e3]"></div>

<div class=" bg-white">
	<form 
    method="post"
	action="?/generateOtp"

    class=" relative z-30">
		<div class="flex flex-row items-center justify-center h-screen">
            
			<div class="border-2 rounded-3xl py-16 px-8 bg-gray-100">
                <div class="text-start mb-4">
                    <label for="mobile" class="block mb-2 text-black">Country Code :</label>
                      <CountryCode bind:countryCode stypeString = " w-[280px] px-4 py-2 border rounded-xl text-gray-700"></CountryCode>
				</div>
                <input hidden type="text" name='countryCode' bind:value={countryCode}>
    			<div class="text-start mb-4">
                    <label for="mobile" class="block mb-2 text-black">Mobile no :</label>
                    <input
						type="tel"
						name='phone'
                        bind:value={phone}
						pattern="[0-9]*"
						inputmode="numeric"
						placeholder=""
						class=" w-[280px] px-4 py-2 border rounded-xl text-gray-700"
						required
					/>
				</div>
				<div class="flex justify-center">
					<button type="submit" class="mt-8 px-28 py-2 bg-[#7165e3] text-white rounded-md"
						>Login</button
					>
				</div>
			</div>
		</div>
	</form>
</div>

<div class=" fixed z-10 bottom-0 h-[400px] w-full bg-[#5832a1]"></div> -->
