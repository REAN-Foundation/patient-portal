<script lang="ts">
    import CountryCode from "$lib/components/country.code.svelte";
    import {
		getPublicLogoImageSource,
		getPublicFooterText,
		getPublicFooterLink,
		getSystemName,
	} from '$lib/themes/theme.selector';
    import { SYSTEM_ID } from '../lib/constants';
	import { SystemTypes } from "$lib/system.types";
    
    const systemType: SystemTypes = SYSTEM_ID as SystemTypes;
    const logoImageSource = getPublicLogoImageSource();
    const footerText = `© ${new Date().getFullYear()} ${getPublicFooterText()}`;
    const footerLink = getPublicFooterLink();
    let countryCode;
    $: if (systemType === SystemTypes.AHA) {
        countryCode = '+1'
    } else {
        countryCode = ''
    }
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
                        
                        {#if systemType === SystemTypes.AHA}
                        <select class = "w-[280px] px-4 py-2 border rounded-xl text-gray-700" required>
                            <option value="+1">United States (+1)</option>   
                        </select>
                        {:else}
                        <CountryCode bind:countryCode stypeString = " w-[280px] px-4 py-2 border rounded-xl text-gray-700"></CountryCode>
                        {/if} 
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
