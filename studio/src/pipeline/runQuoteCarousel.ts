import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildCustomImagePrompt } from './promptBuilder';
import { generateImage } from './replicate';
import { renderCarrosselSlide } from './render';
import { toAssetUrl } from './assetServer';
import type { CarrosselSlideData, Proporcao, StyledLine } from '../lib/types';

/**
 * Carrossel de "frases" (citações curadas, ex: Carl Jung) — um fundo único
 * gerado e reaproveitado em todos os slides (não um por slide, o formato é
 * intencionalmente "simplório" — ver conversa 2026-09-15). Cada slide é só
 * tipografia + divisória opcional por cima do mesmo fundo.
 *
 *   npx tsx src/pipeline/runQuoteCarousel.ts --file=manual/frases-jung.json
 */
const args = new Map(
	process.argv.slice(2).map((arg) => {
		const [key, value] = arg.replace(/^--/, '').split('=');
		return [key, value ?? 'true'];
	}),
);

type QuoteCarouselInput = {
	outSlug: string;
	proporcao: Proporcao;
	backgroundScene: string;
	slides: { kind: string; lines: StyledLine[]; dividerAfterLine?: number }[];
	legenda?: string;
};

const main = async () => {
	const filePath = args.get('file');
	if (!filePath) throw new Error('Passe --file=caminho/para/arquivo.json');
	const reuse = args.has('reuse-imagens');

	const input = JSON.parse(await readFile(filePath, 'utf-8')) as QuoteCarouselInput;
	const outDir = path.join('producao', 'quote-carousel', input.outSlug);
	await mkdir(outDir, { recursive: true });

	console.log(`→ [quote-carousel/${input.proporcao}] ${input.outSlug}`);

	const bgPath = path.resolve(outDir, 'fundo.png');
	if (!(reuse && (await readFile(bgPath).catch(() => null)))) {
		const prompt = buildCustomImagePrompt(input.backgroundScene);
		await generateImage(prompt, bgPath, input.proporcao);
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
			text: {
				variant: 'frase-unica',
				lines: s.lines,
				dividerAfterLine: s.dividerAfterLine,
				theme: 'dark',
			},
		};
		const slidePath = path.join(outDir, `slide-${i + 1}-${s.kind}.png`);
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
