module.exports = {
  name: 'test',
  cmd: ['test'],
  category: 'other',
  async handler(m, { conn }){
    txt = `Halo @${m.sender.split("@")[0]}\n`
    txt += `Bot Saat Ini Berfungsi 100%`
    m.reply(txt, { withTag: true })
  }
}