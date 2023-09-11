process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require('dotenv').config(), require('rootpath')();
const { promisify } = require("util"), { spawn: spawn, exec } = require('child_process'), assert = require("assert"), opts = new Object(require('yargs/yargs')(process.argv.slice(2)).exitProcess(false).parse()), rl = require('readline').createInterface(process.stdin, process.stdout), folders = ['.', ...Object.keys(require('./package.json').directories)], files = [];

function start() {
  let args = [require('path')["join"](__dirname, 'main.js'), ...process.argv.slice(2)]
  let p = spawn(process.argv[0], args, { 
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  }).on('message', data => {
    if(data == 'reset') {
      p.send("Restarting . . .");
      p.kill();
      delete p;
    } else if(data == 'uptime') {
      p.send(process.uptime());
    }; 
  }).on('exit', code => {
    console.error('Exited with code:', code);
    start();
  });
  if(!opts['test']);
  if(!rl.listenerCount()) rl.on('line', line => {
    p.emit('message', line.trim());
  });
};

console.clear(), 
  console.log('Starting . . .'), 
    require('cfonts')["say"](require("./package.json").name, { 
      colors: ['system'],
      font: 'tiny',
      align: 'center' 
    }), require('cfonts')["say"](require("./package.json").description, {
      colors: ['system'],
      font: 'console',
      align: 'center'
    });
    for (folder of folders)
    for (file of require('fs').readdirSync(folder).filter(v => v.endsWith('.js')))
    files.push(require('path').resolve(require('path').join(folder, file)))
    for (file of files) {
      if (file == require('path').join(__dirname, __filename)) continue
      console.log(file)
      let withCheckProgressThroughFileDirectory = spawn(process.argv0, ['-c', file])
      withCheckProgressThroughFileDirectory.on('close', () => {
        assert.ok(file)
      }).stderr.on('data', chunk => {
        assert.ok(chunk.length < 1, file + '\n\n' + chunk)
      });
    };
  promisify(exec).bind(require("child_process"));
start();

process.on('ERR_IPC_CHANNEL_CLOSED', function(err) {
  console.log(require("util").format(err))
});