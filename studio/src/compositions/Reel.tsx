import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { TextSlide } from '../components/TextSlide';
import { BrandWatermark } from '../components/BrandMark';
import { colors } from '../lib/tokens';
import { useBrandFonts } from '../lib/fonts';
import type { ReelData } from '../lib/types';

const TRANSITION_FRAMES = 20;

export const reelSchemaDefault: ReelData = {
	slides: [
		{
			kind: 'hook',
			durationInFrames: 90,
			background: { imageSrc: '', overlay: 'gradient' },
			text: {
				variant: 'stagger',
				kicker: 'O céu de hoje',
				lines: [{ text: 'Você não apagou —', font: 'paragraph', weight: 300 }, { text: 'só perdeu as coordenadas.', font: 'title', color: 'gold' }],
			},
		},
	],
};

/**
 * Reel 1080x1920: imagem de fundo com Ken Burns lento por slide, texto
 * animado por cima (hook + insights + CTA), com crossfade suave entre slides.
 */
export const Reel: React.FC<{ data: ReelData }> = ({ data }) => {
	useBrandFonts();

	return (
		<AbsoluteFill style={{ backgroundColor: colors.purpleDeep }}>
			<TransitionSeries>
				{data.slides.map((slide, index) => (
					<React.Fragment key={index}>
						<TransitionSeries.Sequence durationInFrames={slide.durationInFrames}>
							<AbsoluteFill>
								{slide.background?.imageSrc ? <BackgroundEffect {...slide.background} /> : null}
								<Sequence from={8}>
									<TextSlide data={slide.text} />
								</Sequence>
								<BrandWatermark
									theme={slide.text.theme ?? 'dark'}
									placement={slide.text.variant === 'frase-unica' ? 'centered' : 'corner'}
								/>
							</AbsoluteFill>
						</TransitionSeries.Sequence>
						{index < data.slides.length - 1 ? (
							<TransitionSeries.Transition
								presentation={fade()}
								timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
							/>
						) : null}
					</React.Fragment>
				))}
			</TransitionSeries>
		</AbsoluteFill>
	);
};
