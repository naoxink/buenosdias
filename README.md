# Proyecto Node.js en Vercel

Este proyecto es una función serverless desplegada en Vercel que devuelve un saludo de buenos días. La frase de saludo se selecciona de un array y puede incluir el día de la semana actual.

## Estructura del Proyecto

```
mi-proyecto-node-vercel
├── api
│   └── saludo.js        # Función serverless que devuelve un saludo
├── package.json         # Configuración de npm y dependencias
├── vercel.json          # Configuración para el despliegue en Vercel
├── .gitignore           # Archivos y directorios a ignorar por Git
└── README.md            # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   cd mi-proyecto-node-vercel
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

## Despliegue en Vercel

1. Asegúrate de tener una cuenta en [Vercel](https://vercel.com).
2. Inicia sesión en Vercel:
   ```
   vercel login
   ```

3. Despliega el proyecto:
   ```
   vercel
   ```

## Configuración

Puedes modificar el array de frases en `api/saludo.js` para personalizar los saludos. Asegúrate de que la frase contenga el marcador `::dia_semana::`, que será reemplazado por el día actual de la semana.

## Uso

Una vez desplegada, la función estará disponible en la URL proporcionada por Vercel. Puedes hacer una solicitud GET a esa URL para recibir el saludo del día.