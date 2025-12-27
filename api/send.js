const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil data dari request body (dari fetch di frontend)
  const { to, msg } = req.body;

  // Ambil token dan chat ID dari environment variables Vercel
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  // Validasi
  if (!token || !chatId) {
    return res.status(500).json({ error: 'Token atau Chat ID tidak ditemukan di environment variables' });
  }

  if (!msg) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
  }

  const bot = new TelegramBot(token);

  // Format pesan yang akan dikirim ke Telegram
  const message = `💗 Manfes Anonim Baru!\n\n` +
                  `Untuk: ${to || 'Semua'}\n` +
                  `Pesan:\n${msg}\n\n` +
                  `Dikirim pada: ${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`;

  try {
    // Kirim pesan ke chat Telegram
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });

    // Respon sukses ke frontend
    res.status(200).json({ success: true, message: 'Manfes berhasil dikirim ke Telegram!' });
  } catch (error) {
    console.error('Error mengirim ke Telegram:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
