from flask import Flask, request, jsonify
from flask_cors import CORS
from download_utils import get_video_streams, download_stream

app = Flask(__name__)
CORS(app)

@app.route('/download-options', methods=['POST'])
def get_download_options():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    try:
        video_options, audio_options = get_video_streams(url)
        return jsonify({
            "video_options": video_options,
            "audio_options": audio_options
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get("url")
    stream_type = data.get("stream_type")
    resolution = data.get("resolution")
    path = data.get("path")

    if not all([url, stream_type, resolution, path]):
        return jsonify({"error": "Missing data"}), 400
    try:
        success = download_stream(url, stream_type, resolution, path)
        return jsonify({"status": "success"}) if success else jsonify({"status": "failure"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
