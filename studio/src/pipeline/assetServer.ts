import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// raiz em lua-logica-brain/ (não só studio/) — assim também serve
// assets-pessoais/fotos-referencia/ quando uma peça usa foto pessoal.
const SERVE_ROOT = path.join(__dirname, '..', '..', '..');

const MIME: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
};

let baseUrlPromise: Promise<string> | null = null;

/**
 * Servidor HTTP local mínimo, raiz em `studio/`. Serve imagens geradas em
 * tempo de execução (Replicate, `producao/<data>/...`) para o Remotion.
 *
 * Necessário porque o servidor interno do Remotion (usado por
 * renderStill/renderMedia) só enxerga os arquivos que existiam em
 * `public/` no momento em que o bundle foi preparado — um arquivo salvo em
 * disco DEPOIS disso (como uma imagem recém-baixada do Replicate) dá 404
 * nele mesmo estando fisicamente lá. Um servidor HTTP genérico não tem
 * esse problema, então usamos o nosso para qualquer imagem dinâmica.
 */
export const ensureAssetServer = (): Promise<string> => {
	if (baseUrlPromise) return baseUrlPromise;

	baseUrlPromise = new Promise((resolve, reject) => {
		const server = http.createServer((req, res) => {
			void (async () => {
				try {
					const requestPath = decodeURIComponent((req.url ?? '').split('?')[0]);
					const filePath = path.join(SERVE_ROOT, requestPath);
					if (!filePath.startsWith(SERVE_ROOT)) {
						res.writeHead(403);
						res.end();
						return;
					}
					await stat(filePath);
					const ext = path.extname(filePath).toLowerCase();
					res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
					createReadStream(filePath).pipe(res);
				} catch {
					res.writeHead(404);
					res.end();
				}
			})();
		});

		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			const port = typeof address === 'object' && address ? address.port : 0;
			resolve(`http://127.0.0.1:${port}`);
		});
		server.on('error', reject);
	});

	return baseUrlPromise;
};

/** Converte um caminho absoluto dentro de `lua-logica-brain/` numa URL servível pelo asset server. */
export const toAssetUrl = async (absoluteFilePath: string): Promise<string> => {
	const baseUrl = await ensureAssetServer();
	const rel = path.relative(SERVE_ROOT, absoluteFilePath).split(path.sep).join('/');
	return `${baseUrl}/${rel}`;
};
