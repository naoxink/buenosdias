module.exports = (req, res) => {
    const frases = [
        "¡Buenos días, familia! Hoy es ::dia_semana:: — que el día venga con energía y sonrisas 💪☕.",
        "¡Feliz ::dia_semana::, familia! Que el café esté caliente y los abrazos sean muchos ☕❤️.",
        "¡Hola familia! Que este ::dia_semana:: nos llene de paz, risas y buenos recuerdos 💪🌞.",
        "¡Buen día, equipo familiar! Hoy, ::dia_semana::, a dar lo mejor con fuerza y cariño 💪☕.",
        "Despierten, familia: es ::dia_semana::. Que la energía no falte y el café sí ☕💪.",
        "¡Que tengan un hermoso ::dia_semana::! Abrazos virtuales y mucho ánimo para todos ❤️☕.",
        "Familia, feliz ::dia_semana:: — que las pequeñas cosas alegren el día 💪😊.",
        "¡Buenos días! Hoy es ::dia_semana::: recarguen pilas, tomen su cafecito y sonrían ☕💪.",
        "Que este ::dia_semana:: traiga calma y alegría; si alguien necesita una siesta, que llegue la cafeína 💤☕.",
        "¡Hola a todos! Que el ::dia_semana:: nos trate bien y nos deje motivos para celebrar en familia 💪❤️."
    ];

    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const diaActual = new Date().getDay();
    const diaSemana = diasSemana[diaActual];

    const fraseSeleccionada = frases[Math.floor(Math.random() * frases.length)];
    const mensaje = fraseSeleccionada.replace("::dia_semana::", diaSemana);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(mensaje);
};