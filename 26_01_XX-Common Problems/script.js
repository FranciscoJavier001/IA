function countTruthy(arr) {
  // TODO 1: valida que arr sea un arreglo; si no lo es, regresa 0
  if (Array.isArray(arr)) {
    return arr;
    } else {
        return 0;
    } 

  // TODO 2: recorre el arreglo y cuenta los valores truthy
  const valoresVerdaderosForOf = []

  for  (const truthy of arr) {

  }
  // TODO 3: regresa el conteo
}


console.log(countTruthy([0, 1, "", "a", null, [], {}, false, true])); // 5
console.log(countTruthy([]));                                         // 0
console.log(countTruthy([false, 0, "", null, undefined, NaN]));        // 0
console.log(countTruthy("no soy array"));                               // 0


/*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  */

function countTruthy(arr) { /* Definimos una funcion que reciba un parametro */
  // 1. Validación: si NO es arreglo, termina la función
  if (!Array.isArray(arr)) { /* Validamos si no es arreglo, solo 1 o 0, si es diferente la variable, del metodo, del arreglo recibido */
    return 0; /* No me retornes nada, la funcion continua */
  }

  // 2. Inicializamos el contador
  let count = 0; /* Solamente inicializa una variable que pueda cambiar */

  // 3. Recorremos el arreglo
  for (const value of arr) { /* Cada uno, de la constante valor del array */
    // 4. Si el valor es truthy, incrementamos
    if (value) { /* Si el valor existe sumalo */
      count++;
    }
  }

  // 5. Devolvemos el resultado final
  return count; /* Devlvemos el contador, solo mas 1 por cada true */
}

console.log(countTruthy([0, 1, "", "a", null, [], {}, false, true])); // 5
console.log(countTruthy([]));                                         // 0
console.log(countTruthy([false, 0, "", null, undefined, NaN]));        // 0
console.log(countTruthy("no soy array"));   

/*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  *//*  */

const contarVerdaderos = (array) => { /* Funcion que va a contar los verdaderos que se reciben */
  if (!Array.isArray(array)) {
    return 0
  }

  let contador = 0

  for (const valor of array) {
    if (valor) 
    {
      contador++
    }
  }

  return contador;
}

console.log(contarVerdaderos([0, 1, "", "a", null, [], {}, false, true])); // 5