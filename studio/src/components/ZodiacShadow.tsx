import React from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../lib/tokens';
import type { ZodiacGlyphData } from '../lib/types';

/**
 * Glifo do signo (nítido, pequeno, cortado pela borda) + sua sombra
 * projetada (grande, borrada, no ângulo indicado) — gerado em código, não
 * via IA de imagem, porque modelos de imagem erram símbolos/glifos quase
 * sempre (mesmo motivo da regra de nunca pedir texto na imagem).
 */
export const ZodiacShadow: React.FC<ZodiacGlyphData> = ({ symbol, shadowAngleDeg, edge = 'right' }) => {
	const sideStyle = edge === 'right' ? { right: -30 } : { left: -30 };
	// VARIATION SELECTOR-15 força a apresentação "texto" (glifo monocromático,
	// respeita `color`) em vez da apresentação "emoji" (ícone colorido com
	// fundo, que o Chromium usa por padrão pra esse bloco Unicode e ignora CSS).
	const textGlyph = `${symbol}︎`;

	return (
		<AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
			{/* sombra projetada — o elemento principal, grande o bastante pra
			    alcançar a metade inferior (onde o texto fica) e se misturar
			    com ele em vez de deixar a metade superior vazia */}
			<div
				style={{
					position: 'absolute',
					top: 10,
					...sideStyle,
					fontSize: 1180,
					lineHeight: 1,
					fontFamily: 'Arial, sans-serif',
					color: 'rgba(0,0,0,0.6)',
					filter: 'blur(16px)',
					transform: `rotate(${shadowAngleDeg}deg)`,
					transformOrigin: 'top center',
				}}
			>
				{textGlyph}
			</div>
			{/* glifo nítido — pequeno, no alto */}
			<div
				style={{
					position: 'absolute',
					top: 64,
					...sideStyle,
					fontSize: 150,
					lineHeight: 1,
					fontFamily: 'Arial, sans-serif',
					color: colors.gold,
				}}
			>
				{textGlyph}
			</div>
		</AbsoluteFill>
	);
};
