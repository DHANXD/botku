module.exports = {
  name: ['pushkontak'],
  param: '<text/reply media>',
  cmd: ['pushkontak'],
  category: 'owner',
  owner: true,
  group: true,
  async handler(m, {conn, text, isMedia}){
    if(!text && !m.quoted && !isMedia) return m.reply('Format salah! (text kosong)\nExample: #pushkontak text')
     let id = m.groupMetadata.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
      await m.reply(`sedang mengirim broadcast ke *${id.length}* anggota grup`)
      for(let i of id){
        if(m.quoted){
          if(m.quoted.message[m.quoted.mtype] != 'conversation'){
            m.quoted.message[m.quoted.mtype].caption = text
            conn.copyNForward(i, m.quoted)
          }
        }
        else if(text && !isMedia){
          await conn.sendMessage(i, {text: text})
        }
        else if(isMedia){
          m.message[m.type].caption = text
          await conn.copyNForward(i, m)
        }
        await tool.sleep(7000)
      }
      await m.reply(`berhasil mengirim broadcast ke *${id.length}* anggota grup`)
  }
}