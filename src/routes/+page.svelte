<script lang="ts">

    import CountryCode from "$lib/components/country.code.svelte";

    let countryCode = '';
    let phone;

</script>

<div class="fixed top-0 h-20 w-full bg-[#7165e3]"></div>

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

<div class=" fixed z-10 bottom-0 h-[400px] w-full bg-[#5832a1]"></div>
