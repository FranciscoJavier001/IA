// ================================
// EJERCICIO: CONTADOR DE HÁBITOS
// ================================

// Este arreglo simula los registros de un hábito.
// Cada elemento representa el estado de un día.
const registros = [
  "verde",
  "verde",
  "amarillo",
  "gris",
  "verde",
  "rojo",
  "verde",
  "verde"
];

// Variables para guardar resultados
let completados = 0;   // Cuenta días cumplidos
let fallados = 0;      // Cuenta días fallados
let rachaActual = 0;   // Cuenta la racha actual
let mejorRacha = 0;    // Guarda la mejor racha encontrada

// Recorremos cada registro del arreglo
for (let i = 0; i < registros.length; i++) {
  const estado = registros[i];

  // ================================
  // CONTAR DÍAS COMPLETADOS
  // ================================
  // Consideramos "verde" y "amarillo" como cumplimiento
  if (estado === "verde" || estado === "amarillo") {
    completados++;
    rachaActual++; // Si cumplió, la racha sigue creciendo

    // Si la racha actual supera la mejor racha, la guardamos
    if (rachaActual > mejorRacha) {
      mejorRacha = rachaActual;
    }
  }

  // ================================
  // CONTAR DÍAS FALLADOS
  // ================================
  else if (estado === "rojo") {
    fallados++;
    rachaActual = 0; // El rojo rompe la racha
  }

  // ================================
  // DÍAS NEUTRALES
  // ================================
  // El gris no suma ni rompe la racha
  else if (estado === "gris") {
    // No hacemos nada
  }
}

// ================================
// MOSTRAR RESULTADOS
// ================================
console.log("Resultados del hábito:");
console.log("Completados:", completados);
console.log("Fallados:", fallados);
console.log("Mejor racha:", mejorRacha);
console.log("Racha actual:", rachaActual);