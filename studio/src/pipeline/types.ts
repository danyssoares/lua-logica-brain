/**
 * Formato de UMA linha da tabela de pauta no Supabase.
 *
 * Isso é uma HIPÓTESE de schema, feita para o pipeline poder ser escrito
 * hoje. Ajuste os nomes de coluna aqui e em `supabase.ts` (mapRow) para
 * bater com a tabela real antes do primeiro uso.
 */
import type { Proporcao } from '../lib/types';

export type PautaItem = {
	id: string | number;
	data: string; // YYYY-MM-DD — dia de publicação
	/**
	 * Sem valor padrão de propósito — se não vier preenchido (nem na
	 * pauta, nem passado manualmente), o item é PULADO, não renderizado
	 * com um formato "chutado". Ver validação em `runDay.ts`.
	 */
	formato?: 'post-estatico' | 'carrossel-estatico' | 'carrossel-animado' | 'reel' | 'gravado';
	/** Idem — sempre explícita, nunca assumida. '4:5'/'1:1' pra carrossel/post, '9:16' pra reel. */
	proporcao?: Proporcao;
	pilar?: string; // ex: "Seu mapa explica", "Aforismos", "Diálogos"
	tema: string; // assunto/tópico do dia
	hook?: string; // frase de abertura (reel) ou frase única (post/carrossel capa)
	insights?: string[]; // 2-3 pontos centrais (reel) ou diagnóstico+resolução (carrossel)
	cta?: string; // texto do botão/CTA (linha completa no slide)
	ctaButton?: string; // texto curto da pílula do CTA — opcional, sem default (fecha só com a pergunta/frase de `cta` por padrão, ver conteudo/linguagem.md)
	arquetipo?: string; // para slides que usam ArchetypeCard
	transito?: string;
	reflexao?: string;
	/**
	 * Direção de imagem por slide do meio, alinhada por índice com
	 * `insights` — quando presente, substitui a cena gerada automaticamente
	 * em `promptBuilder.ts#sceneFor`. É o campo que você preenche na etapa
	 * "mandei tudo" (depois de revisar o rascunho).
	 */
	imagens?: string[];
	/**
	 * Presente = usa o layout "manifesto" (kicker itálico + título grande +
	 * divisória + parágrafo + rodapé + imagem circular) em vez do
	 * "frase-unica" padrão, pra formato post-estatico/gravado. `heroScene`
	 * é a cena da imagem circular (bloco de estilo da marca é aplicado
	 * automaticamente, ver `promptBuilder.ts#buildCustomImagePrompt`).
	 */
	manifesto?: { kicker?: string; title: string[]; body: string[]; footer?: string; heroScene?: string };
	/** Legenda do post (texto longo pro Instagram). Não aparece em nenhum slide — só guardada pra quando o agendamento no Instagram for ligado (ver automacoes/arquitetura-publicacao.md). */
	legenda?: string;
	usarFotoPessoal?: boolean; // se true, sinaliza que a imagem deveria referenciar assets-pessoais/
	status?: 'pendente' | 'aprovado' | 'ajustar' | 'publicado';
};

export type ContentPackage = {
	item: PautaItem;
	outDir: string;
	imagens: string[];
	slides?: string[]; // PNGs finais do carrossel, em ordem
	video?: string; // mp4 final do reel
};
