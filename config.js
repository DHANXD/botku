"use strict";
require('events').EventEmitter.defaultMaxListeners = 50;

let mess = {
  wait: "Tunggu sebentar, permintaan anda sedang diproses...",
  owner: "Perintah ini hanya untuk owner!",
  admin: "Perintah ini hanya untuk admin group!",
  botadmin: "Bot harus menjadi admin group untuk melakukan perintah ini!",
  group: "Perintah ini hanya dapat dilakukan didalam grup!",
  private: "Perintah ini hanya dapat dilakukan didalam Private Chat",
  error: "Command error, silahkan coba beberapa saat lagi...",
  errorlink: "Mohon masukkan link yang benar",
  limit: "Limit anda sudah habis, silahkan gunakan fitur ini esok hari"
}, { Low, JSONFile } = require("./database/lowdb"),
  Function = new (require('./lib/function.js')),  
  { makeInMemoryStore } = require("@adiwajshing/baileys"),
  fs = require("fs"), 
  iky = require('ikyy'), 
  pathh = require("path"),
  pino = require("pino"),
  stable = require('json-stable-stringify'),
  syntaxerror = require("syntax-error"),
  ofNumber = 1,
  pluginFilter = (filename) => /\.js$/.test(filename),
  pluginFolder = pathh.join(__dirname, "./commands");
  
class config {
  static botname = require('./package.json').name;
  static ownername = require('./package.json').author.split('<')[0];
  static email = require('./package.json').author.split('<')[1].split('>')[0];
  static description = require('./package.json').description;
  static homepage = require('./package.json').author.split('(')[1].split(')')[0];
  static source = {
    instagram: 'https://instagram.com/arifirazzaq2001',
    group: 'https://chat.whatsapp.com/HXnDebS5pYB0UA0iB1RmIa'
  };
  static packInfo = { 
    packname: config.botname.toUpperCase(), 
	author: config.source.instagram.slice(8, 17)
	+config.source.instagram.slice(5, 6)
	+config.email.slice(0, 8).split("zaq1").map(v => v.replace("vr.", " @"))[0]
    +config.source.instagram.slice(22)
  }
  static server = true;
  static self = false;
  static prefixs = ".";
  static session = "./database/arata";
  static limit = 50;
  static owner = ["6285713729122@s.whatsapp.net"];
  static react = {
    wait: "⌚",
    success: "✔️",
    error: "❌"
  };
};

global.game = {}
global.game.akinator = {}
global.conns = {}
global.attr = {
  commands: new Map(),
  functions: new Map(),
  isSelf: config.self
};
global.baileysstore = makeInMemoryStore({
  logger: pino().child({ 
    level: "silent", 
    stream: "store" 
  }),
}); 
global.reload = (path) => {
  path = `./${path.replace(/\\/g, '/')}`
  filename = path.split("/")[3]
  if (pluginFilter(filename)) {
    let dir = pathh.join(pluginFolder, './' + path.split('/')[2] + '/' + path.split('/')[3])
    isi = require(path)
    if (dir in require.cache) {
      delete require.cache[dir];
      if (fs.existsSync(dir)) console.info(`re - require plugin '${path}'`);
    else {
      console.log(`deleted plugin '${path}'`);
      return isi.function
      ? delete attr.functions[filename]
      : delete attr.commands[filename];
    }
  } else console.info(`requiring new plugin '${filename}'`);
    let err = syntaxerror(fs.readFileSync(dir), filename);
    if (err) console.log(`syntax error while loading '${filename}'\n${err}`);
    else
    try {
      isi.function
      ? (attr.functions[filename] = require(dir))
      : (attr.commands[filename] = require(dir));
    } catch (e) {
      console.log(e);
    } finally {
      isi.function
      ? (attr.functions = Object.fromEntries(
      Object.entries(attr.functions).sort(([a], [b]) => a.localeCompare(b))
      ))
      : (attr.commands = Object.fromEntries(
      Object.entries(attr.commands).sort(([a], [b]) => a.localeCompare(b))
      ));
    }
  }
};
global.db = new Low(new JSONFile("database/json/database.json"));
global.bochil = require('@bochilteam/scraper');
global.cph = require('caliph-api');
global.dhn = require('dhn-api');
global.maker = require('mumaker');
global.rzky = new iky();
global.Api = new (require('./event/system/neoxrApi'))(process.env.API_KEY)
global.creator = config.ownername;
global.owner = config.owner;
global.response = mess;
global.users = JSON.parse(fs.readFileSync('./database/json/user.json'));
global.tool = require("./lib/tools");
global.scrapp = require("./lib/scraper");
global.Func = Function
global.ig = require('./lib/instagram');
global.shp = `•`;
global.reloadFile = (file, options = {}) => {
  tool.nocache(file, module => {
    console.log(`File "${file}" has updated!\nRestarting!`)
    process.send("reset")
  })
}

baileysstore.readFromFile(`./database/session/${config.botname.toLowerCase()}_store.json`);
setInterval(() => {
  baileysstore.writeToFile(`./database/session/${config.botname.toLowerCase()}_store.json`);
}, 10000);
setInterval(async () => {
  const tmpFiles = fs.readdirSync('./temp/bin')
  if(tmpFiles.length > 0) {
    tmpFiles.map(v => fs.unlinkSync('./temp/bin/' + v))
  }
  const storeFile = await Func.getFile(`./database/session/${config.botname.toLowerCase()}_store.json`);
  let chSize = await Func.sizeLimit(storeFile.size, 2)
  if(chSize.oversize) {
    fs.writeFileSync(`./database/session/${config.botname.toLowerCase()}_store.json`, stable({
      "chats": [],
      "contacts": {},
      "messages": {}
    }))
  }
}, 60 * 1000 * 5)

module.exports = config;
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(file);
  delete require.cache[file];
});