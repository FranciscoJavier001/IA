// ======================================================
// FUNCIÓN PRINCIPAL:
// Encuentra el número faltante en un arreglo del 1 al n
// Ejemplo: [1,2,4,5] -> falta el 3
// ======================================================
function numerosPerdido(arr) { 
  
  // Si hay 4 números, realmente deberían ser 5 (uno falta)
  const n = arr.length + 1; 
  
  // Fórmula matemática para sumar del 1 al n
  // Ejemplo: 1+2+3+4+5 = 15
  const sumaEsperada = (n * (n + 1)) / 2; 
  
  // Aquí guardaremos la suma real del arreglo
  let sumaReal = 0;

  // Recorremos el arreglo y sumamos cada número
  for (let num of arr) {
    sumaReal += num;
  }

  // Restamos lo esperado menos lo real
  // Lo que sobra = número perdido
  return sumaEsperada - sumaReal;
}



// ======================================================
// CARGAR EJEMPLO AUTOMÁTICO
// Mete texto en el input y resuelve
// ======================================================
function cargarEjemplo(texto) {

  // Coloca el ejemplo dentro del input
  document.getElementById('inputArray').value = texto;

  // Ejecuta resolver automáticamente
  resolver();
}



// ======================================================
// MOSTRAR MENSAJE DE ERROR
// ======================================================
function mostrarError(msg) {

  // Busca el elemento HTML donde se muestran errores
  const el = document.getElementById('errorMsg');

  // Coloca el mensaje recibido
  el.textContent = msg;

  // Hace visible el error
  el.classList.add('visible');

  // Después de 3 segundos lo oculta
  setTimeout(() => el.classList.remove('visible'), 3000);
}



// ======================================================
// FUNCIÓN QUE LEE INPUT Y RESUELVE TODO
// ======================================================
function resolver() {

  // Toma lo escrito en el input
  const input = document.getElementById('inputArray').value.trim();

  // Referencia al contenedor de errores
  const errorMsg = document.getElementById('errorMsg');

  // Oculta errores anteriores
  errorMsg.classList.remove('visible');



  // ----------------------------------
  // VALIDACIÓN 1: vacío
  // ----------------------------------
  if (!input) {
    mostrarError('⚠️ Ingresa una lista de números primero.');
    return;
  }



  // ----------------------------------
  // Convertir texto a arreglo
  // "1,2,4,5" -> ["1","2","4","5"]
  // ----------------------------------
  const partes = input.split(',').map(s => s.trim());

  // Convertimos a números
  const arr = partes.map(Number);



  // ----------------------------------
  // VALIDACIÓN 2: si algo no es número
  // ----------------------------------
  if (arr.some(isNaN)) {
    mostrarError('⚠️ Solo se permiten números separados por coma.');
    return;
  }



  // ----------------------------------
  // VALIDACIÓN 3: mínimo 2 números
  // ----------------------------------
  if (arr.length < 2) {
    mostrarError('⚠️ Necesitas al menos 2 números en la lista.');
    return;
  }



  // ----------------------------------
  // Resolver problema
  // ----------------------------------

  // Tamaño real incluyendo faltante
  const n = arr.length + 1;

  // Suma ideal del 1 al n
  const sumaEsperada = (n * (n + 1)) / 2;

  // Suma real ingresada
  let sumaReal = 0;

  for (let num of arr) sumaReal += num;

  // Número faltante
  const perdido = sumaEsperada - sumaReal;



  // ----------------------------------
  // Animaciones visuales paso a paso
  // ----------------------------------

  // Paso 1 mostrar n
  animarPaso('valN', n, 'stepN');

  // Paso 2 mostrar suma esperada
  setTimeout(() =>
    animarPaso('valEsperada', sumaEsperada, 'stepEsperada')
  , 300);

  // Paso 3 mostrar suma real
  setTimeout(() =>
    animarPaso('valReal', sumaReal, 'stepReal')
  , 600);



  // Paso final mostrar respuesta
  setTimeout(() => {

    // Número perdido grande en pantalla
    const answerEl = document.getElementById('answerNum');
    answerEl.textContent = perdido;

    // Hace visible respuesta
    document.getElementById('answer').classList.add('visible');



    // Mostrar fórmula final
    const formula = document.getElementById('formulaText');
    formula.textContent = `${sumaEsperada} − ${sumaReal} = ${perdido}`;

    document.getElementById('formulaBox').classList.add('visible');

  }, 900);
}



// ======================================================
// FUNCIÓN PARA ANIMAR CADA PASO
// ======================================================
function animarPaso(id, valor, stepId) {

  // Elemento donde se muestra valor
  const el = document.getElementById(id);

  // Caja visual del paso
  const step = document.getElementById(stepId);

  // Coloca número
  el.textContent = valor;

  // Activa animación CSS
  step.classList.add('active');
}



// ======================================================
// PERMITIR ENTER PARA RESOLVER
// ======================================================
document.addEventListener('DOMContentLoaded', () => {

  // Cuando la página cargue:
  document.getElementById('inputArray')
    .addEventListener('keydown', (e) => {

      // Si presiona Enter
      if (e.key === 'Enter') resolver();

  });
});