import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../lib/tokens';
import type { BackgroundEffectData } from '../lib/types';

/**
 * Ken Burns lento sobre uma imagem estática (Replicate), com overlay
 * opcional para garantir contraste do texto por cima.
 */
export const BackgroundEffect: React.FC<BackgroundEffectData> = ({
	imageSrc,
	direction = 'in',
	overlay = 'gradient',
	overlayColor = colors.purpleDeep,
}) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const [fromScale, toScale] = direction === 'in' ? [1, 1.12] : [1.12, 1];
	const scale = interpolate(frame, [0, durationInFrames], [fromScale, toScale], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateX = interpolate(frame, [0, durationInFrames], [0, direction === 'in' ? -18 : 18], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{ overflow: 'hidden' }}>
				<Img
					src={imageSrc}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${scale}) translateX(${translateX}px)`,
					}}
				/>
			</AbsoluteFill>
			{overlay !== 'none' ? (
				<AbsoluteFill
					style={{
						background:
							overlay === 'noise'
								? overlayColor
								: `linear-gradient(180deg, ${overlayColor}00 0%, ${overlayColor}CC 68%, ${overlayColor}F2 100%)`,
						opacity: overlay === 'noise' ? 0.18 : 1,
						mixBlendMode: overlay === 'noise' ? 'overlay' : 'normal',
					}}
				/>
			) : null}
			{overlay === 'gradient-noise' ? (
				<AbsoluteFill
					style={{
						backgroundImage:
							'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.35%27/></svg>")',
						opacity: 0.12,
						mixBlendMode: 'overlay',
					}}
				/>
			) : null}
		</AbsoluteFill>
	);
};
