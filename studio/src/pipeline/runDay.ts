import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fetchPautaDoDia } from './supabase';
import { buildCustomImagePrompt, buildImagePrompt } from './promptBuilder';
import { generateImage } from './replicate';
import { pautaToCarrossel, pautaToFraseUnica, pautaToReel } from './toSlideData';
import { renderCarrosselSlide, renderCarrosselSlideVideo, renderReelVideo } from './render';
import { toAssetUrl } from './assetServer';
import type { PautaItem } from './types';
import type { Proporcao } from '../lib/types';

const args = new Map(
	process.argv.slice(2).map((arg) => {
		const [key, value] = arg.replace(/^--/, '').split('=');
		return [key, value ?? 'true'];
	}),
);

const tomorrow = () => {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return d.toISOString().slice(0, 10);
};

const date = args.get('date') ?? tomorrow();
const isFixture = args.has('fixture');
const manualFile = args.get('file');
const skipImages = isFixture || args.has('sem-imagem');
const reuseImagens = args.has('reuse-imagens');

const fileExists = async (p: string): Promise<boolean> => {
	try {
		await access(p);
		return true;
	} catch {
		return false;
	}
};

const FIXTURE_PAUTA: PautaItem[] = [
	{
		id: 'fixture-1',
		data: date,
		formato: 'carrossel-animado',
		proporcao: '4:5',
		pilar: 'Seu mapa explica',
		tema: 'Mercúrio retrógrado e comunicação',
		hook: 'Você não apagou — só perdeu as coordenadas.',
		insights: [
			'Mercúrio retrógrado não trava sua vida: ele pede revisão antes de avançar.',
			'Releia o que já foi dito antes de mandar aquela mensagem importante.',
		],
		cta: 'Quer entender como isso cai no SEU mapa?',
	},
	{
		id: 'fixture-2',
		data: date,
		formato: 'gravado',
		proporcao: '9:16',
		pilar: 'Diálogos',
		tema: 'Autoconhecimento na prática',
		hook: 'O que seu Ascendente diz sobre a primeira impressão que você causa',
	},
];

const slugify = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

/** Carrega a pauta de um JSON local (mesmo shape de PautaItem[]) — para você
 * mesma dar o conteúdo/formato direto, sem depender da tabela do Supabase.
 * Útil enquanto ainda estamos fechando o design. */
const loadPautaFromFile = async (filePath: string): Promise<PautaItem[]> => {
	const raw = await readFile(filePath, 'utf-8');
	const parsed = JSON.parse(raw) as PautaItem[] | PautaItem;
	const items = Array.isArray(parsed) ? parsed : [parsed];
	return items.map((item, index) => ({
		...item,
		id: item.id ?? `manual-${index}`,
		data: item.data ?? date,
	}));
};

/**
 * formato e proporção nunca têm default — se um item não trouxer os dois
 * (nem na pauta, nem no JSON manual), ele é pulado, nada é gerado pra ele.
 * Retorna a mensagem de erro, ou null se o item está ok.
 */
const missingRequiredFields = (item: PautaItem): string | null => {
	const missing: string[] = [];
	if (!item.formato) missing.push('formato');
	if (!item.proporcao) missing.push('proporcao');
	if (missing.length === 0) return null;
	return `faltando ${missing.join(' e ')} — não veio na pauta nem foi passado manualmente.`;
};

const generateImagesFor = async (
	item: PautaItem,
	outDir: string,
	count: number,
	sceneOverrides?: string[],
): Promise<string[]> => {
	if (skipImages) return [];

	const urls: string[] = [];
	for (let i = 0; i < count; i++) {
		const outPath = path.resolve(outDir, `imagem-${i + 1}.png`);

		if (reuseImagens && (await fileExists(outPath))) {
			console.log(`  reaproveitando imagem-${i + 1}.png já gerada (--reuse-imagens)`);
			urls.push(await toAssetUrl(outPath));
			continue;
		}

		const { prompt } = buildImagePrompt(item, sceneOverrides?.[i]);
		await generateImage(prompt, outPath);
		urls.push(await toAssetUrl(outPath));
	}
	return urls;
};

