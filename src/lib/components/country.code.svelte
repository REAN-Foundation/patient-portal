<script lang="ts">
    export let stypeString = '';
    export let countryCode;
    function handleCountryCodeChange(event) {
        countryCode = event.target.value;
  }

</script>

<select class = "${stypeString}" on:change={handleCountryCodeChange} value ='' required>
    <option value="+1">United States (+1)</option>
    <option value="+44">United Kingdom (+44)</option>
    <option value="+91">India (+91)</option>
    <!-- Add more options as needed -->
  </select>
