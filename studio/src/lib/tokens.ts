import rawTokens from '../../../brand/tokens.json';

export type BrandTokens = {
	colors: {
		cosmicCream: string;
		purpleDarkest: string;
		purpleDeep: string;
		gold: string;
		purpleMedium: string;
		goldLight: string;
		lilac: string;
		whiteSoft: string;
	};
	fonts: {
		title: string;
		subtitle: string;
		paragraph: string;
	};
};

export const tokens = rawTokens as BrandTokens;

export const colors = tokens.colors;
export const fontFamilies = tokens.fonts;
