const canvasElement = document.getElementById("Cam");
const canvas = canvasElement.getContext("2d");
const mensaje = document.getElementById("mensaje");
const switchInput = document.getElementById("modoSwitch");

const video = document.createElement("video");
video.setAttribute("playsinline", true);
let scanning = false;

function dibujarFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = canvas.getImageData(
            0, 0,
            canvasElement.width,
            canvasElement.height
        );

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert"
        });

        if (code) {
            mensaje.textContent = code.data;
            mensaje.parentElement.classList.add("success");
            scanning = false;
            video.srcObject?.getTracks().forEach(track => track.stop());
            return;
        }
    }

    if (scanning) {
        requestAnimationFrame(dibujarFrame);
    }
}

function iniciarCamara() {
    const facing = switchInput.checked ? "user" : "environment";

    navigator.mediaDevices
        .getUserMedia({
            video: {
                facingMode: facing,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        })
        .then(stream => {
            video.srcObject = stream;
            video.play().then(() => {
                scanning = true;
                mensaje.textContent = "Apunta al código QR";
                dibujarFrame();
            });
        })
        .catch(err => {
            mensaje.textContent = "No se pudo abrir la cámara";
            console.error("Error cámara:", err);
        });
}


iniciarCamara();


switchInput.addEventListener("change", () => {
    if (scanning) {
        video.srcObject?.getTracks().forEach(track => track.stop());
        scanning = false;
    }
    iniciarCamara();
});


window.addEventListener("beforeunload", () => {
    video.srcObject?.getTracks().forEach(track => track.stop());
});