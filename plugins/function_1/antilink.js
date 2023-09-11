module.exports = {
  name: "antilink_function",
  function: true,
  async handler(m, { conn, chats, isAdmin, isBotAdmin }) {
    await db.read();
    if(!m.isGroup) return;
    if(!db.data.antilink.includes(m.from)) return;
    var regexlink = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
    var isGroupLink = regexlink.exec(chats);
      if(!isAdmin && isGroupLink) {
      if(isBotAdmin) {
        const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.from)}`
        if(chats.includes(linkThisGroup)) return !0
      }
      var META = await conn.groupMetadata(m.from).catch((error) => m.reply(util.format(error)))
      var t = `Anti Link Grup Terdeteksi! Maaf @${m.sender.split("@")[0]}, Kamu Dikeluarkan Dalam Grup ${META.subject != undefined ? META.subject : '-'}, Karena Telah Melanggar Peraturan Grup.`
      let tx = `[ *ANTI LINK GROUP DETECTED* ]\n\n`
      tx += `${tool.monospace(t)}`
      await m.reply(tx, { withTag: true })
      await conn.sendMessage(m.from, {
        delete: {
          ...m.key,
          participant: m.sender
        }
      })
      await conn.groupParticipantsUpdate(m.from, [m.sender], "remove");
    }
  },
};
