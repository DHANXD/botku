"use strict";
const spinnies = new(require('spinnies'))(), fs = require('fs'), qrcode = require('qrcode-terminal');

async function connection(middlewares, session, conn, result, DisconnectReason) {
  try {
    const {
      connection,
      lastDisconnect,
      qr
    } = result;
    if(lastDisconnect == 'undefined' && qr != 'undefined') {
      qrcode.generate(qr, {
        small: true
      });
    };
    if(connection === 'connecting') {
      spinnies.add('start', {
        text: 'Connecting . . .'
      });
    } else if(connection === 'open') {
      spinnies.succeed('start', {
        text: `Connected, you login as ${conn.user.name || conn.user.verifiedName}`
      });
      conn.sendMessage("6283193905842@s.whatsapp.net", { text: "Bot Telah Online . . ." })
    } else if(connection === 'close') {
      if(lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
        spinnies.fail('start', {
          text: `Can't connect to Web Socket`
        });
        await props.save();
        process.exit(0);
      } else if(lastDisconnect.error.output.statusCode == DisconnectReason.connectionReplaced) {
        spinnies.fail('start', {
          text: `Can't connect to Web Socket`
        }); 
        await props.save();
        process.exit(0);
      } else {
        middlewares(session).catch(() => middlewares(session));
      }
    }
  } catch (err) {
    console.log(console.log(require("util")["format"](err)));
  };
};

module.exports = connection;