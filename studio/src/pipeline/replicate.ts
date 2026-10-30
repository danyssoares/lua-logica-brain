import { writeFile } from 'node:fs/promises';
import Replicate from 'replicate';
import { config } from './config';
import type { Proporcao } from '../lib/types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Contas com pouco crédito no Replicate (< $5) caem num rate limit agressivo
 * (6 predictions/min, burst de 1) — geração sequencial de várias imagens
 * esbarra nisso fácil. Tenta de novo respeitando o `retry-after` da resposta.
 */
const runWithRetry = async (
	replicate: Replicate,
	model: `${string}/${string}`,
	input: Record<string, unknown>,
	attempt = 1,
): Promise<unknown> => {
	try {
		return await replicate.run(model, { input });
	} catch (err) {
		const status = (err as { response?: Response })?.response?.status;
		if (status === 429 && attempt <= 4) {
			const retryAfterHeader = (err as { response?: Response })?.response?.headers?.get('retry-after');
			const waitSeconds = Number(retryAfterHeader) || 8;
			console.log(`  Replicate 429 (rate limit) — aguardando ${waitSeconds}s e tentando de novo...`);
			await sleep(waitSeconds * 1000);
			return runWithRetry(replicate, model, input, attempt + 1);
		}
		throw err;
	}
};

/**
 * Gera uma imagem via Replicate e salva em outPath. Retorna outPath.
 *
 * Schema confirmado pra black-forest-labs/flux-1.1-pro (o padrão, ver
 * brand/image-prompt-guide.md): só `prompt` + `aspect_ratio` +
 * `output_format` — esse modelo não tem campo de negative_prompt (as
 * exclusões já vêm embutidas no bloco de estilo do prompt). Se trocar de
 * modelo, confira o schema real antes (`replicate.models.get(...)`).
 */
export const generateImage = async (
	prompt: string,
	outPath: string,
	aspectRatio: Proporcao = '4:5',
): Promise<string> => {
	const replicate = new Replicate({ auth: config.replicate.token });

	const output = await runWithRetry(replicate, config.replicate.model as `${string}/${string}`, {
		prompt,
		aspect_ratio: aspectRatio,
		output_format: 'png',
	});

	// A SDK do Replicate retorna formatos diferentes por modelo (array de
	// URLs, array de streams, um único objeto). Normaliza para pegar o
	// primeiro resultado.
	const first = Array.isArray(output) ? output[0] : output;
	const arrayBuffer =
		typeof (first as { blob?: () => Promise<Blob> })?.blob === 'function'
			? await (first as { blob: () => Promise<Blob> }).blob().then((b) => b.arrayBuffer())
			: await (await fetch(String(first))).arrayBuffer();
	const buffer = Buffer.from(new Uint8Array(arrayBuffer));

	await writeFile(outPath, buffer);
	return outPath;
};
