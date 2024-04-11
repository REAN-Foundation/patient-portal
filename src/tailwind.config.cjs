/** @type {import('tailwindcss').Config} */
const { skeleton } = require('@skeletonlabs/tw-plugin');
import { customTheme } from './src/theme';
import forms from '@tailwindcss/forms';
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
    ],
    theme: {
        extend: {
            backgroundImage: {
                'back-ground': 'linear-gradient(to bottom, white 0%, white 35%, #7165E3 35%, #7165E3 100%)'
            }
        }
    },
    plugins: [
        forms,
		skeleton({
			themes: {
				custom: [
					customTheme
				]
			}
		})
    ]
};
