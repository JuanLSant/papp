/**
 * capture.js
 * Lector de QR + lógica del botón Guardar.
 * Depende de tarjetas.js (debe cargarse antes).
 */

const canvasElement = document.getElementById("Cam");
const canvas = canvasElement.getContext("2d");
const mensaje = document.getElementById("mensaje");
const switchInput = document.getElementById("modoSwitch");
const botonGuardar = document.querySelector(".boton-guardar-carta");

const video = document.createElement("video");
video.setAttribute("playsinline", true);
let scanning = false;
let codigoActual = null; // último código QR detectado

/* ── Preview de imagen al escanear ─────────────────────────── */
const previewImg = document.getElementById("preview-tarjeta");

function mostrarPreview(codigo) {
    if (!previewImg) return;
    const imagen = getImagen(codigo);
    if (imagen) {
        previewImg.src = `tarjetas/${imagen}`;
        previewImg.classList.add("visible");
    }
}

function ocultarPreview() {
    if (!previewImg) return;
    previewImg.classList.remove("visible");
    previewImg.src = "";
}

/* ── Estado del botón Guardar ───────────────────────────────── */
function actualizarBoton() {
    if (!codigoActual || !esCodigoValido(codigoActual)) {
        botonGuardar.classList.remove("activo", "ya-guardada");
        botonGuardar.textContent = "Guardar";
        return;
    }

    if (estaDesbloqueada(codigoActual)) {
        botonGuardar.classList.remove("activo");
        botonGuardar.classList.add("ya-guardada");
        botonGuardar.textContent = "✔ Ya guardada";
    } else {
        botonGuardar.classList.add("activo");
        botonGuardar.classList.remove("ya-guardada");
        botonGuardar.textContent = "💾 Guardar tarjeta";
    }
}

botonGuardar.addEventListener("click", () => {
    if (!codigoActual || !esCodigoValido(codigoActual)) {
        mensaje.textContent = "No hay ningún código QR válido leído.";
        return;
    }

    const nueva = desbloquear(codigoActual);
    actualizarBoton();

    if (nueva) {
        mensaje.textContent = `¡Tarjeta desbloqueada! 🎉`;
        botonGuardar.classList.add("guardado-flash");
        setTimeout(() => botonGuardar.classList.remove("guardado-flash"), 600);
    } else {
        mensaje.textContent = "Esta tarjeta ya estaba en tu colección.";
    }
});

/* ── Escáner QR ─────────────────────────────────────────────── */
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
            const datos = code.data.trim();
            mensaje.textContent = datos;
            mensaje.parentElement.classList.add("success");

            codigoActual = datos;
            actualizarBoton();
            mostrarPreview(datos);

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
    // Resetear estado visual al cambiar cámara
    codigoActual = null;
    ocultarPreview();
    actualizarBoton();
    mensaje.parentElement.classList.remove("success");

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