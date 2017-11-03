

var fs = require('fs');

var command = process.argv.slice(2)[0];
var options = process.argv.slice(3);

var defaultConf = {
  hosts: {

  },
  templates: {
    ts: {
      interface: "export interface [name] {\n [fields] \n}",
      param: "\t public [name]:[type];",
      ext: ".ts"
    }
  }
};

/*
dao tools
 */

function executeCommand() {
  
  if (command === 'help') {
    console.log('Dao - cli is a command-line tool for quickly generating interfaces or classes with objects from a database.');
    console.log('\n\n','           Commands ');
    console.log(       '-_-**************************---');
    Object.keys(dao.programs).forEach(e=>{
      dao.programs[e].help();
      console.log('\n');
    });

  } else {

    var program = dao.programs[command];
    var action = program.action;
    var params = process.argv.slice(process.argv.length - program.nparam);
    var isHelp = process.argv.slice(process.argv.length - 1) === 'help';
    var poptions = program.options;
    var conjunto = [];

    options.forEach(function (value, i, all) {
      var option = poptions.alias[value] ? poptions.alias[value] : (poptions[value] ? value : undefined);
      // console.log(poptions[value]+"--"+option+"++"+value);
      if (option) {
        this[option] = all[i + 1];
      }
    }, conjunto);
    if (isHelp)
      program.help();
    else
      action(conjunto, params);
  }
}
var dao = {
  path: 'dao-cli.json',
  config: undefined,
  programs: {}
};

module.exports = {
  add: function (name, program) {
    dao.programs[name] = program;
  },
  exec: function () {
    command = process.argv.slice(2)[0];
    options = process.argv.slice(3);
    executeCommand();
  },
  path: function () {
    return dao.path;
  },
  conf: function (conf) {
    if (dao.config === undefined) {
      if (fs.existsSync(dao.path)) {
        dao.config = JSON.parse(fs.readFileSync(dao.path));
      } else {
        fs.writeFileSync(dao.path, JSON.stringify(defaultConf));
        dao.config = defaultConf;
      }
    }
    if (typeof conf === 'undefined') {
      return dao.config;
    } else {
      dao.config = conf;
    }
  }

}






