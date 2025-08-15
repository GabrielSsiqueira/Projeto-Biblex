from flask import Blueprint, request, jsonify, session
from extensions import db
from models.modelo import Usuario

usuario_bp = Blueprint('usuario',__name__, url_prefix='/usuario')

@usuario_bp.route('/atualizar-foto/<int:id_usuario>', methods=['PUT'])
def atualizar_foto(id_usuario):
    data = request.json

    nova_foto = data.get('foto_perfil')

    if not nova_foto:
        return jsonify({'erro': 'A foto do perfil é obrigatória'}), 400

    usuario = Usuario.query.get(id_usuario)

    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404

    usuario.foto_perfil = nova_foto

    try:
        db.session.commit()
        return jsonify({'mensagem': 'foto de perfil atualizada com sucesso'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Erro ao atualizar foto de perfil', 'detalhe': str(e)}),500
    

@usuario_bp.route('/tornar-autor/<int:id_usuario>', methods=['POST'])
def tornar_autor(id_usuario):

    dados = request.json

    tipo_usuario = dados.get('tipo_usuario')
    funcao_ministerial = dados.get('funcao_ministerial')
    igreja_local = dados.get('igreja_local')
    tempo_ministerial = dados.get('tempo_ministerial')

    if not tipo_usuario or not funcao_ministerial or not igreja_local or not tempo_ministerial:
        return jsonify({'erro': 'Dados são obrigatórios!'}), 400
    
    usuario = Usuario.query.get(id_usuario)

    if not usuario:
        return jsonify({'Erro': 'Usuario não encontrado!'}), 404

    usuario.tipo_usuario = tipo_usuario
    usuario.funcao_ministerial = funcao_ministerial
    usuario.igreja_local = igreja_local
    usuario.tempo_ministerial = tempo_ministerial

    try:
        db.session.commit()
        return jsonify({'mensagem': 'Perfil Atualizado para Autor!'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Erro ao atualizar foto de perfil para autor', 'detalhe': str(e)}),500