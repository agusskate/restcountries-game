export default async function handler(req, res) {
    console.log("1. Vercel ha ejecutado la función");

    try {
        const apiKey = process.env.API_KEY;

        console.log("2. API_KEY existe:", Boolean(apiKey));

        if (!apiKey) {
            return res.status(500).json({
                paso: 2,
                error: "No se encuentra API_KEY"
            });
        }

        const url =
            "https://api.restcountries.com/countries/v5" +
            "?limit=100" +
            "&response_fields=names.common,names.translations,codes.alpha_2";

        console.log("3. Consultando API externa");

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        const texto = await response.text();

        console.log("4. Respuesta externa:", response.status);
        console.log("5. Respuesta recibida");

        if (!response.ok) {
            return res.status(502).json({
                paso: 4,
                error: "La API externa ha rechazado la petición",
                estado: response.status,
                detalle: texto.slice(0, 500)
            });
        }

        return res.status(200).send(texto);

    } catch (error) {
        console.error("ERROR REAL:", error);

        return res.status(500).json({
            paso: 6,
            error: error.message
        });
    }
}
