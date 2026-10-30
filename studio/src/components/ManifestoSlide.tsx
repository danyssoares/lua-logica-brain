import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../lib/tokens';
import type { ManifestoData } from '../lib/types';

/**
 * Layout "manifesto/editorial": kicker itálico + título grande em caps +
 * linha divisória + parágrafo curto + rótulo no rodapé. Reproduz a
 * estrutura de uma referência visual específica (ver conversa) — layout
 * distinto do "frase-unica" padrão.
 */
export const ManifestoSlide: React.FC<{ data: ManifestoData; animated?: boolean }> = ({
	data,
	animated = true,
}) => {
	const theme = data.theme ?? 'dark';
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const ink = theme === 'dark' ? colors.whiteSoft : colors.purpleDeep;
	const muted = theme === 'dark' ? colors.lilac : colors.purpleMedium;

	const enter = (index: number) => {
		if (!animated) return { opacity: 1, transform: 'translateY(0px)' };
		const progress = spring({
			frame: frame - 8 * index,
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

	// índices de entrada pré-calculados (evita efeito colateral dentro do JSX)
	const kickerIndex = 0;
	const titleStart = data.kicker ? 1 : 0;
	const dividerIndex = titleStart + data.title.length;
	const bodyStart = dividerIndex + 1;
	const footerIndex = bodyStart + data.body.length;

	return (
		<AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 96px 150px' }}>
			{data.kicker ? (
				<div
					style={{
						...enter(kickerIndex),
						fontFamily: fontFamilies.subtitle,
						fontStyle: 'italic',
						fontSize: 38,
						color: muted,
						marginBottom: 12,
					}}
				>
					{data.kicker}
				</div>
			) : null}

			<div style={{ marginBottom: 36 }}>
				{data.title.map((line, index) => (
					<div
						key={index}
						style={{
							...enter(titleStart + index),
							fontFamily: fontFamilies.subtitle,
							fontSize: 92,
							lineHeight: 1.06,
							textTransform: 'uppercase',
							color: ink,
						}}
					>
						{line}
					</div>
				))}
			</div>

			<div
				style={{
					...enter(dividerIndex),
					width: 120,
					height: 2,
					background: colors.gold,
					marginBottom: 36,
				}}
			/>

			<div style={{ marginBottom: data.footer ? 60 : 0 }}>
				{data.body.map((line, index) => (
					<div
						key={index}
						style={{
							...enter(bodyStart + index),
							fontFamily: fontFamilies.paragraph,
							fontWeight: 400,
							fontSize: 34,
							lineHeight: 1.35,
							color: muted,
						}}
					>
						{line}
					</div>
				))}
			</div>

			{data.footer ? (
				<div
					style={{
						...enter(footerIndex),
						fontFamily: fontFamilies.paragraph,
						fontWeight: 700,
						fontSize: 24,
						letterSpacing: 3,
						textTransform: 'uppercase',
						color: colors.goldLight,
					}}
				>
					{data.footer}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
