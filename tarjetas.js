

const CARD_MAP = {
    WC26_001: "LAINEZ.png",
    WC26_002: "HEUNG-MIN.png",
    WC26_003: "MESSI.png",
    WC26_004: "MBAPPÉ.png",
    WC26_005: "COURTOIS.png",
    WC26_006: "MEXICO.png",
    WC26_007: "COREA.png",
    WC26_008: "ARGENTINA.png",
    WC26_009: "ALEMANIA.png",
    WC26_010: "JAPON.png",
    WC26_011: "BRASIL.png",
    WC26_012: "ESTADOS UNIDOS.png",
    WC26_013: "CANADA.png",
    WC26_014: "PORTUGAL.png",
    WC26_015: "FRANCIA.png",
};

const STORAGE_KEY = "wc26_tarjetas_desbloqueadas";

function getEstado() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function setEstado(estado) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}
function esCodigoValido(codigo) {
    return Object.prototype.hasOwnProperty.call(CARD_MAP, codigo);
}


function estaDesbloqueada(codigo) {
    return !!getEstado()[codigo];
}

function desbloquear(codigo) {
    if (!esCodigoValido(codigo)) return false;
    const estado = getEstado();
    const yaActiva = !!estado[codigo];
    estado[codigo] = true;
    setEstado(estado);
    return !yaActiva;
}

function getImagen(codigo) {
    return CARD_MAP[codigo] || null;
}

function getTodosCodigos() {
    return Object.keys(CARD_MAP);
}