const generateManifestoHero = async (
	item: PautaItem,
	outDir: string,
	proporcao: Proporcao,
): Promise<string | undefined> => {
	if (skipImages || !item.manifesto?.heroScene) return undefined;
	const outPath = path.resolve(outDir, 'hero.png');

	if (reuseImagens && (await fileExists(outPath))) {
		console.log('  reaproveitando hero.png já gerado (--reuse-imagens)');
		return toAssetUrl(outPath);
	}

	const prompt = buildCustomImagePrompt(item.manifesto.heroScene);
	await generateImage(prompt, outPath, proporcao);
	return toAssetUrl(outPath);
};

const processItem = async (item: PautaItem): Promise<string | null> => {
	const problem = missingRequiredFields(item);
	if (problem) {
		console.log(`\n→ [pulado] ${item.tema}: ${problem}`);
		return null;
	}

	const formato = item.formato as NonNullable<PautaItem['formato']>;
	const proporcao = item.proporcao as Proporcao;
	const outDir = path.join('producao', item.data, `${slugify(item.tema)}`);
	await mkdir(outDir, { recursive: true });

	console.log(`\n→ [${formato}/${proporcao}] ${item.tema}`);

	if (formato === 'gravado') {
		// só texto (+ imagem no topo, se o layout manifesto pedir) — é referência pra você gravar em cima
		const heroImageSrc = await generateManifestoHero(item, outDir, proporcao);
		const slideData = pautaToFraseUnica(item, proporcao, heroImageSrc);
		await renderCarrosselSlide(slideData, path.join(outDir, 'capa.png'));
		console.log(`  capa gerada em ${outDir}/capa.png (vídeo é gravado por você)`);
	} else if (formato === 'post-estatico') {
		const heroImageSrc = await generateManifestoHero(item, outDir, proporcao);
		const slideData = pautaToFraseUnica(item, proporcao, heroImageSrc);
		const imgPath = path.join(outDir, 'post.png');
		await renderCarrosselSlide(slideData, imgPath);
		console.log(`  post estático gerado em ${imgPath}`);
	} else if (formato === 'carrossel-estatico' || formato === 'carrossel-animado') {
		// uma imagem por slide do meio (diagnóstico/resolução) — capa e cta ficam só tipografia
		const imagens = await generateImagesFor(item, outDir, (item.insights ?? []).length, item.imagens);
		const slides = pautaToCarrossel(item, proporcao, imagens);
		const ext = formato === 'carrossel-animado' ? 'mp4' : 'png';
		const render = formato === 'carrossel-animado' ? renderCarrosselSlideVideo : renderCarrosselSlide;
		const slidePaths: string[] = [];
		for (let i = 0; i < slides.length; i++) {
			const slidePath = path.join(outDir, `slide-${i + 1}-${slides[i].kind}.${ext}`);
			await render(slides[i], slidePath);
			slidePaths.push(slidePath);
		}
		console.log(`  ${slidePaths.length} slides (${formato}) gerados em ${outDir}/`);
	} else if (formato === 'reel') {
		const imagens = await generateImagesFor(item, outDir, 1, item.imagens); // 1 imagem reaproveitada com Ken Burns alternado
		const reelData = pautaToReel(item, imagens);
		const videoPath = path.join(outDir, 'reel.mp4');
		await renderReelVideo(reelData, videoPath);
		console.log(`  reel gerado em ${videoPath}`);
	}

	await writeFile(
		path.join(outDir, 'status.json'),
		JSON.stringify(
			{
				id: item.id,
				tema: item.tema,
				formato,
				proporcao,
				geradoEm: new Date().toISOString(),
				status: 'pendente_aprovacao',
			},
			null,
			2,
		),
	);

	return outDir;
};

const main = async () => {
	const modo = isFixture ? ' (modo --fixture, sem Supabase/Replicate)' : manualFile ? ` (modo manual: ${manualFile})` : '';
	console.log(`Gerando conteúdo para ${date}${modo}...`);

	const pauta = isFixture ? FIXTURE_PAUTA : manualFile ? await loadPautaFromFile(manualFile) : await fetchPautaDoDia(date);

	if (pauta.length === 0) {
		console.log('Nenhum item de pauta encontrado para essa data.');
		return;
	}

	const outDirs: string[] = [];
	for (const item of pauta) {
		const outDir = await processItem(item);
		if (outDir) outDirs.push(outDir);
	}

	if (outDirs.length === 0) {
		console.log('\nNada foi gerado — confira as mensagens de "pulado" acima.');
		return;
	}

	console.log('\nPronto. Revise em:');
	for (const dir of outDirs) console.log(`  ${dir}/`);
};

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
