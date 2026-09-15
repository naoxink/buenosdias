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
        if (code === 0) return "despejado";
        if ([1, 2].includes(code)) return "parcialmente nublado";
        if (code === 3) return "nublado";
    
        if ([45, 48].includes(code)) return "con niebla";
    
        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
            return "lluvioso";
    
        if ([71, 73, 75, 77, 85, 86].includes(code))
            return "nevado";
    
        if ([95, 96, 99].includes(code))
            return "con tormenta";
    
        return "con tiempo variable";
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
    // 3) TUS ARRAYS ORIGINALES (se usan como fallback)
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

    // --------------------------------------
    // 5) Generación con Gemini (IA), con fallback a frases estáticas
    // --------------------------------------

    // Igual que en generar-pregunta.js: los nombres de modelo de Gemini cambian
    // con frecuencia, así que probamos una lista de candidatos en orden.
    const MODELOS_CANDIDATOS = [
        process.env.GEMINI_MODEL,
        'gemini-flash-latest',
        'gemini-3.7-flash',
        'gemini-3.6-flash'
    ].filter(Boolean);

async function llamarGemini(modelo, apiKey, prompt, signal) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
    const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 1000,
                thinkingConfig: {
                    thinkingLevel: "off"
                }
            }
        })
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        const error = new Error(`Error de la API de Gemini con "${modelo}" (${respuesta.status}): ${detalle}`);
        error.status = respuesta.status;
        throw error;
    }

    const datos = await respuesta.json();
    
    // Filtrar los bloques para descartar posibles partes de pensamiento (thought: true) si la API las devuelve
    const candidate = datos.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textPart = parts.find(p => !p.thought && p.text) || parts[0];
    const texto = textPart?.text?.trim();

    if (!texto) {
        throw new Error(`La API de Gemini ("${modelo}") no devolvió texto en la respuesta.`);
    }

    return texto.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\n+/g, ' ').trim();
}


    function elegirEjemplos(lista, n) {
        const copia = [...lista];
        const elegidos = [];
        for (let i = 0; i < n && copia.length > 0; i++) {
            const idx = Math.floor(Math.random() * copia.length);
            elegidos.push(copia.splice(idx, 1)[0].replace(/::dia_semana::/g, diaSemana));
        }
        return elegidos;
    }

    function construirPrompt(target, diaSemana, climaTexto) {
        const tonoPorTarget = {
            familia: 'cercano, cálido y positivo, como un mensaje de buenos días a un grupo de familia. Puede llevar 1-2 emojis, sin pasarse.',
            amigos: 'informal, desenfadado y con humor cotidiano, como un mensaje a un grupo de colegas/amigos. Puede llevar 1-2 emojis o algún toque irónico.'
        };
        const tono = tonoPorTarget[target] || tonoPorTarget.familia;

        const ejemplos = elegirEjemplos(frases, 4);

        let prompt = `Escribe UN SOLO mensaje breve de buenos días en español (españa), en tono ${tono}\n`;
        prompt += `Hoy es ${diaSemana}. Menciona el día de forma natural, sin sonar forzado.\n`;
        if (climaTexto) {
            prompt += `Dato de contexto (opcional, úsalo solo si aporta y de forma natural, no lo fuerces): ${climaTexto}.\n`;
        }
        prompt += `Aquí tienes ejemplos del tono y estilo que ya se usan (no los copies, son solo referencia de voz):\n`;
        ejemplos.forEach(e => { prompt += `- ${e}\n`; });
        prompt += `\nRequisitos:\n`;
        prompt += `- Una sola frase o dos cortas como máximo, nada de párrafos largos.\n`;
        prompt += `- Que suene natural y variado, no como una plantilla repetida.\n`;
        prompt += `- Sin comillas envolventes ni explicaciones.\n`;
        prompt += `Devuelve SOLO el mensaje final, listo para enviar.`;

        return prompt;
    }

    async function generarFraseIA(target, diaSemana, climaTexto) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return null;

        const prompt = construirPrompt(target, diaSemana, climaTexto);

        for (const modelo of MODELOS_CANDIDATOS) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            try {
                const texto = await llamarGemini(modelo, apiKey, prompt, controller.signal);
                clearTimeout(timeoutId);
                if (texto) return texto;
            } catch (err) {
                clearTimeout(timeoutId);
                console.warn(`[saludo] Fallo con el modelo "${modelo}": ${err.message}`);
            }
        }
        return null;
    }

    // --------------------------------------
    // 6) Clima (no bloqueante: si falla, seguimos sin él)
    // --------------------------------------
    let climaDatos = null;
    let climaTexto = null;
    try {
        climaDatos = await obtenerClima(lat, lon);
        if (climaDatos) {
            climaTexto = `hoy está ${interpretarClima(climaDatos.code)} y hay ${climaDatos.temp}°C`;
        }
    } catch (e) {
        climaDatos = null;
        climaTexto = null;
    }

    // --------------------------------------
    // 7) Intentar generar con IA; si falla, usar el sistema estático original
    // --------------------------------------
    let mensaje = await generarFraseIA(target, diaSemana, climaTexto);

    if (!mensaje) {
        // ---- FALLBACK: exactamente la lógica original de selección estática ----
        let frasesDelDia = [
            ...frases,
            ...frasesHumor
            //...frasesEspirituales,
            //...frasesHumanas
        ];

        if (diaActual === 1) frasesDelDia = frasesLunes;
        if (diaActual === 4) frasesDelDia = frasesJueves;
        if (diaActual === 5) frasesDelDia = frasesViernes;

        if (climaDatos && frasesClima && frasesClima.length) {
            const frasesClimaProcesadas = frasesClima.map(f =>
                f.replace(/::clima::/g, interpretarClima(climaDatos.code)).replace(/::temperatura::/g, climaDatos.temp)
            );
            frasesDelDia = [...frasesDelDia, ...frasesClimaProcesadas];
        }

        const fraseSeleccionada = frasesDelDia[Math.floor(Math.random() * frasesDelDia.length)];
        mensaje = fraseSeleccionada.replace(/::dia_semana::/g, diaSemana);
    }

    // --------------------------------------
    // 8) Hash del día (solo para "amigos"), igual que antes
    // --------------------------------------
    let mensajeFinal = mensaje;
    if (target === 'amigos') {
        try {
            mensajeFinal = `${mensaje}\n\nHash del día: ${generarHashDia()}`;
        } catch (e) {
            mensajeFinal = mensaje;
        }
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(mensajeFinal);
};
