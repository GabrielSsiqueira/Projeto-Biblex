from flask import Blueprint, request, jsonify, flash, redirect, render_template, url_for
from models.modelo import Versao, Livro, Capitulo, Versiculo, VersiculosDiarios
from extensions import db 
import fitz
import re

biblia_bp = Blueprint('biblia', __name__, url_prefix='/biblia')

@biblia_bp.route('/cadastrar', methods=['GET'])
def cadastrar_biblia():
    return render_template('cadastrar.html')

livros_abrev = {
    'Gênesis': 'Gn', 'Êxodo': 'Êx', 'Levítico': 'Lv', 'Números': 'Nm', 'Deuteronômio': 'Dt',
    "Josué": 'Js', 'Juízes': 'Jz', 'Rute': 'Rt', '1 Samuel': '1 Sm', '2 Samuel': '2 Sm',
    '1 Reis': '1 Rs', "2 Reis": '2 Rs', '1 Crônicas': '1 Cr', '2 Crônicas': '2 Cr',
    'Esdras': 'Ed', 'Neemias': 'Ne', 'Ester': 'Et', 'Jó': 'Jó', 'Salmos': 'Sl',
    'Provérbios': 'Pv', 'Eclesiastes': 'Ec', 'Cânticos': 'Ct', 'Isaías': 'Is',
    'Jeremias': 'Jr', 'Lamentações': 'Lm', 'Ezequiel': 'Ez', 'Daniel': 'Dn',
    'Oséias': 'Os', 'Joel': 'Jl', 'Amós': 'Am', 'Obadias': 'Ob', 'Jonas': 'Jn',
    "Miquéias": 'Mq', 'Naum': 'Na', 'Habacuque': 'Hc', 'Sofonias': 'Sf',
    'Ageu': 'Ag', 'Zacarias': 'Zc', 'Malaquias': 'Ml', 'Mateus': 'Mt',
    'Marcos': 'Mc', 'Lucas': 'Lc', 'João': 'Jo', "Atos": 'At', 'Romanos': 'Rm',
    "1 Coríntios": '1 Co', '2 Coríntios': '2 Co', 'Gálatas': 'Gl', 'Efésios': 'Ef',
    'Filipenses': 'Fp', 'Colossenses': 'Cl', '1 Tessalonicenses': '1 Ts',
    '2 Tessalonicenses': '2 Ts', '1 Timóteo': '1 Tm', '2 Timóteo': '2 Tm',
    'Tito': 'Tt', 'Filemom': 'Fm', 'Hebreus': 'Hb', 'Tiago': 'Tg',
    '1 Pedro': '1 Pe', '2 Pedro': '2 Pe', '1 João': '1 Jo', '2 João': '2 Jo',
    '3 João': '3 Jo', 'Judas': 'Jd', 'Apocalipse': 'Ap'
}

ordem_livros = {
    "Gênesis": 0, "Êxodo": 1, "Levítico": 2, "Números": 3, "Deuteronômio": 4, "Josué": 5,
    "Juízes": 6, "Rute": 7, "1 Samuel": 8, "2 Samuel": 9, "1 Reis": 10, "2 Reis": 11,
    "1 Crônicas": 12, "2 Crônicas": 13, "Esdras": 14, "Neemias": 15, "Ester": 16,
    "Jó": 17, "Salmos": 18, "Provérbios": 19, "Eclesiastes": 20, "Cânticos": 21,
    "Isaías": 22, "Jeremias": 23, "Lamentações": 24, "Ezequiel": 25, "Daniel": 26,
    "Oséias": 27, "Joel": 28, "Amós": 29, "Obadias": 30, "Jonas": 31, "Miquéias": 32,
    "Naum": 33, "Habacuque": 34, "Sofonias": 35, "Ageu": 36, "Zacarias": 37,
    "Malaquias": 38, "Mateus": 39, "Marcos": 40, "Lucas": 41, "João": 42, "Atos": 43,
    "Romanos": 44, "1 Coríntios": 45, "2 Coríntios": 46, "Gálatas": 47, "Efésios": 48,
    "Filipenses": 49, "Colossenses": 50, "1 Tessalonicenses": 51,
    "2 Tessalonicenses": 52, "1 Timóteo": 53, "2 Timóteo": 54, "Tito": 55,
    "Filemom": 56, "Hebreus": 57, "Tiago": 58, "1 Pedro": 59, "2 Pedro": 60,
    "1 João": 61, "2 João": 62, "3 João": 63, "Judas": 64, "Apocalipse": 65
}

