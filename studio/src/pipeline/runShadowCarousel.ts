import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateImage } from './replicate';
import { renderCarrosselSlide } from './render';
import { toAssetUrl } from './assetServer';
import type { CarrosselSlideData, Proporcao, StyledLine, ZodiacGlyphData } from '../lib/types';

/**
 * Carrossel "sombra do signo" (e qualquer outro nesse molde: fundo único +
 * glifo/sombra em código por slide). Um fundo gerado (Replicate) reaproveitado
 * em todos os slides; o glifo+sombra por signo é renderizado por código —
 * nunca via IA de imagem (ver ZodiacShadow.tsx).
 *
 *   npx tsx src/pipeline/runShadowCarousel.ts --file=manual/sombra-signos.json
 */
const args = new Map(
	process.argv.slice(2).map((arg) => {
		const [key, value] = arg.replace(/^--/, '').split('=');
		return [key, value ?? 'true'];
	}),
);

type ShadowCarouselInput = {
	outSlug: string;
	proporcao: Proporcao;
	backgroundScene: string;
	slides: {
		kind: string;
		variant: 'stagger' | 'frase-unica';
		kicker?: string;
		kickerSize?: 'small' | 'large';
		lines: StyledLine[];
		dividerAfterLine?: number;
		zodiacGlyph?: ZodiacGlyphData;
	}[];
	legenda?: string;
};

const main = async () => {
	const filePath = args.get('file');
	if (!filePath) throw new Error('Passe --file=caminho/para/arquivo.json');
	const reuse = args.has('reuse-imagens');

	const input = JSON.parse(await readFile(filePath, 'utf-8')) as ShadowCarouselInput;
	const outDir = path.join('producao', 'shadow-carousel', input.outSlug);
	await mkdir(outDir, { recursive: true });

	console.log(`→ [shadow-carousel/${input.proporcao}] ${input.outSlug}`);

	const bgPath = path.resolve(outDir, 'fundo.png');
	if (!(reuse && (await readFile(bgPath).catch(() => null)))) {
		await generateImage(input.backgroundScene, bgPath, input.proporcao);
	} else {
		console.log('  reaproveitando fundo.png já gerado (--reuse-imagens)');
	}
	const bgSrc = await toAssetUrl(bgPath);

	const slidePaths: string[] = [];
	for (let i = 0; i < input.slides.length; i++) {
		const s = input.slides[i];
		const slideData: CarrosselSlideData = {
			kind: s.kind as CarrosselSlideData['kind'],
			proporcao: input.proporcao,
			background: { imageSrc: bgSrc, overlay: 'gradient' },
			zodiacGlyph: s.zodiacGlyph,
			text: {
				variant: s.variant,
				kicker: s.kicker,
				kickerSize: s.kickerSize,
				lines: s.lines,
				dividerAfterLine: s.dividerAfterLine,
				theme: 'dark',
			},
		};
		const slidePath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}-${s.kind}.png`);
		await renderCarrosselSlide(slideData, slidePath);
		slidePaths.push(slidePath);
	}

	if (input.legenda) {
		await writeFile(path.join(outDir, 'legenda.txt'), input.legenda);
	}

	console.log(`  ${slidePaths.length} slides gerados em ${outDir}/`);
};

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
