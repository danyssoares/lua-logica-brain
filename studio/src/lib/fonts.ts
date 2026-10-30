import { loadFont } from '@remotion/fonts';
import { continueRender, delayRender, staticFile } from 'remotion';
import { useEffect, useState } from 'react';
import { fontFamilies } from './tokens';

let loaded: Promise<void> | null = null;

/**
 * Carrega as fontes reais da marca (brand/fonts, servidas via symlink em
 * studio/public/fonts) para dentro do Remotion. Chamar uma vez por
 * composição, antes de renderizar texto.
 */
export const ensureBrandFontsLoaded = (): Promise<void> => {
	if (loaded) return loaded;

	loaded = Promise.all([
		loadFont({
			family: fontFamilies.title,
			url: staticFile('fonts/Catchy Mager/catchy-mager.otf'),
			weight: '400',
		}),
		loadFont({
			family: fontFamilies.subtitle,
			url: staticFile('fonts/Alike/Alike-Regular.ttf'),
			weight: '400',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-ExtraLight.ttf'),
			weight: '200',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-Light.ttf'),
			weight: '300',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-Regular.ttf'),
			weight: '400',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-SemiBold.ttf'),
			weight: '600',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-Bold.ttf'),
			weight: '700',
		}),
		loadFont({
			family: fontFamilies.paragraph,
			url: staticFile('fonts/Muli/Muli-ExtraBold.ttf'),
			weight: '800',
		}),
	]).then(() => undefined);

	return loaded;
};

/**
 * Bloqueia a captura do frame (delayRender) até as fontes da marca
 * estarem carregadas — evita frames renderizados com fonte de fallback.
 */
export const useBrandFonts = (): void => {
	const [handle] = useState(() => delayRender('Carregando fontes da marca'));

	useEffect(() => {
		ensureBrandFontsLoaded()
			.then(() => continueRender(handle))
			.catch((err) => {
				console.error('Falha ao carregar fontes da marca', err);
				continueRender(handle);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
