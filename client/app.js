const recordBtn = document.getElementById("recordBtn");
const output = document.getElementById("output");

let mediaRecorder;
let chunks = [];

recordBtn.onclick = async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        startRecording();
    } else {
        stopRecording();
    }
};

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    recordBtn.textContent = "Stop Recording";

    chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "audio.webm");

        const res = await fetch("https://YOUR-BACKEND.onrender.com/stt", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        output.textContent = data.text || "No text received.";
    };
}

function stopRecording() {
    mediaRecorder.stop();
    recordBtn.textContent = "Start Recording";
}
