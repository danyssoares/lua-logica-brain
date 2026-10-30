import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import type { PautaItem } from './types';

/**
 * Converte uma linha crua do Supabase para PautaItem. Ajuste os nomes de
 * coluna à esquerda (ex: row.assunto) para bater com a tabela real —
 * isso é a única função que deveria precisar mudar quando o schema for
 * confirmado.
 */
const mapRow = (row: Record<string, unknown>): PautaItem => ({
	id: row.id as string | number,
	data: row.data as string,
	// sem default de propósito — formato/proporção ausentes = item pulado (ver runDay.ts)
	formato: row.formato as PautaItem['formato'],
	proporcao: row.proporcao as PautaItem['proporcao'],
	pilar: row.pilar as string | undefined,
	tema: row.tema as string,
	hook: row.hook as string | undefined,
	insights: (row.insights as string[] | undefined) ?? undefined,
	cta: row.cta as string | undefined,
	ctaButton: row.cta_button as string | undefined,
	arquetipo: row.arquetipo as string | undefined,
	transito: row.transito as string | undefined,
	reflexao: row.reflexao as string | undefined,
	imagens: (row.imagens as string[] | undefined) ?? undefined,
	legenda: row.legenda as string | undefined,
	usarFotoPessoal: Boolean(row.usar_foto_pessoal),
	status: (row.status as PautaItem['status']) ?? 'pendente',
});

const client = () => createClient(config.supabase.url, config.supabase.key);

export const fetchPautaDoDia = async (date: string): Promise<PautaItem[]> => {
	const { data, error } = await client()
		.from(config.supabase.table)
		.select('*')
		.eq('data', date);

	if (error) {
		throw new Error(`Falha ao buscar pauta de ${date} na tabela "${config.supabase.table}": ${error.message}`);
	}

	return (data ?? []).map(mapRow);
};

export const fetchPautaDaSemana = async (startDate: string, endDate: string): Promise<PautaItem[]> => {
	const { data, error } = await client()
		.from(config.supabase.table)
		.select('*')
		.gte('data', startDate)
		.lte('data', endDate)
		.order('data', { ascending: true });

	if (error) {
		throw new Error(`Falha ao buscar pauta da semana (${startDate} a ${endDate}): ${error.message}`);
	}

	return (data ?? []).map(mapRow);
};

export const marcarStatus = async (id: PautaItem['id'], status: PautaItem['status']): Promise<void> => {
	const { error } = await client().from(config.supabase.table).update({ status }).eq('id', id);
	if (error) {
		throw new Error(`Falha ao atualizar status do item ${id}: ${error.message}`);
	}
};
