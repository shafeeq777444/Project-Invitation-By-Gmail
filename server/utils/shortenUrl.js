// Bit.ly
// Bit.ly requires a valid, publicly accessible URL, meaning http://localhost:5173/... will not work.
// deploy any platform like vercel
const axios = require("axios");

async function shortenUrl(longUrl) {
    try {
        const response = await axios.post(
            "https://api-ssl.bitly.com/v4/shorten",
            { long_url: longUrl },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.BITLY_ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.link; // Return the shortened link
    } catch (error) {
        console.error("Error shortening URL:", error.response?.data?.message || error.message);
        return longUrl; // Fallback to the original URL if an error occurs
    }
}

module.exports = { shortenUrl }; // Export function properly in CommonJS
