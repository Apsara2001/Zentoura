const { translateText: serviceTranslateText } = require('../utils/translationService');

// @desc    Translate text
// @route   POST /api/translate
// @access  Public
const translateText = async (req, res, next) => {
    try {
        const { text, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ success: false, message: 'Text and targetLang are required' });
        }

        const translatedText = await serviceTranslateText(text, targetLang);

        res.json({
            success: true,
            translatedText
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    translateText
};
