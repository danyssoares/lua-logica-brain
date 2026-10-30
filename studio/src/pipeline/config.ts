import 'dotenv/config';

const required = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(
			`Variável de ambiente ${name} não definida. Copie studio/.env.example para studio/.env e preencha.`,
		);
	}
	return value;
};

export const config = {
	supabase: {
		get url() {
			return required('SUPABASE_URL');
		},
		get key() {
			return required('SUPABASE_KEY');
		},
		table: process.env.SUPABASE_PAUTA_TABLE ?? 'pauta_mensal',
	},
	replicate: {
		get token() {
			return required('REPLICATE_API_TOKEN');
		},
		model: process.env.REPLICATE_MODEL ?? 'black-forest-labs/flux-1.1-pro',
	},
};
