module.exports = async function handler(req, res) {
    try {
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "No se encontró API_KEY en Vercel"
            });
        }

        const url =
            "https://api.restcountries.com/countries/v5" +
            "?limit=100" +
            "&response_fields=names.common,names.translations,codes.alpha_2";

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        const texto = await response.text();

        console.log("Estado de REST Countries:", response.status);

        if (!response.ok) {
            console.error("Error de REST Countries:", texto);

            return res.status(response.status).json({
                error: "REST Countries rechazó la petición",
                detalle: texto
            });
        }

        return res.status(200).send(texto);

    } catch (error) {
        console.error("Error al consultar la API:", error);

        return res.status(500).json({
            error: "No se pudo consultar la API"
        });
    }
};
