from extensions import db
from datetime import date
from datetime import datetime

class Usuario(db.Model):
    __tablename__ = 'tb_usuarios'

    id = db.Column(db.Integer, primary_key=True)
    foto_perfil = db.Column(db.String(150), nullable=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    tipo_usuario = db.Column(db.Enum('comum', 'admin', 'autor', name='tipo_usuario_enum'), default='comum' , nullable=False)
    funcao_ministerial = db.Column(db.String(100))
    igreja_local = db.Column(db.String(150))
    tempo_ministerio = db.Column(db.String(50))
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)


class PlanoEstudo(db.Model):
    __tablename__ = 'tb_plano_estudo'

    id_plano = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    dias_total = db.Column(db.Integer, nullable=False)
    imagem_url = db.Column(db.String(255))
    criado_por = db.Column(db.Integer, db.ForeignKey('tb_usuarios.id'), nullable=False)

    criador = db.relationship('Usuario', backref='planos_criados')

class ConteudoPlano(db.Model):
    __tablename__ = 'tb_conteudo_plano'

    id_conteudo = db.Column(db.Integer, primary_key=True)
    id_plano = db.Column(db.Integer, db.ForeignKey('tb_plano_estudo.id_plano'), nullable=False)
    dia = db.Column(db.Integer, nullable=False)
    conteudo_texto = db.Column(db.Text, nullable=False)
    referencias_biblicas = db.Column(db.Text)

    plano = db.relationship('PlanoEstudo', backref='conteudos')

class UsuarioPlanos(db.Model):
    __tablename__ = 'tb_usuario_plano'

    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('tb_usuarios.id'), nullable=False)
    id_plano = db.Column(db.Integer, db.ForeignKey('tb_plano_estudo.id_plano'), nullable=False)
    dia_atual = db.Column(db.Integer, default=1)
    iniciado_em = db.Column(db.DateTime, default=datetime.utcnow)
    concluido = db.Column(db.Boolean, default=False)

    usuario = db.relationship('Usuario', backref='planos_participando')
    plano = db.relationship('PlanoEstudo', backref='usuarios_participando')

class VersiculosDiarios(db.Model):
    __tablename__ = 'tb_versiculos_diarios'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, unique=True)
    livro = db.Column(db.String(20))
    capitulo = db.Column(db.Integer)
    versiculo = db.Column(db.Integer)
    texto = db.Column(db.Text)


class Devocinal(db.Model):
    __tablename__ = 'tb_devocional'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, unique=True)
    titulo = db.Column(db.Text)
    texto = db.Column(db.Text)
    referencias_biblicas = db.Column(db.String(100))

    criador_por = db.Column(db.Integer, db.ForeignKey('tb_usuarios.id'))

    criador = db.relationship('Usuario', backref='devocionais_criadas')

class Versao(db.Model):
    __tablename__ = 'tb_versao_biblia'

    id = db.Column(db.Integer, primary_key=True)
    sigla = db.Column(db.String(10), unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)

    versiculos = db.relationship('Versiculo', back_populates='versao')


class Livro(db.Model):
    __tablename__ = 'tb_livro_biblia'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    abrev = db.Column(db.String(10), unique=True, nullable=False)
    ordem = db.Column(db.Integer, nullable=False)
    testamento = db.Column(db.String(10), nullable=False)

    capitulos = db.relationship('Capitulo', back_populates='livro')

class Capitulo(db.Model):
    __tablename__ = 'tb_capitulo_biblia'

    id = db.Column(db.Integer, primary_key=True)
    livro_id = db.Column(db.Integer, db.ForeignKey('tb_livro_biblia.id'))
    numero = db.Column(db.Integer, nullable=False)

    livro = db.relationship('Livro', back_populates='capitulos')
    versiculos = db.relationship('Versiculo', back_populates='capitulo')

class Versiculo(db.Model):
    __tablename__ = 'tb_versiculo_biblia'

    id = db.Column(db.Integer, primary_key=True)
    capitulo_id = db.Column(db.Integer, db.ForeignKey('tb_capitulo_biblia.id'))
    versao_id = db.Column(db.Integer, db.ForeignKey('tb_versao_biblia.id'))
    numero = db.Column(db.Integer, nullable=False)
    texto = db.Column(db.Text, nullable=False)

    capitulo = db.relationship('Capitulo', back_populates='versiculos')
    versao = db.relationship('Versao', back_populates='versiculos')  

    