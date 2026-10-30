import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackgroundEffect } from './BackgroundEffect';
import type { BackgroundEffectData } from '../lib/types';

/**
 * Brilho dourado suave no canto superior direito — mesmo efeito da
 * referência `referencias/canva-post.png`. Decorativo, usado em slides sem
 * imagem (capa/cta) pra não ficarem "vazios" demais.
 */
export const GoldGlow: React.FC = () => (
	<AbsoluteFill
		style={{
			background:
				'radial-gradient(circle at 88% 4%, rgba(198,161,86,0.65) 0%, rgba(198,161,86,0.25) 22%, rgba(198,161,86,0) 42%)',
		}}
	/>
);

const TOP_IMAGE_HEIGHT = 660; // de 1350 de altura total do carrossel

/**
 * Imagem só na faixa superior do slide (ao invés de full-bleed), com fade
 * suave pra cor sólida do slide embaixo — pro texto (variant "stagger")
 * continuar ancorado na base, legível, sem overlay pesado sobre a imagem.
 */
export const TopImageBand: React.FC<{ data: BackgroundEffectData; bgColorBelow: string }> = ({
	data,
	bgColorBelow,
}) => (
	<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: TOP_IMAGE_HEIGHT, overflow: 'hidden' }}>
		<BackgroundEffect {...data} overlay="none" />
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, transparent 55%, ${bgColorBelow} 96%)`,
			}}
		/>
	</div>
);
