/**
 * tarjetas.js
 * Módulo compartido para gestionar el estado de desbloqueo de tarjetas.
 * Se usa tanto en camera.html (guardar) como en tarjetas.html (mostrar estado).
 */

const CARD_MAP = {
    WC26_001: "ALEMANIA.png",
    WC26_002: "ARGENTINA.png",
    WC26_003: "BRASIL.png",
    WC26_004: "CANADA.png",
    WC26_005: "COREA.png",
    WC26_006: "COURTOIS.png",
    WC26_007: "ESTADOS UNIDOS.png",
    WC26_008: "FRACNIA.png",
    WC26_009: "HEUNG-MIN.png",
    WC26_010: "JAPON.png",
    WC26_011: "LAINEZ.png",
    WC26_012: "MBAPPÉ.png",
    WC26_013: "MESSI.png",
    WC26_014: "MEXICO.png",
    WC26_015: "PORTUGAL.png",
};

const STORAGE_KEY = "wc26_tarjetas_desbloqueadas";

/** Devuelve el objeto de estado: { WC26_001: true, ... } */
function getEstado() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

/** Guarda el objeto de estado completo */
function setEstado(estado) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

/** Devuelve true si el código QR es válido (existe en el mapa) */
function esCodigoValido(codigo) {
    return Object.prototype.hasOwnProperty.call(CARD_MAP, codigo);
}

/** Devuelve true si la tarjeta ya está desbloqueada */
function estaDesbloqueada(codigo) {
    return !!getEstado()[codigo];
}

/**
 * Desbloquea una tarjeta. Devuelve true si se desbloqueó ahora,
 * false si ya estaba desbloqueada o el código no es válido.
 */
function desbloquear(codigo) {
    if (!esCodigoValido(codigo)) return false;
    const estado = getEstado();
    const yaActiva = !!estado[codigo];
    estado[codigo] = true;
    setEstado(estado);
    return !yaActiva; // true = nueva tarjeta
}

/** Devuelve el nombre del archivo PNG para un código, o null si no existe */
function getImagen(codigo) {
    return CARD_MAP[codigo] || null;
}

/** Devuelve todos los códigos registrados en el mapa */
function getTodosCodigos() {
    return Object.keys(CARD_MAP);
}