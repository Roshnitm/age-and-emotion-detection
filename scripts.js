const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const emotionResult = document.getElementById('emotion');
const ageResult = document.getElementById('age');

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error("Error accessing webcam:", error);
    });

// Capture image and send to the backend
captureButton.addEventListener('click', function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');

    // Send the captured image to the server for analysis
    fetch('/analyze', {
        method: 'POST',
        body: JSON.stringify({ image: imageData }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Display the results on the page
        emotionResult.textContent = `Detected Emotion: ${data.emotion}`;
        ageResult.textContent = `Estimated Age: ${data.age}`;
    })
    .catch(error => {
        console.error('Error:', error);
        emotionResult.textContent = 'Error detecting emotion';
        ageResult.textContent = 'Error estimating age';
    });
});
