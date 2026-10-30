import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { colors, fontFamilies } from '../lib/tokens';

const HANDLE = '@lualogica';

const iconSrcFor = (theme: 'dark' | 'light') =>
	staticFile(
		theme === 'dark' ? 'logo/icone-transparente-fundo-escuro.png' : 'logo/icone-transparente-fundo-claro.png',
	);

/** Só o ícone (lua + estrela), sem posicionamento — quem chama decide o layout. */
export const BrandIcon: React.FC<{ theme: 'dark' | 'light'; size?: number }> = ({ theme, size = 72 }) => (
	<Img
		src={iconSrcFor(theme)}
		style={{
			width: size,
			height: size,
			objectFit: 'contain',
			// mantém o ícone legível quando cai sobre uma foto (topImage)
			filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))',
		}}
	/>
);

/** Só o @lualogica, sem posicionamento. */
export const BrandHandle: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => (
	<div
		style={{
			fontFamily: fontFamilies.paragraph,
			fontWeight: 700,
			fontSize: 24,
			letterSpacing: 1,
			color: theme === 'dark' ? colors.whiteSoft : colors.purpleMedium,
			opacity: 0.55,
		}}
	>
		{HANDLE}
	</div>
);

/**
 * Assinatura da marca, sempre presente no frame:
 * - "corner": ícone pequeno no canto superior esquerdo + @lualogica discreto
 *   no canto inferior esquerdo. Para slides com texto ancorado embaixo
 *   (variant "stagger", ArchetypeCard) — não disputa espaço com o texto.
 * - "centered": só o @lualogica embaixo, discreto. O ícone, nesse caso, já
 *   é renderizado pelo próprio TextSlide (variant "frase-unica"), centralizado
 *   acima do kicker — ver TextSlide.tsx.
 */
export const BrandWatermark: React.FC<{ theme: 'dark' | 'light'; placement: 'corner' | 'centered' }> = ({
	theme,
	placement,
}) => (
	<AbsoluteFill style={{ pointerEvents: 'none' }}>
		{placement === 'corner' ? (
			<div style={{ position: 'absolute', top: 64, left: 90 }}>
				<BrandIcon theme={theme} size={72} />
			</div>
		) : null}
		<div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: placement === 'corner' ? 'left' : 'center', paddingLeft: placement === 'corner' ? 90 : 0 }}>
			<BrandHandle theme={theme} />
		</div>
	</AbsoluteFill>
);
