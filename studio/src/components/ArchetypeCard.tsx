import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../lib/tokens';
import type { ArchetypeCardData } from '../lib/types';

/**
 * Layout para "arquétipo/trânsito + reflexão prática" — usado no slide de
 * diagnóstico do carrossel e em insights de reel que citam um trânsito.
 */
export const ArchetypeCard: React.FC<{ data: ArchetypeCardData; delayFrames?: number; animated?: boolean }> = ({
	data,
	delayFrames = 6,
	animated = true,
}) => {
	const theme = data.theme ?? 'dark';
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const enter = (index: number) => {
		if (!animated) return { opacity: 1, transform: 'translateY(0px)' };

		const progress = spring({
			frame: frame - delayFrames * index,
			fps,
			config: { damping: 200, mass: 0.6, stiffness: 120 },
		});
		return {
			opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(progress, [0, 1], [24, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})}px)`,
		};
	};

	const ink = theme === 'dark' ? colors.whiteSoft : colors.purpleDeep;
	const muted = theme === 'dark' ? colors.lilac : colors.purpleMedium;

	return (
		<AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 90px 150px' }}>
			{data.kicker ? (
				<div
					style={{
						...enter(0),
						fontFamily: fontFamilies.paragraph,
						fontWeight: 700,
						fontSize: 28,
						letterSpacing: 6,
						textTransform: 'uppercase',
						color: colors.gold,
						marginBottom: 28,
					}}
				>
					{data.kicker}
				</div>
			) : null}

			<div
				style={{
					...enter(1),
					fontFamily: fontFamilies.title,
					fontSize: 60,
					lineHeight: 1.2,
					color: ink,
					marginBottom: 18,
				}}
			>
				{data.arquetipo}
			</div>

			<div
				style={{
					...enter(2),
					fontFamily: fontFamilies.paragraph,
					fontWeight: 300,
					fontSize: 32,
					lineHeight: 1.3,
					color: muted,
					marginBottom: 40,
				}}
			>
				{data.transito}
			</div>

			<div
				style={{
					...enter(3),
					borderTop: `1px solid ${muted}55`,
					paddingTop: 32,
					fontFamily: fontFamilies.paragraph,
					fontWeight: 400,
					fontSize: 34,
					lineHeight: 1.35,
					color: ink,
				}}
			>
				{data.reflexao}
			</div>
		</AbsoluteFill>
	);
};
