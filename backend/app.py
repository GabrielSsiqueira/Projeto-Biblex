from flask import Flask,render_template, url_for, jsonify 
from core.config import Config
from flask_cors import CORS
from extensions import db, migrate
from routes.auth import auth_bp
from routes.usuario import usuario_bp
from routes.biblia import biblia_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app,db)
    CORS(app, supports_credentials=True)

    from models import modelo

    app.register_blueprint(auth_bp)
    app.register_blueprint(usuario_bp)
    app.register_blueprint(biblia_bp)

    return app

app = create_app()

if __name__== '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)