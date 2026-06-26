const axios = require('axios');

const voiceService = {
  textToSpeech: async (text) => {
    try {
      const response = await axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioBase64 = Buffer.from(response.data).toString('base64');
      return audioBase64;
    } catch (error) {
      console.error('ElevenLabs Error:', error.message);
      throw new Error('Failed to generate speech');
    }
  },
};

module.exports = voiceService;