module.exports = {
  name: ['unbanchat'],
  cmd: ['unbanchat', 'unmute'],
  category: 'group',
  desc: 'kegunaan, untuk unmute grup/membunyikan grup chat',
  admin: true,
  async handler(m, { conn, text }) {
    await db.read()
    if(!text) return m.reply('Maaf Anda Belum Memasukkan Id Grup')
    if(!db.data.mute.includes(text)) return m.reply(`Grup Dengan Id ${text} Telah Di Hidupkan/Unmute Sebelumnya`)
    db.data.mute.splice(db.data.mute.indexOf(text), 1)
    await db.write()
    await m.reply(`Berhasil Menghidupkan/Unmute Grup Dengan Id: ${text}`)
  }
}