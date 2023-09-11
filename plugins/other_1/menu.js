const fs = require('fs')
const fetch = require('node-fetch')
const util = require('util')
const prettyms = require('pretty-ms')
const { showhit } = require('../../database/hit')

module.exports = {
  name: 'menu',
  cmd: ['menu'],
  ignored: true,
  async handler(m, { conn, prefix }) {
    await conn.sendReact(m.from, config.react.wait, m.key)
    try { 
      const cmd = []
      Object.values(attr.commands).filter((cm) => !cm.disabled && !cm.ignored).map((cm) => {
        if(Array.isArray(cm.name)) {
          for(let i=0; i<cm.name.length; i++) {
            cmd.push({
              name: `${cm.name[i]}${cm.param ? ` ${cm.param}` : ""}`,
              cmd: [cm.cmd.find(y => y == cm.name[i])],
              param: cm.param ? cm.param : false,
              tag: cm.category ? cm.category : "Uncategorized",
              desc: cm.desc ? cm.desc : '-'
            });
          }
        } else {
          cmd.push({
            name: `${cm.name}${cm.param ? ` ${cm.param}` : ""}`,
            cmd: cm.cmd,
            param: cm.param ? cm.param : false,
            tag: cm.category ? cm.category : "Uncategorized",
            desc: cm.desc ? cm.desc : '-'
          });
        }
      });
      const hit = Object.values(await showhit()).map((ht) => ht.total);
      const thit = await eval(hit.join(" + "));
      const map_tag = cmd.map((mek) => mek.tag);
      const sort_tag = await map_tag.sort();
      const tag_data = new Set(sort_tag);
      const tags = [...tag_data];
      let numtag = 1;
      let content = `Halo @${m.sender.split('@')[0]} Berikut Adalah Beberapa Command Pada ${config.botname} (Bot WhatsApp)\n\n`
      for (let tag of tags) {
        content += `\n*${tag.toUpperCase()}*\n`; 
        const filt_cmd = cmd.filter((mek) => mek.tag == tag);
        const map_cmd = await filt_cmd.map((mek) => mek.name);
        const sort = await map_cmd.sort(function (a, b) {
          return a.length - b.length;
        });
        for (let j = 0; j < sort.length; j++) {
          content += `${numtag++ }`+`. ${prefix}${sort[j]}\n`;
        }
      }
      await m.reply(content, { withTag: true })
      await conn.sendReact(m.from, config.react.success, m.key)
    } catch (error) {
      m.reply(String(error))
    }
  }
}