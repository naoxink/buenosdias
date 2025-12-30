module.exports = async (req, res) => {


    // --------------------------------------
    // 1) Configura tu ubicación
    // --------------------------------------
    const lat = 36.72016;
    const lon = -4.42034;

    // --------------------------------------
    // 2) Función para obtener clima
    // --------------------------------------
    async function obtenerClima(lat, lon) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
            const resp = await fetch(url, { cache: "no-store" });
            if (!resp.ok) return null;

            const data = await resp.json();
            return {
                temp: Math.round(data.current.temperature_2m),
                code: data.current.weather_code
            };
        } catch (e) {
            return null;
        }
    }

    function interpretarClima(code) {
        if (code === 0) return "soleado";
        if (code >= 1 && code <= 3) return "nublado";
        if (code >= 45 && code <= 48) return "con niebla";
        if (code >= 51 && code <= 67) return "lluvioso";
        if (code >= 71 && code <= 86) return "nevado";
        if (code >= 95) return "con tormenta";
        return "algo raro por ahí afuera";
    }

    // --------------------------------------
    // Función: generarHashDia
    // Genera un hash corto (10 caracteres) basado en la fecha ISO (YYYY-MM-DD)
    // --------------------------------------
    function generarHashDia() {
        const s = new Date().toISOString().slice(0, 10);
        let h1 = 0x9e3779b97f4a7c15n;
        let h2 = 0x6a09e667f3bcc908n;

        for (let c of s) {
            const x = BigInt(c.charCodeAt(0));
            h1 = (h1 ^ x) * 0xbf58476d1ce4e5b9n;
            h2 = (h2 + x) * 0x94d049bb133111ebn;
        }

        let h = (h1 ^ h2) & ((1n << 64n) - 1n);

        const chars = [];
        for (let i = 33; i <= 126; i++) chars.push(String.fromCharCode(i));

        let out = "";
        const base = BigInt(chars.length);

        for (let i = 0; i < 10; i++) {
            out += chars[Number(h % base)];
            h = h / base;
        }

        return out;
    }

    // --------------------------------------
    // 3) TUS ARRAYS ORIGINALES + NUEVOS
    // --------------------------------------
    const frasesSets = {
        familia: require('./frases/familia'),
        amigos: require('./frases/amigos')
    };

    const target = (req && req.query && req.query.target) ? String(req.query.target).toLowerCase() : 'familia';
    const selected = frasesSets[target] || frasesSets.familia;

    const frases = selected.frases;

    const frasesLunes = selected.frasesLunes;

    const frasesJueves = selected.frasesJueves;

    const frasesViernes = selected.frasesViernes;

    const frasesHumor = selected.frasesHumor;

    const frasesEspirituales = selected.frasesEspirituales;

    const frasesHumanas = selected.frasesHumanas;

    const frasesClima = selected.frasesClima;

    // --------------------------------------
    // 4) Lógica de día
    // --------------------------------------
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const diaActual = new Date().getDay();
    const diaSemana = diasSemana[diaActual];

    // Base + estilos nuevos
    let frasesDelDia = [
        ...frases,
        ...frasesHumor,
        ...frasesEspirituales,
        ...frasesHumanas
    ];

    // Frases especiales según día
    if (diaActual === 1) frasesDelDia.push(...frasesLunes);
    if (diaActual === 4) frasesDelDia.push(...frasesJueves);
    if (diaActual === 5) frasesDelDia.push(...frasesViernes);

    // --------------------------------------
    // 5) Añadir clima si se obtiene a tiempo
    // --------------------------------------
    const clima = await obtenerClima(lat, lon);

    if (clima) {
        const tipoClima = interpretarClima(clima.code);

        // Añadimos las frases de clima al pool general
        const frasesClimaProcesadas = frasesClima.map(f =>
            f.replace(/::clima::/g, tipoClima).replace(/::temperatura::/g, clima.temp)
        );

        frasesDelDia.push(...frasesClimaProcesadas);
    }

    // --------------------------------------
    // 6) Selección final
    // --------------------------------------
    const fraseSeleccionada = frasesDelDia[Math.floor(Math.random() * frasesDelDia.length)];
    const mensaje = fraseSeleccionada.replace(/::dia_semana::/g, diaSemana);

    let mensajeFinal = mensaje;
    if (target === 'amigos') {
        try {
            mensajeFinal = `${mensaje}\n\nHash del día: ${generarHashDia()}`;
        } catch (e) {
            // si algo falla con BigInt o similar, mantenemos el mensaje original
            mensajeFinal = mensaje;
        }
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(mensajeFinal);
};