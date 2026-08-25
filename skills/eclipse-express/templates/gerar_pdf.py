"""
Gerador do PDF de 1 página — Leitura Express de Eclipse (Lua Lógica)

Como usar:
1. Edite apenas o bloco "CONTEÚDO" abaixo com os textos já aprovados
   (sem jargão técnico — casa/grau/aspecto NÃO aparecem aqui).
2. Rode: python gerar_pdf.py
3. O arquivo sai como Leitura_Eclipse_<nome>.pdf na pasta atual.

Paleta Mystic Tech: roxo #450E5D, dourado #C6A156, creme #F2E8E4.
Fontes: tenta usar Cormorant Garamond (títulos) e Mulish (corpo) se os
arquivos .ttf estiverem disponíveis em ./fonts/; caso contrário, cai para
Helvetica/Times como fallback automático (não precisa editar nada pra isso).
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ----------------------------- CONTEÚDO -------------------------------
# Edite só esta parte. Linguagem simples, sem astrologuês.

NOME_CONSULENTE = "Nome da Consulente"
TITULO = "Eclipse em Leão: o que ele desperta em você"

BLOCO_1_TITULO = "Onde ele ativa"
BLOCO_1_TEXTO = (
    "Texto curto (2-4 frases) sobre a área da vida ativada pelo eclipse, "
    "em linguagem simples e sentida — não nomear casa astrológica."
)

BLOCO_2_TITULO = "O que ele toca em você"
BLOCO_2_TEXTO = (
    "Texto curto sobre o ponto pessoal do mapa que o eclipse ativa, "
    "traduzido em comportamento/sensação real, sem nomear planeta cru."
)

BLOCO_3_TITULO = "Seu fio condutor"
BLOCO_3_TEXTO = (
    "Texto curto sobre o que vai ajudar essa pessoa a atravessar o período "
    "(o regente do eclipse, traduzido em uma qualidade ou recurso interno)."
)

BLOCO_4_TITULO = "Quando isso reverbera"
BLOCO_4_TEXTO = (
    "Texto curto com 1-2 janelas de tempo nos próximos 6 meses, em "
    "linguagem de calendário (ex: 'de olho principalmente em outubro, "
    "e de novo perto de janeiro'), nunca em graus ou nomes de trânsito."
)

RODAPE = "Lua Lógica — Astrologia aprofundada com inteligência artificial"
# Nota: evite emojis (🌙 ✨ etc.) no CTA/rodapé — sem as fontes .ttf em ./fonts/,
# o fallback Helvetica não tem esses glifos e eles renderizam como um quadrado.
CTA = "Quer se aprofundar nesse período? Vem falar comigo."

NOME_ARQUIVO_SAIDA = f"Leitura_Eclipse_{NOME_CONSULENTE.replace(' ', '_')}.pdf"

# ----------------------------- CORES ------------------------------------
ROXO = HexColor("#450E5D")
DOURADO = HexColor("#C6A156")
CREME = HexColor("#F2E8E4")

# ----------------------------- FONTES ------------------------------------
FONT_TITLE = "Helvetica-Bold"
FONT_BODY = "Helvetica"

fonts_dir = os.path.join(os.path.dirname(__file__), "fonts")
try:
    pdfmetrics.registerFont(TTFont("CormorantGaramond", os.path.join(fonts_dir, "CormorantGaramond-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Mulish", os.path.join(fonts_dir, "Mulish-Regular.ttf")))
    FONT_TITLE = "CormorantGaramond"
    FONT_BODY = "Mulish"
except Exception:
    pass  # segue com Helvetica se as fontes não estiverem disponíveis

# ----------------------------- ESTILOS ------------------------------------
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "TituloPrincipal", parent=styles["Title"],
    fontName=FONT_TITLE, fontSize=22, leading=26,
    textColor=ROXO, alignment=TA_CENTER, spaceAfter=6,
)

style_subtitle = ParagraphStyle(
    "Subtitulo", parent=styles["Normal"],
    fontName=FONT_BODY, fontSize=11, leading=14,
    textColor=DOURADO, alignment=TA_CENTER, spaceAfter=18,
)

style_bloco_titulo = ParagraphStyle(
    "BlocoTitulo", parent=styles["Heading2"],
    fontName=FONT_TITLE, fontSize=14, leading=18,
    textColor=ROXO, spaceBefore=14, spaceAfter=4,
)

style_bloco_texto = ParagraphStyle(
    "BlocoTexto", parent=styles["Normal"],
    fontName=FONT_BODY, fontSize=10.5, leading=15,
    textColor=HexColor("#2A2A2A"), alignment=TA_LEFT,
)

style_cta = ParagraphStyle(
    "CTA", parent=styles["Normal"],
    fontName=FONT_TITLE, fontSize=12, leading=16,
    textColor=ROXO, alignment=TA_CENTER, spaceBefore=18, spaceAfter=4,
)

style_rodape = ParagraphStyle(
    "Rodape", parent=styles["Normal"],
    fontName=FONT_BODY, fontSize=8.5, leading=11,
    textColor=DOURADO, alignment=TA_CENTER, spaceBefore=6,
)

# ----------------------------- MONTAGEM ------------------------------------
doc = SimpleDocTemplate(
    NOME_ARQUIVO_SAIDA, pagesize=A4,
    topMargin=28 * mm, bottomMargin=20 * mm,
    leftMargin=22 * mm, rightMargin=22 * mm,
)

story = []
story.append(Paragraph(TITULO, style_title))
story.append(Paragraph(f"Leitura Express de Eclipse · {NOME_CONSULENTE}", style_subtitle))
story.append(HRFlowable(width="100%", thickness=0.8, color=DOURADO, spaceAfter=10))

for bloco_titulo, bloco_texto in [
    (BLOCO_1_TITULO, BLOCO_1_TEXTO),
    (BLOCO_2_TITULO, BLOCO_2_TEXTO),
    (BLOCO_3_TITULO, BLOCO_3_TEXTO),
    (BLOCO_4_TITULO, BLOCO_4_TEXTO),
]:
    story.append(Paragraph(bloco_titulo, style_bloco_titulo))
    story.append(Paragraph(bloco_texto, style_bloco_texto))

story.append(HRFlowable(width="100%", thickness=0.6, color=DOURADO, spaceBefore=16, spaceAfter=4))
story.append(Paragraph(CTA, style_cta))
story.append(Paragraph(RODAPE, style_rodape))

doc.build(story)
print(f"PDF gerado: {NOME_ARQUIVO_SAIDA}")
