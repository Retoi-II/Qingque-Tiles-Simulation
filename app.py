import os
from flask import Flask, render_template, send_from_directory, jsonify, request, abort, url_for

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIRECTORY_PATH = os.path.join(BASE_DIR, 'savedata/')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
def redirect():
    return home()

@app.route('/home')
def home():
    return render_template('home/index.html')

@app.route('/about')
def about():
    return render_template('about/index.html')

@app.route('/api/files', methods=['GET'])
def get_files():
    try:
        files = os.listdir(DIRECTORY_PATH)
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/files/open/<filename>', methods=['GET'])
def open_file(filename):
    try:
        file_path = os.path.join(DIRECTORY_PATH, filename)
        with open(file_path, 'r') as f:
            content = f.read()
        return content
    except FileNotFoundError:
        return abort(404)

@app.route('/api/files/rename', methods=['POST'])
def rename_file():
    data = request.json
    old_name = data['oldName']
    new_name = data['newName']
    old_path = os.path.join(DIRECTORY_PATH, old_name)
    new_path = os.path.join(DIRECTORY_PATH, new_name)

    try:
        os.rename(old_path, new_path)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/files/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        file_path = os.path.join(DIRECTORY_PATH, filename)
        os.remove(file_path)
        return jsonify({"success": True})
    except FileNotFoundError:
        return abort(404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/get_home_url')
def get_home_url():
    return jsonify({"home_url": url_for('home')})

if __name__ == '__main__':
    app.run(debug=True)
