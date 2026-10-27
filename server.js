
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.get("/api/paises", async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "No se encontró API_KEY en el archivo .env"
            });
        }

        const url =
            "https://api.restcountries.com/countries/v5" +
            "?limit=100" +
            "&response_fields=names.common,names.translations,flag.url_png";

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        const texto = await response.text();

        console.log("Estado devuelto por REST Countries:", response.status);

        if (!response.ok) {
            console.error("Respuesta de la API:", texto);

            return res.status(response.status).json({
                error: "REST Countries rechazó la petición",
                detalle: texto
            });
        }

        res.type("application/json").send(texto);
    } catch (error) {
        console.error("Error al consultar la API:", error);

        res.status(500).json({
            error: "No se pudo consultar la API"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
});
