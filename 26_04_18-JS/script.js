function numerosPerdido(arr) {
  const n = arr.length + 1;
  const sumaEsperada = (n * (n + 1)) / 2;
  let sumaReal = 0;
  for (let num of arr) {
    sumaReal += num;
  }
  return sumaEsperada - sumaReal;
}

function cargarEjemplo(texto) {
  document.getElementById('inputArray').value = texto;
  resolver();
}

function mostrarError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}

function resolver() {
  const input = document.getElementById('inputArray').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.classList.remove('visible');

  if (!input) {
    mostrarError('⚠️ Ingresa una lista de números primero.');
    return;
  }

  const partes = input.split(',').map(s => s.trim());
  const arr = partes.map(Number);

  if (arr.some(isNaN)) {
    mostrarError('⚠️ Solo se permiten números separados por coma.');
    return;
  }

  if (arr.length < 2) {
    mostrarError('⚠️ Necesitas al menos 2 números en la lista.');
    return;
  }

  const n = arr.length + 1;
  const sumaEsperada = (n * (n + 1)) / 2;
  let sumaReal = 0;
  for (let num of arr) sumaReal += num;
  const perdido = sumaEsperada - sumaReal;

  // Animar resultados
  animarPaso('valN', n, 'stepN');
  setTimeout(() => animarPaso('valEsperada', sumaEsperada, 'stepEsperada'), 300);
  setTimeout(() => animarPaso('valReal', sumaReal, 'stepReal'), 600);
  setTimeout(() => {
    const answerEl = document.getElementById('answerNum');
    answerEl.textContent = perdido;
    document.getElementById('answer').classList.add('visible');

    const formula = document.getElementById('formulaText');
    formula.textContent = `${sumaEsperada} − ${sumaReal} = ${perdido}`;
    document.getElementById('formulaBox').classList.add('visible');
  }, 900);
}

function animarPaso(id, valor, stepId) {
  const el = document.getElementById(id);
  const step = document.getElementById(stepId);
  el.textContent = valor;
  step.classList.add('active');
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputArray').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') resolver();
  });
});
