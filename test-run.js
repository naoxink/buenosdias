// Pequeño script para probar la función serverless localmente sin Vercel
const fn = require('./api/saludo');

const req = {};
const res = {
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.statusCode = code; return this; },
  send(body) { console.log('RESPONSE', this.statusCode || 200, body); }
};

fn(req, res);

// Ejecutar: node test-run.js