mapa_nomes = {
    "Salmo": "Salmos",
    "Cântico": "Cânticos",
    "Provérbio": "Provérbios",
    "Lamentacao": "Lamentações",
    "Joao": "João"
}

# --- Padrões a serem ignorados ---
# Compila as expressões regulares para otimização
padroes_para_ignorar = [
    re.compile(r'Bíblia Almeida Corrigida Fiel \(ACF\)'),
    re.compile(r'Sociedade Bíblica Trinitariana do Brasil\.'),
    re.compile(r'^Esclarecimento$'),
    re.compile(r'^Trata-se de iniciativa particular.*'),
    re.compile(r'^Todo esforço em tornar.*'), # Ignora a linha de abertura do esclarecimento
    re.compile(r'^O texto deste trabalho.*'), # Ignora a linha de abertura de outro parágrafo do esclarecimento
    re.compile(r'^Se possível, faça download.*'), # Ignora a linha de abertura do parágrafo de download
    re.compile(r'^Divulga a Palavra de Deus.*'), # Ignora a linha de abertura do parágrafo de divulgação
    re.compile(r'^Capa: Pôr do sol.*'), # Ignora a linha de detalhes da capa
    re.compile(r'Marcel da Glória Pereira'),
    re.compile(r'\d{4}, Vitória/ES - Brasil'),
    # Padrão para ignorar números de página isolados. Ele busca por um número de 1 a 4 dígitos
    # que está sozinho em uma linha, possivelmente com espaços em branco ao redor.
    re.compile(r'^\s*\d{1,4}\s*$')
]

@biblia_bp.route('/importar-biblia', methods=['POST'])
def importar_biblia():
    nome = request.form.get('nome')
    sigla = request.form.get('sigla')
    arquivo = request.files.get('arquivo')

    if not arquivo or not arquivo.filename.endswith('.pdf'):
        return jsonify({'erro': 'Envie um arquivo PDF válido!'}), 400

    versao = Versao.query.filter_by(sigla=sigla).first()
    if not versao:
        versao = Versao(sigla=sigla, nome=nome)
        db.session.add(versao)
        db.session.commit()

    try:
        doc = fitz.open(stream=arquivo.read(), filetype='pdf')
    except Exception as e:
        return jsonify({'erro': f'Não foi possível ler o arquivo PDF: {e}'}), 500

    livro_atual = None
    capitulo_atual = None
    livro_obj = None
    capitulo_obj = None
    total_importados = 0

    versiculo_numero_acumulado = None
    texto_versiculo_acumulado = ""

    def salvar_versiculo_acumulado():
        nonlocal total_importados
        nonlocal texto_versiculo_acumulado
        
        if versiculo_numero_acumulado is not None and texto_versiculo_acumulado:
            versiculo_existente = Versiculo.query.filter_by(
                capitulo_id=capitulo_obj.id,
                versao_id=versao.id,
                numero=versiculo_numero_acumulado
            ).first()

            if not versiculo_existente:
                texto_final = " ".join(texto_versiculo_acumulado.strip().split())
                
                versiculo_obj = Versiculo(
                    capitulo_id=capitulo_obj.id,
                    versao_id=versao.id,
                    numero=versiculo_numero_acumulado,
                    texto=texto_final
                )
                db.session.add(versiculo_obj)
                total_importados += 1

    for pagina_num, pagina in enumerate(doc, 1):
        texto = pagina.get_text()
        linhas = texto.split('\n')

        for linha in linhas:
            linha = linha.strip()
            if not linha:
                continue

            # Filtra as linhas indesejadas
            ignorar_linha = False
            for padrao in padroes_para_ignorar:
                if padrao.search(linha):
                    ignorar_linha = True
                    break
            
            if ignorar_linha:
                continue

            # Detecta livro e capítulo (padrão Gênesis 1)
            match_livro = re.match(r'^([1-3]?\s?[\wçãéêíóôúÇÂÁÍÓÚ\s\-]+)\s+(\d+)$', linha)
            if match_livro:
                if livro_obj and capitulo_obj:
                    salvar_versiculo_acumulado()
                versiculo_numero_acumulado = None
                texto_versiculo_acumulado = ""

                livro_atual = match_livro.group(1).strip()
                capitulo_atual = int(match_livro.group(2))
                
                nome_normalizado = livro_atual.replace('-', ' ').title().strip()
                if nome_normalizado in mapa_nomes:
                    nome_normalizado = mapa_nomes[nome_normalizado]
                
                livro_obj = Livro.query.filter_by(nome=nome_normalizado).first()
                if not livro_obj:
                    ordem = ordem_livros.get(nome_normalizado)
                    if ordem is not None:
                        testamento = "AT" if ordem <= 38 else "NT"
                        livro_obj = Livro(nome=nome_normalizado, abrev=livros_abrev.get(nome_normalizado, nome_normalizado[:3]), ordem=ordem, testamento=testamento)
                        db.session.add(livro_obj)
                        db.session.commit()
                
                if livro_obj:
                    capitulo_obj = Capitulo.query.filter_by(numero=capitulo_atual, livro_id=livro_obj.id).first()
                    if not capitulo_obj:
                        capitulo_obj = Capitulo(numero=capitulo_atual, livro_id=livro_obj.id)
                        db.session.add(capitulo_obj)
                        db.session.commit()
                continue
                
            # Detecta o início de um novo versículo (padrão 1No, 2E)
            match_versiculo = re.match(r'^(\d+)(.*)', linha)
            if match_versiculo and livro_obj and capitulo_obj:
                salvar_versiculo_acumulado()
                
                versiculo_numero_acumulado = int(match_versiculo.group(1))
                texto_versiculo_acumulado = match_versiculo.group(2).strip()
            
            # Se não é o início de um versículo, adiciona a linha ao texto atual
            elif versiculo_numero_acumulado is not None:
                texto_versiculo_acumulado += " " + linha.strip()

    salvar_versiculo_acumulado()
    
    db.session.commit()
    return jsonify({'mensagem': f'{total_importados} versículos importados com sucesso'})

 
