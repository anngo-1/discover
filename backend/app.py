from flask import Flask
from flask_cors import CORS
from works import work_data_bp
from journals import journal_data_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(work_data_bp, url_prefix="/works")
app.register_blueprint(journal_data_bp, url_prefix="/works")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)