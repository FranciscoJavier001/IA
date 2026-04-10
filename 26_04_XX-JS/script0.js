function retirarDinero(monto) { /* Función que recibe el monto a retirar como parámetro */
  const billetes = [500, 200, 100, 50, 20, 10]; /* Arreglo de billetes ordenado de mayor a menor (algoritmo greedy) */
  const resultado = {}; /* Objeto vacío donde guardaremos billete:cantidad */

  for (let billete of billetes) { /* Iteramos cada billete del arreglo, del más grande al más pequeño */
    if (monto >= billete) { /* Si el monto restante es mayor o igual al billete actual */
      const cantidad = Math.floor(monto / billete); /* Cuántos billetes de este tipo caben (división sin decimales) */
      resultado[billete] = cantidad; /* Guardamos en el objeto: clave=billete, valor=cantidad */
      monto -= cantidad * billete; /* Restamos del monto lo que ya cubrimos con estos billetes */
    }
  }

  if (monto > 0) return null; /* Si sobra monto, no se puede entregar exacto */
  return resultado; /* Regresamos el objeto con todos los billetes y sus cantidades */
}