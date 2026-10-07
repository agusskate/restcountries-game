const bandera = document.querySelector("#bandera");
const opciones = document.querySelector("#opciones");
const resultado = document.querySelector("#resultado");
const puntuacion = document.querySelector("#puntuacion");
const siguiente = document.querySelector("#siguiente");

let paisCorrecto;
let puntuacionActual = 0;

async function obtenerPaises() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const datos = await response.json();
    return datos;
}

function elegirPaisAleatorio(paises) {
    const numero = Math.flooor(Math.random() * paises.length);
    return paises[numero];
}

const pais = elegirPaisAleatorio(paises);


function mostrarBandera(pais) {
    bandera.src = pais.flags.png;
    bandera.alt = `Bandera de ${pais.name.common}`;

    paisCorrecto = pais.name.common;
}