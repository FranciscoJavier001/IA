// function retirarDinero(monto) { /* Función que recibe el monto a retirar como parámetro */
//   const billetes = [500, 200, 100, 50, 20, 10]; /* Arreglo de billetes ordenado de mayor a menor (algoritmo greedy) */
//   const resultado = {}; /* Objeto vacío donde guardaremos billete:cantidad */

//   for (let billete of billetes) { /* Iteramos cada billete del arreglo, del más grande al más pequeño */
//     if (monto >= billete) { /* Si el monto restante es mayor o igual al billete actual */
//       const cantidad = Math.floor(monto / billete); /* Cuántos billetes de este tipo caben (división sin decimales) */
//       resultado[billete] = cantidad; /* Guardamos en el objeto: clave=billete, valor=cantidad */
//       monto = monto - cantidad * billete; /* Restamos del monto lo que ya cubrimos con estos billetes */
//     }
//   }

//   if (monto > 0) return null; /* Si sobra monto, no se puede entregar exacto */
//   return resultado; /* Regresamos el objeto con todos los billetes y sus cantidades */
// }

/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

const BILLETES = [500, 200, 100, 50, 20, 10];

function retirarDinero(monto) {
  /* Función que recibe el monto a retirar como parámetro */
  const resultado = {};
  /* Objeto vacío donde guardaremos billete:cantidad */

  for (let billete of BILLETES) {
    /* Iteramos cada billete del más grande al más pequeño */
    if (monto >= billete) {
      /* Si el monto restante es mayor o igual al billete actual */
      const cantidad = Math.floor(monto / billete);
      /* Cuántos billetes de este tipo caben (división sin decimales) */
      resultado[billete] = cantidad;
      /* Guardamos en el objeto: clave=billete, valor=cantidad */
      monto -= cantidad * billete;
      /* Restamos del monto lo que ya cubrimos con estos billetes */
    }
  }

  if (monto > 0) return null;
  /* Si sobra monto, no se puede entregar exacto */

  return resultado;
  /* Regresamos el objeto con todos los billetes y sus cantidades */
}


/* Es donde aterrizan los inputs en el FrontEnd y Logica BackEnd*/
function calcular() {
  const monto = parseInt(document.getElementById('monto').value);
  const resCard = document.getElementById('resultado');
  const errCard = document.getElementById('error-card');
  resCard.style.display = 'none';
  errCard.style.display = 'none';

  if (!monto || monto <= 0) {
    document.getElementById('error-msg').textContent = 'Ingresa un monto válido.';
    errCard.style.display = 'block';
    return;
  }

  const res = retirarDinero(monto);
  if (!res) {
    document.getElementById('error-msg').textContent = 'No se puede entregar el monto exacto.';
    errCard.style.display = 'block';
    return;
  }

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  let totalBilletes = 0;

  BILLETES.forEach(b => {
    const cant = res[b] || 0;
    totalBilletes += cant;
    const div = document.createElement('div');
    div.className = 'billete-item ' + (cant > 0 ? 'activo' : 'inactivo');
    div.innerHTML = `<div class="denom">$${b}</div><div class="cant">x${cant}</div>`;
    grid.appendChild(div);
  });

  document.getElementById('res-texto').textContent = `Entregado en`;
  document.getElementById('res-total').textContent = `${totalBilletes} billete(s)`;
  resCard.style.display = 'block';
}

calcular();