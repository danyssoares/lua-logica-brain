import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { colors, fontFamilies } from '../lib/tokens';
import type { StyledLine, TextSlideData } from '../lib/types';
import { BrandIcon } from './BrandMark';

const fontFor = (line: StyledLine) => {
	if (line.font === 'title') return fontFamilies.title;
	if (line.font === 'subtitle') return fontFamilies.subtitle;
	return fontFamilies.paragraph;
};

const colorFor = (line: StyledLine, theme: 'dark' | 'light') => {
	if (line.color === 'gold') return colors.gold;
	if (line.color === 'muted') return theme === 'dark' ? colors.lilac : colors.purpleMedium;
	return theme === 'dark' ? colors.whiteSoft : colors.purpleDeep;
};

const weightFor = (line: StyledLine) => line.weight ?? (line.font === 'subtitle' ? 400 : 300);

/**
 * Anima uma linha "entrando": blur + fade + leve deslocamento vertical.
 * A cada linha atrasa `delayFrames` * index para criar o efeito escalonado.
 */
const SETTLED = { opacity: 1, translateY: 0, blur: 0 };

const useLineAnimation = (delayFrames: number, index: number, animated: boolean) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - delayFrames * index;

	if (!animated) return SETTLED;

	const progress = spring({
		frame: localFrame,
		fps,
		config: { damping: 200, mass: 0.6, stiffness: 120 },
	});

	const opacity = interpolate(progress, [0, 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(progress, [0, 1], [28, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const blur = interpolate(progress, [0, 1], [10, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return { opacity, translateY, blur };
};

const Kicker: React.FC<{
	text: string;
	theme: 'dark' | 'light';
	animated: boolean;
	index?: number;
	delayFrames?: number;
	size?: 'small' | 'large';
}> = ({ text, theme, animated, index = 0, delayFrames = 8, size = 'small' }) => {
	const { opacity, translateY } = useLineAnimation(delayFrames, index, animated);
	const large = size === 'large';
	return (
		<div
			style={{
				opacity,
				transform: `translateY(${translateY}px)`,
				fontFamily: large ? fontFamilies.title : fontFamilies.paragraph,
				fontWeight: large ? 400 : 700,
				fontSize: large ? 72 : 30,
				letterSpacing: large ? 1 : 8,
				textTransform: large ? 'none' : 'uppercase',
				color: colors.gold,
				marginBottom: large ? 24 : 48,
			}}
		>
			{text}
		</div>
	);
};

const Icon: React.FC<{ theme: 'dark' | 'light'; animated: boolean; delayFrames?: number }> = ({
	theme,
	animated,
	delayFrames = 8,
}) => {
	const { opacity, translateY } = useLineAnimation(delayFrames, 0, animated);
	return (
		<div style={{ opacity, transform: `translateY(${translateY}px)`, marginBottom: 40 }}>
			<BrandIcon theme={theme} size={84} />
		</div>
	);
};

const Line: React.FC<{
	line: StyledLine;
	index: number;
	delayFrames: number;
	theme: 'dark' | 'light';
	fontSize: number;
	animated: boolean;
}> = ({ line, index, delayFrames, theme, fontSize, animated }) => {
	const { opacity, translateY, blur } = useLineAnimation(delayFrames, index, animated);
	return (
		<div
			style={{
				opacity,
				transform: `translateY(${translateY}px)`,
				filter: `blur(${blur}px)`,
				fontFamily: fontFor(line),
				fontWeight: weightFor(line),
				fontSize,
				lineHeight: 1.18,
				color: colorFor(line, theme),
			}}
		>
			{line.text}
		</div>
	);
};

const Divider: React.FC<{ index: number; delayFrames: number; animated: boolean; centered: boolean }> = ({
	index,
	delayFrames,
	animated,
	centered,
}) => {
	const { opacity } = useLineAnimation(delayFrames, index, animated);
	return (
		<div
			style={{
				opacity,
				width: 64,
				height: 2,
				background: colors.gold,
				margin: centered ? '28px auto' : '28px 0',
			}}
		/>
	);
};

const Cta: React.FC<{
	text: string;
	delayFrames: number;
	index: number;
	theme: 'dark' | 'light';
	animated: boolean;
}> = ({ text, delayFrames, index, theme, animated }) => {
	const { opacity, translateY } = useLineAnimation(delayFrames, index, animated);
	return (
		<div
			style={{
				opacity,
				transform: `translateY(${translateY}px)`,
				marginTop: 64,
				display: 'inline-block',
				padding: '28px 56px',
				borderRadius: 999,
				background: theme === 'dark' ? colors.gold : colors.purpleDeep,
				color: theme === 'dark' ? colors.purpleDeep : colors.whiteSoft,
				fontFamily: fontFamilies.paragraph,
				fontWeight: 800,
				fontSize: 28,
				letterSpacing: 2,
				textTransform: 'uppercase',
			}}
		>
			{text}
		</div>
	);
};

/**
 * Bloco de texto animado, compartilhado por Reel e Carrossel.
 *
 * variant "stagger": kicker + linhas entrando em cascata (spring + blur reveal).
 * variant "frase-unica": réplica do formato Canva atual — kicker, ícone/lua
 * opcional acima, frase única centralizada com hierarquia mista Muli/Alike, CTA em pílula.
 */
export const TextSlide: React.FC<{
	data: TextSlideData;
	delayFrames?: number;
	animated?: boolean;
	showIcon?: boolean;
}> = ({ data, delayFrames = 8, animated = true, showIcon }) => {
	const theme = data.theme ?? 'dark';
	const isFraseUnica = data.variant === 'frase-unica';
	const renderIcon = showIcon ?? isFraseUnica;
	const baseIndex = (renderIcon ? 1 : 0) + (data.kicker ? 1 : 0);

	return (
		<AbsoluteFill
			style={{
				justifyContent: isFraseUnica ? 'center' : 'flex-end',
				alignItems: isFraseUnica ? 'center' : 'flex-start',
				padding: isFraseUnica ? '0 110px' : '0 90px 160px',
				textAlign: isFraseUnica ? 'center' : 'left',
			}}
		>
			{renderIcon ? <Icon theme={theme} animated={animated} delayFrames={delayFrames} /> : null}
			{data.kicker ? (
				<Kicker
					text={data.kicker}
					theme={theme}
					animated={animated}
					index={renderIcon ? 1 : 0}
					delayFrames={delayFrames}
					size={data.kickerSize}
				/>
			) : null}
			<div>
				{data.lines.map((line, index) => (
					<React.Fragment key={`${index}-${line.text}`}>
						<Line
							line={line}
							index={index + baseIndex}
							delayFrames={delayFrames}
							theme={theme}
							fontSize={isFraseUnica ? 84 : 58}
							animated={animated}
						/>
						{data.dividerAfterLine === index ? (
							<Divider
								index={index + baseIndex}
								delayFrames={delayFrames}
								animated={animated}
								centered={isFraseUnica}
							/>
						) : null}
					</React.Fragment>
				))}
			</div>
			{data.cta ? (
				<Cta
					text={data.cta}
					index={data.lines.length + baseIndex}
					delayFrames={delayFrames}
					theme={theme}
					animated={animated}
				/>
			) : null}
		</AbsoluteFill>
	);
};
