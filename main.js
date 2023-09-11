"use strict";
require('./config'), require('./lib/proto'), require("@adiwajshing/baileys/WAProto/index");

const { default: makeWASocket, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState, jidDecode, DisconnectReason, delay } = require("@adiwajshing/baileys"), { Boom } = require("@hapi/boom"), pino = require("pino"), fs = require("fs"), path = require("path"), chalk = require("chalk"), syntaxerror = require("syntax-error"), config = require("./config"), ramCheck = setInterval(() => {
  var ramUsage = process.memoryUsage().rss
  if(ramUsage >= 900000000) {
    clearInterval(ramCheck)
    process.send('reset')
  }
}, 60 * 1000);

const ReadFitur = () => {
  let pathdir = path.join(__dirname, "./plugins");
  let fitur = fs.readdirSync(pathdir);
  for (let fold of fitur) {
    for (let filename of fs.readdirSync(__dirname + `/plugins/${fold}`)) {
      let plugins = require(path.join(__dirname + `/plugins/${fold}`, filename));
      plugins.function ? (attr.functions[filename] = plugins) : (attr.commands[filename] = plugins);
    }
  }
  console.log("Command loaded successfully");
};

const middlewares = async (session) => {
  process.on("uncaughtException", function(a, b) { 
    if(!b.includes("listen EADDRINUSE")) {
      console.log("Already connected to the server before")
    } else {
      console.log(a, b)
    }
  })
  process.on("unhandledRejection", function(a, b) { 
    console.log(a, b)
  })
  var { state, saveCreds } = await useMultiFileAuthState(session);
  var { version, isLatest } = await fetchLatestBaileysVersion();
  
  console.log(`Using: ${version}, newer: ${isLatest}`);
  global.conn = makeWASocket({
    printQRInTerminal: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
      if(requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    },
    auth: state,
    browser: [config.botname, "linux", "1.0.0"],
    logger: pino({ level: "silent" }),
    version,
    getMessage: async key => {
      if(baileysstore) {
        var msg = await baileysstore.loadMessage(key.remoteJid, key.id, undefined);
        return msg?.message || undefined;
      };
      return { 
        conversation: util.format(key)
      };
    },
  });
  if(config.server) require("./lib/server")(conn);
  conn.mess = [];
  conn.cooldown = {}
  global.decodeJid = async (jid) => {
    if(/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      ).trim();
    } else return jid.trim();
  };
  baileysstore.bind(conn.ev);
  conn.ev.on("creds.update", saveCreds);
  conn.ev.on("connection.update", async (result) => {
    require('./event/connection_update')(middlewares, session, conn, result, DisconnectReason)
  })
  conn.ws.on("CB:call", async (json) => {
    require("./event/call")(json, conn);
  });
  conn.ev.on("contacts.update", async (m) => {
    for (let kontak of m) {
      let jid = await decodeJid(kontak.id);
      if(baileysstore && baileysstore.contacts)
      baileysstore.contacts[jid] = {
        jid, 
        name: kontak.notify
      };
    }
  });
  conn.ev.on("message.delete", async (json) => {
    require("./event/antidelete")(json, conn);
  });
  conn.ev.on("groups.update", async (json) => {
    require("./event/group_update")(json, conn);
  });
  conn.ev.on("group-participants.update", async (json) => {
    require("./event/greetings")(json, conn);
  });
  conn.ev.on("messages.upsert", (m) => {
    require("./lib/handler")(conn, m);
  });
};

ReadFitur();
middlewares(config.session);
Object.freeze(global.reload);