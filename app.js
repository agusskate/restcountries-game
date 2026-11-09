
const bandera = document.querySelector("#bandera");
const opciones = document.querySelector("#opciones");
const mensaje = document.querySelector("#mensaje");
const puntuacion = document.querySelector("#puntuacion");
const siguiente = document.querySelector("#siguiente");

let paisCorrecto = "";
let puntuacionActual = 0;
let paises = [];
let respondido = false;
let fallosActuales = 0;

// Configuración del desenfoque
const DESENFOQUE_INICIAL = 20;
const REDUCCION_POR_FALLO = 6;

// Obtener los países desde nuestro servidor Express
async function obtenerPaises() {
    mensaje.textContent = "Cargando países...";
    siguiente.disabled = true;

    try {
        const response = await fetch("/api/paises");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const resultado = await response.json();

        console.log("Respuesta completa de la API:", resultado);

        // REST Countries v5: los países están en data.objects
        const listaPaises = resultado.data?.objects ?? [];

        paises = listaPaises.filter(pais =>
            obtenerNombre(pais) !== "Nombre desconocido" &&
            pais.codes?.alpha_2
        );

        if (paises.length < 4) {
            throw new Error(
                "La API debe devolver al menos cuatro países con nombre y bandera."
            );
        }

        mostrarPregunta();
    } catch (error) {
        console.error("Error al obtener países:", error);
        mensaje.textContent =
            "No se pudieron cargar los países. Revisa la consola y el servidor.";
    }
}

// Obtener el nombre en español cuando esté disponible
function obtenerNombre(pais) {
    return (
        pais.names?.translations?.spa?.common ||
        pais.names?.common ||
        "Nombre desconocido"
    );
}

// Elegir un elemento aleatorio
function aleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// Mezclar una lista aleatoriamente
function mezclar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

// Mostrar una nueva pregunta
function mostrarPregunta() {
    if (paises.length < 4) return;

    respondido = false;
    fallosActuales = 0;

    siguiente.disabled = true;
    opciones.replaceChildren();

    const pais = aleatorio(paises);
    paisCorrecto = obtenerNombre(pais);

    // Ocultar la imagen mientras se prepara la nueva bandera
    bandera.style.opacity = "0";
    bandera.style.transition = "none";
    bandera.style.filter = `blur(${DESENFOQUE_INICIAL}px)`;

    bandera.onload = function () {
        // Mostrar la bandera cuando ya está cargada y borrosa
        bandera.style.opacity = "1";

        // Volver a activar la transición del desenfoque
        bandera.style.transition = "filter 0.5s ease";
    };

    const codigo = pais.codes.alpha_2.toLowerCase();

    bandera.src = `https://flagcdn.com/w320/${codigo}.png`;
    bandera.alt = "Adivina el país de esta bandera";

    mensaje.textContent = "¿De qué país es esta bandera?";

    // Crear tres respuestas incorrectas y una correcta
    const incorrectos = mezclar(
        paises.filter(p => p !== pais)
    ).slice(0, 3);

    const respuestas = mezclar([pais, ...incorrectos]);

    respuestas.forEach(p => {
        const nombre = obtenerNombre(p);
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "option";
        boton.textContent = nombre;

        boton.addEventListener("click", () => {
            comprobarRespuesta(nombre, boton);
        });

        opciones.appendChild(boton);
    });
}

// Comprobar la respuesta elegida
function comprobarRespuesta(respuesta, botonElegido) {
    if (respondido || botonElegido.disabled) return;

    // Si la respuesta es correcta
    if (respuesta === paisCorrecto) {
        respondido = true;

        mensaje.textContent = "¡Correcto!";
        puntuacionActual++;
        puntuacion.textContent = puntuacionActual;

        // Revelar completamente la bandera
        bandera.style.filter = "blur(0px)";

        // Marcar la respuesta correcta y desactivar las opciones
        opciones.querySelectorAll("button").forEach(boton => {
            boton.disabled = true;

            if (boton.textContent === paisCorrecto) {
                boton.classList.add("correcta");
            }
        });

        siguiente.disabled = false;
        return;
    }

    // Si la respuesta es incorrecta
    fallosActuales++;

    botonElegido.disabled = true;
    botonElegido.classList.add("incorrecta");

    // Reducir el desenfoque con cada fallo
    const desenfoque = Math.max(
        0,
        DESENFOQUE_INICIAL - fallosActuales * REDUCCION_POR_FALLO
    );

    bandera.style.filter = `blur(${desenfoque}px)`;

    if (desenfoque > 0) {
        mensaje.textContent =
            `¡No es ese país! La bandera se ha aclarado. Fallos: ${fallosActuales}`;
    } else {
        mensaje.textContent =
            "La bandera ya está clara. ¡Prueba con otra respuesta!";
    }
}

// Pasar a la siguiente pregunta
siguiente.addEventListener("click", () => {
    if (respondido) {
        mostrarPregunta();
    }
});

// Iniciar el juego
obtenerPaises();
