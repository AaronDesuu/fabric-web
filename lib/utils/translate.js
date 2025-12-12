/**
 * Auto-translate text using Google Translate API (free tier)
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code (e.g. 'id')
 * @param {string} targetLang - Target language code (e.g. 'en')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, sourceLang = 'id', targetLang = 'en') {
    if (!text || text.trim() === '') return '';

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
        );
        const data = await response.json();
        return data[0][0][0];
    } catch (err) {
        console.error('Translation error:', err);
        return '';
    }
}
