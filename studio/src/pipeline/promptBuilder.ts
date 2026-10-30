import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { PautaItem } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '..', '..', 'prompts', 'master-image-prompt.md');

const extractStyleBlock = (markdown: string): string => {
	const match = markdown.match(/## Bloco de estilo base[^`]*```\n([\s\S]*?)\n```/);
	return match ? match[1].trim() : '';
};

/**
 * Descrição da cena específica do dia — segue o "Template para nova cena"
 * do guia (bloco de estilo + cena), sempre pedindo espaço negativo pro
 * texto entrar por cima depois (ver `brand/image-prompt-guide.md`).
 *
 * Cena genérica, derivada só de tema/arquétipo — usada quando o item ainda
 * não tem sugestão de imagem própria por slide (etapa de rascunho).
 */
const defaultSceneFor = (item: PautaItem): string => {
	const subject = item.arquetipo ? `${item.tema} — ${item.arquetipo}` : item.tema;
	return `Scene: abstract, symbolic visual representing "${subject}". Minimal composition with generous negative space at the top third of the frame, reserved for text overlay.`;
};

export const styleBlockOf = (): string => {
	const template = readFileSync(TEMPLATE_PATH, 'utf-8');
	const styleBlock = extractStyleBlock(template);
	if (!styleBlock) {
		throw new Error(
			'studio/prompts/master-image-prompt.md não tem um "Bloco de estilo base" preenchido — confira o arquivo.',
		);
	}
	return styleBlock;
};

/**
 * Monta o prompt final pro Replicate: bloco de estilo (fixo) + cena.
 *
 * `sceneOverride` é a direção de imagem específica desse slide (campo
 * `imagens[i]` da pauta) — quando presente, substitui a cena genérica
 * derivada automaticamente do tema. É o que a etapa "mandei tudo" usa.
 */
export const buildImagePrompt = (item: PautaItem, sceneOverride?: string): { prompt: string } => {
	const scene = sceneOverride ?? defaultSceneFor(item);
	return { prompt: `${styleBlockOf()}\n${scene}` };
};

/** Bloco de estilo + uma cena livre — pra pedidos avulsos (fora do shape de PautaItem, ex: layout "manifesto"). */
export const buildCustomImagePrompt = (scene: string): string => `${styleBlockOf()}\n${scene}`;
