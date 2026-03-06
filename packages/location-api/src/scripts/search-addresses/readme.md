# Address Search Script 📍🗺️

This script allows you to geocode a list of addresses using the HERE API service.
It's designed to be flexible, allowing you to test different addresses, countries, and languages.

## Configuration

Before running the script, you need to configure three main parameters in the `src/scripts/search-addresses.ts` file:

1. **Addresses**: Replace the `ADDRESSES_SEARCHED` array with your own list of addresses to test.

   ```typescript
   const ADDRESSES_SEARCHED = [
     "Your Address 1",
     "Your Address 2",
     // ...
   ];
   ```

2. **Country**: Update the `COUNTRY_SEARCHED` constant with the ISO country code of the country you're searching in.

   ```typescript
   const COUNTRY_SEARCHED = "US"; // Replace with your desired country code
   ```

3. **Language**: Modify the `LANG_SEARCHED` constant with the desired language code for the results.

   ```typescript
   const LANG_SEARCHED = "EN"; // Replace with your desired language code
   ```

## Running the Script

After configuring the script, you can run it using the following command:

```
yarn search:addresses
```

## Output

The script will output a table in the console with two columns:

- "Original address": The address you provided
- address, city and postalCode of the geocoded address, or "🔴 Not found" if the address couldn't be geocoded

## Troubleshooting

If you encounter any errors, check the following:

- Ensure your "HERE_API_KEY" credentials are correctly set up in your .env
- Verify that the addresses are correctly formatted
- Make sure the country (ISO 3166-1) and language (ISO 639-1) codes are valid
