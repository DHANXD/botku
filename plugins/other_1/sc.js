module.exports = {
  name: 'sc',
  cmd: ['sc', 'source', 'sourcecode'],
  category: 'other',
  async handler(m, { conn }){
    txt = `*SOURCE*\n`
    txt += `Sc : https://adsafelink.com/zcIi\n`
    txt += `Jika Ingin Full Fitur Silahkan Beli Script Premiumnya, Di Owner Bot Atau Klik Link: https://wa.me/6283193905842\n`
    await m.reply(txt)
  }
}