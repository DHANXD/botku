module.exports = {
    name: 'banchat',
    cmd: ['banchat', 'mute'],
    category: 'group',
    desc: 'mute chat in group',
    admin: true,
    async handler(m, {conn, text}){
        await db.read()
        if(!text) return m.reply("idnya mana?")
        if(db.data.mute.includes(text)) return m.reply(`Bot telah dimute digroup sebelumnya! dengan id ${text}`)
        db.data.mute.push(text)
        await db.write()
        m.reply(`Bot dimute digroup tersebut! dengan id ${text}`)
    }
}