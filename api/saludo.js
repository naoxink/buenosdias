module.exports = (req, res) => {
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
        "Καλημέρα, οικογένειά μου! ¡Buenos días familia!"
    ];

    const frasesLunes = [
        "¡Arranca la semana con toda la energía! Feliz lunes familia 💪",
        "Nuevo lunes, nueva semana, nuevas oportunidades. ¡A por todas! 🚀",
        "Los lunes son mejores en familia. ¡Iniciemos con fuerza! ☕"
    ];

    const frasesJueves = [
        "¡Jueves! Ya casi llegamos al fin de semana 🎉",
        "¡Jueves de energía! Un empujón más hacia el viernes 💪",
        "¡Feliz jueves! La recta final de la semana 🌟"
    ];

    const frasesViernes = [
        "¡Por fin viernes! A celebrar el fin de semana 🎊",
        "¡Feliz viernes! Momento de relajarse y disfrutar ✨",
        "¡Vamos! ¡El último tirón que ya es viernes! 💪"
    ];

    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const diaActual = new Date().getDay();
    const diaSemana = diasSemana[diaActual];

    let frasesDelDia = frases;
    if (diaActual === 1) { // Lunes
        frasesDelDia = [...frases, ...frasesLunes];
    } else if (diaActual === 4) { // Jueves
        frasesDelDia = [...frases, ...frasesJueves];
    } else if (diaActual === 5) { // Viernes
        frasesDelDia = [...frases, ...frasesViernes];
    }

    const fraseSeleccionada = frasesDelDia[Math.floor(Math.random() * frasesDelDia.length)];
    const mensaje = fraseSeleccionada.replace("::dia_semana::", diaSemana);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(mensaje);
};