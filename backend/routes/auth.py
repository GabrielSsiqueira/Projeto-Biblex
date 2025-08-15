from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models.modelo import Usuario

auth_bp = Blueprint('auth',__name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.json

    email = dados.get('email')
    senha = dados.get('senha')

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and check_password_hash(usuario.senha_hash, senha):
       session['usuario_id'] = usuario.id
    
       return jsonify(
        {
            'id_usuario': usuario.id, 
            'nome': usuario.nome, 
            'email': usuario.email, 
            'tipo_usuario': usuario.tipo_usuario, 
            'foto_perfil': usuario.foto_perfil
        }),201
    else:
       return jsonify({'erro':'Usuário ou senha inválidos'}),401

@auth_bp.route('/usuario-logado', methods=['GET'])
def usuario_logado():
    id_usuario = session.get('usuario_id')

    if not id_usuario:
        return jsonify({'erro': 'não autenticado'}), 401
    
    usuario = Usuario.query.get(id_usuario)

    return jsonify({
        'id': usuario.id,
        'nome': usuario.nome,
        'email': usuario.email,
        'tipo_usuario': usuario.tipo_usuario,
        'foto_perfil': usuario.foto_perfil
    })
    

    

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'mensagem':'logout realizado com sucesso'}),200


@auth_bp.route('/cadastrar', methods=['POST'])
def cadastrar_login():
    dados = request.json

    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    if not nome or not email or not senha:
        return jsonify({'erro': 'Campos nome, email e senha são obrigatórios'}),400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'erro': 'Email já está em uso'}), 409

    senha_usuario = generate_password_hash(senha)

    novo_usuario = Usuario(
        nome=nome,
        email=email,
        senha_hash=senha_usuario
    )
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({'mensagem': 'Usuário Cadastrado com Sucesso'}),201