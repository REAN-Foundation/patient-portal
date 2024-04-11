import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';
import { getThemeColors } from './lib/themes/theme.selector';

export const customTheme: CustomThemeConfig = {
	name: 'customTheme',
    properties: getThemeColors(),
}