# Sua rota otimizada em Flask
# Sua rota simplificada em Flask
@biblia_bp.route('/versoes/<string:versao>/livros', methods=['GET'])
def livros(versao):
    versao = Versao.query.filter_by(sigla=versao).first()
    if not versao:
        return jsonify({'Erro': 'Versão não encontrada'}), 404

    # Busca todos os livros ordenados
    livros = Livro.query.order_by(Livro.ordem).all()

    livros_response = []
    for livro in livros:
        livros_response.append({
            'id': livro.id,
            'nome': livro.nome,
            'abrev': livro.abrev,
            'ordem': livro.ordem,
            'testamento': livro.testamento,
        })
    
    return jsonify(livros_response)

@biblia_bp.route('/livros/<int:livro_id>/capitulos', methods=['GET'])
def capitulos(livro_id):
    livro = Livro.query.get(livro_id)
    if not livro:
        return jsonify({'Erro': 'Livro não encontrado'}), 404

    # Busca os capítulos do livro ordenados pelo número
    capitulos = Capitulo.query.filter_by(livro_id=livro_id).order_by(Capitulo.numero).all()
    
    capitulos_response = [{
        'id': c.id,
        'numero': c.numero
    } for c in capitulos]

    return jsonify(capitulos_response)

    
@biblia_bp.route('/versoes/<string:versao>/capitulos/<int:capitulo_id>/versiculos', methods=['GET'])
def versiculos(versao, capitulo_id):
    versao_obj = Versao.query.filter_by(sigla=versao).first()
    if not versao_obj:
        return jsonify({'Erro': 'Versão não encontrada'}), 404
        
    capitulo = Capitulo.query.get(capitulo_id)
    if not capitulo:
        return jsonify({'Erro': 'Capítulo não encontrado'}), 404

    # Busca os versículos do capítulo para a versão selecionada, ordenados pelo número
    versiculos = Versiculo.query.filter_by(capitulo_id=capitulo_id, versao_id=versao_obj.id).order_by(Versiculo.numero).all()

    versiculos_response = [{
        'id': v.id,
        'numero': v.numero,
        'texto': v.texto
    } for v in versiculos]

    return jsonify(versiculos_response)

@biblia_bp.route('/versiculo-diario', methods=['GET'])
def versiculo_diario():
    data_param = request.args.get('data')
    
    versiculo = VersiculosDiarios.query.filter_by(data=data_param).first()

    if not versiculo:
        return jsonify({'erro': 'Nenhum versiculo para hoje'}), 404
    
    return jsonify({
        "livro": versiculo.livro,
        "capitulo": versiculo.capitulo,
        'versiculo': versiculo.versiculo,
        "texto": versiculo.texto
    }), 201