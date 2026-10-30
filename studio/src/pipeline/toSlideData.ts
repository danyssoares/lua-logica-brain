import type { CarrosselSlideData, Proporcao, ReelSlide, StyledLine } from '../lib/types';
import type { ReelData } from '../lib/types';
import type { PautaItem } from './types';

/**
 * Divide um hook em linhas — use "\n" no texto pra controlar a quebra
 * manualmente (ex: "Isso não é solidão.\nÉ Aquário."). A última linha
 * sempre leva o tratamento de destaque (Alike/title + dourado), as
 * anteriores ficam no peso leve (Muli), igual ao padrão já validado.
 */
const hookLines = (hook: string): StyledLine[] => {
	const parts = hook.split('\n').filter(Boolean);
	return parts.map((text, index) => ({
		text,
		font: index === parts.length - 1 ? 'title' : 'paragraph',
		color: index === parts.length - 1 ? 'gold' : undefined,
		weight: index === parts.length - 1 ? undefined : 300,
	}));
};

/**
 * Pauta -> slides de carrossel (capa + insights + [arquétipo] + cta).
 *
 * `imagePaths` é indexado igual a `item.insights` — uma imagem gerada por
 * slide do meio, aplicada só na faixa superior (`topImage`). Capa e cta
 * ficam só tipografia + brilho dourado — é o formato que já validamos.
 *
 * Sem kicker/título por padrão em nenhum slide — só aparece se `item.pilar`
 * vier preenchido (ou seja, só quando a peça faz parte de uma série
 * nomeada de propósito, não como label decorativo inventado).
 */
export const pautaToCarrossel = (item: PautaItem, proporcao: Proporcao, imagePaths: string[]): CarrosselSlideData[] => {
	const slides: CarrosselSlideData[] = [
		{
			kind: 'capa',
			proporcao,
			goldGlow: true,
			text: {
				variant: 'frase-unica',
				kicker: item.pilar,
				lines: hookLines(item.hook ?? item.tema),
				theme: 'dark',
			},
		},
	];

	(item.insights ?? []).forEach((insight, index) => {
		slides.push({
			kind: index === 0 ? 'diagnostico' : 'resolucao',
			proporcao,
			topImage: imagePaths[index] ? { imageSrc: imagePaths[index] } : undefined,
			text: {
				variant: 'stagger',
				lines: [{ text: insight, font: 'paragraph', weight: 300 }],
				theme: 'dark',
			},
		});
	});

	if (item.arquetipo) {
		slides.push({
			kind: 'arquetipo',
			proporcao,
			archetype: {
				arquetipo: item.arquetipo,
				transito: item.transito ?? '',
				reflexao: item.reflexao ?? '',
				theme: 'dark',
			},
		});
	}

	if (item.cta) {
		slides.push({
			kind: 'cta',
			proporcao,
			text: {
				variant: 'frase-unica',
				// fecha com pergunta íntima ao leitor — sem CTA de marca por
				// padrão (ver conteudo/linguagem.md). `ctaButton` continua
				// existindo pra quando você quiser um botão de propósito.
				lines: [{ text: item.cta, font: 'paragraph', weight: 300 }],
				cta: item.ctaButton,
				theme: 'dark',
			},
		});
	}

	return slides;
};

/**
 * Pauta -> um único slide "frase única" (post estático ou capa de conteúdo
 * gravado) — ou o layout "manifesto" (kicker itálico + título grande +
 * divisória + parágrafo + rodapé + imagem na faixa superior, com degradê
 * pra cor sólida embaixo — igual ao carrossel) quando `item.manifesto`
 * estiver preenchido. `heroImageSrc` é a imagem já gerada (opcional — só
 * usada no layout manifesto).
 */
export const pautaToFraseUnica = (
	item: PautaItem,
	proporcao: Proporcao,
	heroImageSrc?: string,
): CarrosselSlideData => {
	if (item.manifesto) {
		return {
			kind: 'manifesto',
			proporcao,
			topImage: heroImageSrc ? { imageSrc: heroImageSrc } : undefined,
			manifesto: {
				kicker: item.manifesto.kicker,
				title: item.manifesto.title,
				body: item.manifesto.body,
				footer: item.manifesto.footer,
				theme: 'dark',
			},
		};
	}

	return {
		kind: 'frase-unica',
		proporcao,
		goldGlow: true,
		text: {
			variant: 'frase-unica',
			kicker: item.pilar,
			lines: hookLines(item.hook ?? item.tema),
			cta: item.ctaButton,
			theme: 'dark',
		},
	};
};

/** Pauta -> Reel (hook + insights + cta), cada slide com o Ken Burns sobre a imagem gerada. */
export const pautaToReel = (item: PautaItem, imagePaths: string[]): ReelData => {
	const HOOK_FRAMES = 90;
	const INSIGHT_FRAMES = 110;
	const CTA_FRAMES = 80;

	const imageFor = (index: number) => imagePaths[index] ?? imagePaths[0];

	const hookSlide: ReelSlide = {
		kind: 'hook',
		durationInFrames: HOOK_FRAMES,
		background: imageFor(0) ? { imageSrc: imageFor(0), overlay: 'gradient', direction: 'in' } : undefined,
		text: {
			variant: 'stagger',
			kicker: item.pilar,
			lines: hookLines(item.hook ?? item.tema),
			theme: 'dark',
		},
	};

	const insightSlides: ReelSlide[] = (item.insights ?? []).map((insight, index) => ({
		kind: 'insight',
		durationInFrames: INSIGHT_FRAMES,
		background: imageFor(index + 1)
			? { imageSrc: imageFor(index + 1), overlay: 'gradient', direction: index % 2 === 0 ? 'in' : 'out' }
			: undefined,
		text: {
			variant: 'stagger',
			lines: [{ text: insight, font: 'paragraph', weight: 300 }],
			theme: 'dark',
		},
	}));

	const ctaSlide: ReelSlide = {
		kind: 'cta',
		durationInFrames: CTA_FRAMES,
		background: imageFor(imagePaths.length - 1)
			? { imageSrc: imageFor(imagePaths.length - 1), overlay: 'gradient' }
			: undefined,
		text: {
			variant: 'frase-unica',
			lines: item.cta ? [{ text: item.cta, font: 'title', color: 'gold' }] : [],
			// fecha com pergunta íntima — sem CTA de marca por padrão (ver conteudo/linguagem.md)
			cta: item.ctaButton,
			theme: 'dark',
		},
	};

	return { slides: [hookSlide, ...insightSlides, ctaSlide] };
};
