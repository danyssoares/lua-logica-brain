import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import type { CarrosselSlideData, ReelData } from '../lib/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY_POINT = path.join(__dirname, '..', 'index.ts');

let bundleLocationPromise: Promise<string> | null = null;

/** Empacota a composição Remotion uma única vez por processo (é lento; reaproveita entre renders). */
const getBundleLocation = (): Promise<string> => {
	if (!bundleLocationPromise) {
		bundleLocationPromise = bundle({ entryPoint: ENTRY_POINT });
	}
	return bundleLocationPromise;
};

/**
 * Still (PNG) — usado por post-estatico/carrossel-estatico/gravado.
 * Captura sempre o ÚLTIMO frame do clipe (não um número fixo no meio):
 * o clipe é desenhado como "entrada escalonada + hold pra leitura", e
 * quantos elementos entram escalonados varia por layout (TextSlide,
 * ArchetypeCard, ManifestoSlide...) — só o último frame garante que TODOS
 * já assentaram, sem precisar recalcular um frame "seguro" a cada layout
 * novo. Capturar cedo demais pega elementos com o delay mais alto (ex: o
 * rodapé do ManifestoSlide) ainda com opacity parcial — foi exatamente o
 * bug do rodapé "apagado" no post do eclipse.
 */
export const renderCarrosselSlide = async (data: CarrosselSlideData, outPath: string): Promise<void> => {
	const serveUrl = await getBundleLocation();
	const composition = await selectComposition({
		serveUrl,
		id: 'CarrosselSlide',
		inputProps: { data },
	});

	await renderStill({
		composition,
		serveUrl,
		output: outPath,
		inputProps: { data },
		frame: composition.durationInFrames - 1,
	});
};

/**
 * Um slide de carrossel como clipe curto animado (mp4) — o formato padrão
 * de entrega agora (ver studio/README.md, "sempre animado"). `renderCarrosselSlide`
 * (still/PNG) continua existindo só pra capa de conteúdo "gravado" (referência
 * pra você gravar em cima, não é a peça publicada em si).
 */
export const renderCarrosselSlideVideo = async (data: CarrosselSlideData, outPath: string): Promise<void> => {
	const serveUrl = await getBundleLocation();
	const composition = await selectComposition({
		serveUrl,
		id: 'CarrosselSlide',
		inputProps: { data },
	});

	await renderMedia({
		composition,
		serveUrl,
		codec: 'h264',
		outputLocation: outPath,
		inputProps: { data },
	});
};

export const renderReelVideo = async (data: ReelData, outPath: string): Promise<void> => {
	const serveUrl = await getBundleLocation();
	const totalFrames = data.slides.reduce((acc, s) => acc + s.durationInFrames, 0);
	const composition = await selectComposition({
		serveUrl,
		id: 'Reel',
		inputProps: { data },
	});

	await renderMedia({
		composition: { ...composition, durationInFrames: totalFrames },
		serveUrl,
		codec: 'h264',
		outputLocation: outPath,
		inputProps: { data },
	});
};
