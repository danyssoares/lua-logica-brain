import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { colors } from '../lib/tokens';
import type { BackgroundEffectData } from '../lib/types';

/**
 * Imagem circular pequena com halo de brilho atrás — o "lua eclipsada"
 * no canto superior direito do layout "manifesto". Reaproveitável pra
 * qualquer imagem-destaque circular (não é a imagem de fundo full-bleed).
 */
export const CircularHeroImage: React.FC<{
	data: BackgroundEffectData;
	size?: number;
	top?: number;
	right?: number;
}> = ({ data, size = 420, top = 64, right = 60 }) => (
	<AbsoluteFill style={{ pointerEvents: 'none' }}>
		<div
			style={{
				position: 'absolute',
				top,
				right,
				width: size,
				height: size,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: -size * 0.35,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${colors.gold}55 0%, ${colors.purpleMedium}33 45%, transparent 72%)`,
					filter: 'blur(2px)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					overflow: 'hidden',
					boxShadow: `0 0 0 1px ${colors.gold}66`,
				}}
			>
				<Img
					src={data.imageSrc}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</div>
		</div>
	</AbsoluteFill>
);
