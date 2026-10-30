/** Uma linha de texto com peso tipográfico próprio (mistura Muli/Alike, como na referência do Canva). */
export type StyledLine = {
	text: string;
	/** Qual fonte da marca usar nessa linha. Default: 'paragraph'. */
	font?: 'title' | 'subtitle' | 'paragraph';
	/** Default: 'ink' (roxo/creme conforme o tema). */
	color?: 'ink' | 'gold' | 'muted';
	weight?: 200 | 300 | 400 | 600 | 700 | 800;
};

export type TextSlideVariant = 'stagger' | 'frase-unica';

export type TextSlideData = {
	variant: TextSlideVariant;
	/** Rótulo pequeno em versalete no topo, ex: "O CÉU DE HOJE". */
	kicker?: string;
	/** 'large' — nome próprio em destaque (ex: nome do signo), fonte title, sem letter-spacing. Default 'small' (versalete). */
	kickerSize?: 'small' | 'large';
	lines: StyledLine[];
	/** Índice (0-based) da linha depois da qual desenhar uma divisória dourada fina — ex: entre um título e um subtítulo, ou entre as duas metades de um aforismo. */
	dividerAfterLine?: number;
	/** Texto do botão/CTA em pílula, ex: "VEM VER SEU MAPA". Opcional. */
	cta?: string;
	/** Tema de cor do slide. */
	theme?: 'dark' | 'light';
};

export type ArchetypeCardData = {
	/** Só preencher se fizer parte de uma série nomeada — sem default. */
	kicker?: string;
	arquetipo: string;
	transito: string;
	reflexao: string;
	theme?: 'dark' | 'light';
};

export type BackgroundEffectData = {
	/** Caminho da imagem (staticFile ou URL http). */
	imageSrc: string;
	/** Direção do zoom lento (Ken Burns). */
	direction?: 'in' | 'out';
	/** Overlay para garantir contraste do texto. */
	overlay?: 'gradient' | 'noise' | 'gradient-noise' | 'none';
	overlayColor?: string;
};

export type ReelSlideKind = 'hook' | 'insight' | 'cta';

export type ReelSlide = {
	kind: ReelSlideKind;
	durationInFrames: number;
	background?: BackgroundEffectData;
	text: TextSlideData;
};

export type ReelData = {
	slides: ReelSlide[];
};

export type CarrosselSlideKind =
	| 'capa'
	| 'diagnostico'
	| 'resolucao'
	| 'arquetipo'
	| 'cta'
	| 'frase-unica'
	| 'manifesto'
	| 'conteudo';

/**
 * Layout tipo "manifesto/editorial": kicker itálico + título em caps
 * (peso forte) + linha divisória + parágrafo curto + rótulo no rodapé.
 * Diferente do "frase-unica" — usado quando você manda uma referência
 * visual específica pra reproduzir (ex: post de eclipse com essa estrutura).
 */
export type ManifestoData = {
	kicker?: string;
	/** Cada string é uma linha do título (ex: ["SE DOAR", "COM AMAR."]). */
	title: string[];
	/** Cada string é uma linha do parágrafo. */
	body: string[];
	/** Rótulo pequeno no rodapé (ex: "ECLIPSE LUNAR EM PEIXES · 28.08"). */
	footer?: string;
	theme?: 'dark' | 'light';
};

/**
 * Glifo de signo + sombra projetada — o glifo nítido fica pequeno, cortado
 * pela borda, no alto; a sombra grande e desfocada é o elemento principal,
 * projetada no ângulo indicado. Ver `components/ZodiacShadow.tsx`.
 */
export type ZodiacGlyphData = {
	/** Caractere Unicode do glifo, ex: '♈'. */
	symbol: string;
	/** Ângulo (graus) da sombra projetada — varia por slide pra dar ritmo visual. */
	shadowAngleDeg: number;
	/** De qual borda o glifo nítido "sai" — controla o corte/posição. Default: 'right'. */
	edge?: 'left' | 'right';
};

/**
 * Proporção do frame — sempre explícita (vinda da pauta ou passada por
 * você), nunca assumida por padrão. Ver `pipeline/runDay.ts` (validação).
 */
export type Proporcao = '4:5' | '1:1' | '9:16';

export type CarrosselSlideData = {
	kind: CarrosselSlideKind;
	proporcao: Proporcao;
	/** Imagem de fundo full-bleed (capa/cta). */
	background?: BackgroundEffectData;
	/** Imagem só na faixa superior do slide, com o resto em cor sólida (diagnóstico/resolução). */
	topImage?: BackgroundEffectData;
	/** Imagem circular pequena com halo de brilho atrás (layout "manifesto"). */
	heroImage?: BackgroundEffectData;
	/** Glifo de signo + sombra projetada, por cima do background. */
	zodiacGlyph?: ZodiacGlyphData;
	/** Brilho dourado decorativo no canto superior direito (ver referência canva-post.png). */
	goldGlow?: boolean;
	text?: TextSlideData;
	archetype?: ArchetypeCardData;
	manifesto?: ManifestoData;
};
