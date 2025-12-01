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
    // 3) TUS ARRAYS ORIGINALES + NUEVOS
    // --------------------------------------
    const frases = [
        "¡A los buenos ::dia_semana::!",
        "¡Buenos días, familia! Hoy es ::dia_semana:: — que el día venga con energía y sonrisas 💪☕.",
        "¡Feliz ::dia_semana::, familia! Que el café esté caliente y los abrazos sean muchos ☕❤️.",
        "¡Hola familia! Que este ::dia_semana:: nos llene de paz, risas y buenos recuerdos 💪🌞.",
        "¡Buen día, equipo familiar! Hoy, ::dia_semana::, a dar lo mejor con fuerza y cariño 💪☕.",
        "Despierten, familia: es ::dia_semana::. Que la energía no falte y el café sí ☕💪.",
        "¡Que tengan un hermoso ::dia_semana::! Abrazos virtuales y mucho ánimo para todos ❤️☕.",
        "Familia, feliz ::dia_semana:: — que las pequeñas cosas alegren el día 💪😊.",
        "¡Buenos días! Hoy es ::dia_semana::: recarguen pilas, tomen su cafecito y sonrían ☕💪.",
        "Que este ::dia_semana:: traiga calma y alegría; si alguien necesita una siesta, que llegue la cafeína 💤☕.",
        "¡Hola a todos! Que el ::dia_semana:: nos trate bien y nos deje motivos para celebrar en familia 💪❤️.",
        "¡Bendiciones en este ::dia_semana::! Que la semana vaya genial y esté llena de energía positiva ☕💪.",
        "Mañana es un nuevo lienzo en blanco, ¡pinta tu mejor obra hoy ::dia_semana::! 🎨✨",
        "La vida es un café corto, pero disfrútalo mucho — ¡Feliz ::dia_semana::! ☕😊",
        "¡Buenos días campeonas y campeones! Que hoy seamos versión mejorada de ayer 💪🌟",
        "La gratitud es el mejor desayuno — ¡Gracias por este nuevo ::dia_semana::! 🙏❤️",
        "¡Hoy es nuestro día! Hagamos que ::dia_semana:: sea memorable 🌈✨",
        "¡Buenos días! Cada ::dia_semana:: es una oportunidad para brillar 🌟✨",
        "Que la magia del ::dia_semana:: nos acompañe todo el día, familia ✨💫",
        "¡Despierta con actitud! Hoy es ::dia_semana:: y hay mucho por conquistar 🚀💪",
        "Καλημέρα, οικογένειά μου! ¡Buenos días familia!"
    ];

    const frasesLunes = [
        "¡Arranca la semana con toda la energía! Feliz lunes familia 💪",
        "Nuevo lunes, nueva semana, nuevas oportunidades. ¡A por todas! 🚀",
        "Los lunes son mejores en familia. ¡Iniciemos con fuerza! ☕",
        "Lunes otra vez... pero lo bueno es que empezamos juntos. ¡Vamos familia! 💪☕",
        "Respira profundo: es lunes, sí, pero también es un inicio fresco. ¡A darle suave pero firme! 🌿🚀",
        "Familia, que este lunes no pese: que fluya, que sume y que no nos quite la sonrisa 😊☕."
    ];

    const frasesJueves = [
        "¡Jueves! Ya casi llegamos al fin de semana 🎉",
        "¡Jueves de energía! Un empujón más hacia el viernes 💪",
        "¡Feliz jueves! La recta final de la semana 🌟",
        "¡Jueves con sabor a casi viernes! Que el ánimo aguante un poco más 😄✨",
        "Jueves: ese día raro en el que ya vemos la meta pero aún toca remar un poquito 🚣‍♂️🌟",
        "¡Ánimo familia, que ya se huele el fin de semana! Feliz jueves 💛💪"
    ];

    const frasesViernes = [
        "¡Por fin viernes! A celebrar el fin de semana 🎊",
        "¡Feliz viernes! Momento de relajarse y disfrutar ✨",
        "¡Vamos! ¡El último tirón que ya es viernes! 💪",
        "Viernes… ese momento en que el alma respira más profundo. ¡Feliz día familia! 😌🎊",
        "¡Ya es viernes! Que el cansancio se vuelva risa y el café se vuelva celebración ☕🎉",
        "Familia, hemos llegado: ¡viernes! Gracias por aguantar otra semana juntos ❤️🌟"
    ];

    const frasesHumor = [
        "¡Arriba familia! Hoy es ::dia_semana::… tranquilos, aún no es lunes (creo).",
        "Hoy es ::dia_semana::. Si el café no ayuda, siempre queda fingir productividad.",
        "Feliz ::dia_semana::, familia. Recuerden: nadie sabe realmente lo que está haciendo. Estamos todos improvisando.",
        "¡Buen ::dia_semana::! Si alguien logra despertarse sin café, merece un premio.",
        "Familia, hoy es ::dia_semana::. El intento ya cuenta como logro. Suficiente por hoy.",
        "¡Buenos días! El mundo no se va a conquistar solo, pero puede esperar cinco minutitos más.",
        "Que este ::dia_semana:: sea más amable que nuestro despertador.",
        "¡Feliz ::dia_semana::! Si todo falla, culpen al wifi.",
        "Hoy es ::dia_semana::… que la paciencia vaya por delante y el drama se quede dormido.",
        "Familia, si ven mi motivación díganle que vuelva. Hoy es ::dia_semana:: y la necesito."
    ];

    const frasesEspirituales = [
        "Que este ::dia_semana:: traiga luz al corazón y claridad a la mente.",
        "Familia, que hoy la vida nos hable suave y podamos escucharla.",
        "En este ::dia_semana:: que cada paso lleve intención y cada instante gratitud.",
        "Que la paz encuentre su lugar en nosotros hoy, en este ::dia_semana::.",
        "Familia, que este ::dia_semana:: nos regale serenidad para aceptar, valor para cambiar y amor para equilibrarlo todo.",
        "Hoy, ::dia_semana::, recordemos que lo esencial siempre es invisible a los ojos.",
        "Que este ::dia_semana:: sea oportunidad para sanar, crecer y reconectar con lo importante.",
        "En este ::dia_semana::, que encuentres señales bonitas en los pequeños detalles.",
        "Familia, que la luz que damos vuelva multiplicada este ::dia_semana::.",
        "Hoy es ::dia_semana::. Que la gratitud sea nuestra guía y la calma nuestro refugio."
    ];

    const frasesHumanas = [
        "Que este ::dia_semana:: nos encuentre con calma y ganas de hacer las cosas despacio pero bien.",
        "Hoy es ::dia_semana::: ideal para darnos un respiro entre tanto ruido.",
        "Feliz ::dia_semana::. Que nada nos robe la ternura.",
        "Familia, que hoy encontremos un motivo para sonreír aunque sea chiquito.",
        "Hoy es ::dia_semana::. Que la vida nos trate con suavidad y nosotros también.",
        "Que este ::dia_semana:: sea amable… y si no lo es, que tengamos paciencia para navegarlo.",
        "Familia, que este ::dia_semana:: nos permita ver que estamos haciendo lo mejor que podemos.",
        "Hoy, ::dia_semana::, recordemos que avanzar lento también es avanzar.",
        "Feliz ::dia_semana::. Que el día sea ligero y los momentos sinceros.",
        "Que este ::dia_semana:: nos devuelva un poquito más de nosotros mismos."
    ];

    const frasesClima = [
        "Hoy está ::clima:: y con ::temperatura::°C — perfecto para un buen café y un mejor ánimo.",
        "¡Buen ::dia_semana::! Con este clima ::clima::, el día pide calma y buena vibra.",
        "Familia, hoy el clima está ::clima::. Aprovechen para hacer el día un poco más bonito.",
        "Con ::temperatura::°C ahí afuera, recuerden cuidarse y disfrutar el ::dia_semana::.",
        "El clima de hoy: ::clima::. Ideal para respirar hondo y seguir con lo nuestro.",
        "¡Feliz ::dia_semana::! Parece que el día viene ::clima:: — ustedes pónganle el sol.",
        "Hoy amaneció ::clima::, pero dentro de casa siempre podemos crear buen ambiente.",
        "Con este clima ::clima:: solo se recomienda una cosa: cariño, calma y café."
    ];

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

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(mensaje);
};