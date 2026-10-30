import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { TextSlide } from '../components/TextSlide';
import { ArchetypeCard } from '../components/ArchetypeCard';
import { ManifestoSlide } from '../components/ManifestoSlide';
import { CircularHeroImage } from '../components/CircularHeroImage';
import { ZodiacShadow } from '../components/ZodiacShadow';
import { BrandWatermark } from '../components/BrandMark';
import { GoldGlow, TopImageBand } from '../components/Decor';
import { colors } from '../lib/tokens';
import { useBrandFonts } from '../lib/fonts';
import type { CarrosselSlideData, Proporcao } from '../lib/types';

export const carrosselSlideDefault: CarrosselSlideData = {
	kind: 'capa',
	proporcao: '4:5',
	goldGlow: true,
	text: {
		variant: 'frase-unica',
		kicker: 'O céu de hoje',
		lines: [
			{ text: 'Reconhecer', font: 'paragraph', weight: 300 },
			{ text: 'é o primeiro', font: 'paragraph', weight: 300 },
			{ text: 'passo de volta', font: 'title', color: 'gold' },
		],
		cta: 'Vem ver seu mapa',
		theme: 'dark',
	},
};

const DIMENSIONS: Record<Proporcao, { width: number; height: number }> = {
	'4:5': { width: 1080, height: 1350 },
	'1:1': { width: 1080, height: 1080 },
	'9:16': { width: 1080, height: 1920 },
};

/** Duração fixa do clipe quando renderizado como vídeo (carrossel-animado/reel-adjacent): entrada escalonada (~1.3s) + hold pra leitura (~1.4s). */
export const CARROSSEL_SLIDE_VIDEO_FRAMES = 80;

export const calculateCarrosselSlideMetadata: CalculateMetadataFunction<{ data: CarrosselSlideData }> = ({
	props,
}) => {
	const dim = DIMENSIONS[props.data.proporcao];
	return { width: dim.width, height: dim.height, durationInFrames: CARROSSEL_SLIDE_VIDEO_FRAMES, fps: 30 };
};

/**
 * Um slide de carrossel/post estático. Pode ser renderizado como still
 * (`renderCarrosselSlide`, formatos "*-estatico"/"gravado") ou como clipe
 * curto animado (`renderCarrosselSlideVideo`, formato "carrossel-animado")
 * — a própria composição não decide isso, quem chama escolhe a função de
 * render certa (ver `pipeline/render.ts` e `pipeline/runDay.ts`).
 */
export const CarrosselSlide: React.FC<{ data: CarrosselSlideData }> = ({ data }) => {
	useBrandFonts();

	const backgroundTheme =
		data.background ? 'dark' : data.text?.theme ?? data.archetype?.theme ?? data.manifesto?.theme ?? 'dark';
	const watermarkPlacement = data.text?.variant === 'frase-unica' ? 'centered' : 'corner';
	const solidBg = backgroundTheme === 'dark' ? colors.purpleDeep : colors.cosmicCream;

	return (
		<AbsoluteFill style={{ backgroundColor: solidBg }}>
			{data.background ? <BackgroundEffect {...data.background} /> : null}
			{data.topImage ? <TopImageBand data={data.topImage} bgColorBelow={solidBg} /> : null}
			{data.goldGlow ? <GoldGlow /> : null}
			{data.heroImage ? <CircularHeroImage data={data.heroImage} /> : null}
			{data.zodiacGlyph ? <ZodiacShadow {...data.zodiacGlyph} /> : null}
			{data.archetype ? <ArchetypeCard data={data.archetype} /> : null}
			{data.text ? <TextSlide data={data.text} /> : null}
			{data.manifesto ? <ManifestoSlide data={data.manifesto} /> : null}
			<BrandWatermark theme={backgroundTheme} placement={watermarkPlacement} />
		</AbsoluteFill>
	);
};
