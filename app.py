import cv2
import numpy as np
import base64
from flask import Flask, render_template, request, jsonify
from deepface import DeepFace

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json['image']

    # Decode the base64 image
    image_data = base64.b64decode(data.split(',')[1])
    np_img = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Analyze the image using DeepFace (emotion and age detection)
    analysis = DeepFace.analyze(img, actions=['emotion', 'age'])

    # If DeepFace returns a list (multiple faces), take the first face's data
    if isinstance(analysis, list):
        analysis = analysis[0]  # Access first face in list

    result = {
        'emotion': analysis['dominant_emotion'],
        'age': analysis['age']
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
