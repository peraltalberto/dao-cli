
var fs = require('fs-extra');
var path = require('path');
var ruta = '';
var local = process.argv[2] === '-l';

if (!local) {
  var dir = path.dirname(process.argv[1]).split(path.sep);
  for (var i = 0; i < dir.length - 1; i++) {
    ruta = ruta + dir[i] + path.sep;
  }
  console.log(ruta);
}

var command = '';
var options = '';

var defaultConf = {
  hosts: {

  },
  templates: {
    ts: {
      interface: "export class #name {\n [fields] \n}",
      param: "\t public #name:#type = #default;",
      ext: ".ts"
    }
  },

  type_maps: {
    mysql: {
      TINYINT: { ts: { type: "Number", default: 0 } },
      SMALLINT: { ts: { type: "Number", default: 0 } },
      INT: { ts: { type: "Number", default: 0 } },
      MEDIUMINT: { ts: { type: "Number", default: 0 } },
      YEAR: { ts: { type: "Number", default: 0 } },
      FLOAT: { ts: { type: "Number", default: 0 } },
      DOUBLE: { ts: { type: "Number", default: 0 } },
      TIMESTAMP: { ts: { type: "Date()", default: "''" } },
      DATE: { ts: { type: "Date()", default: "''" } },
      DATETIME: { ts: { type: "Date()", default: "''" } },
      TINYBLOB: { ts: { type: "Buffer", default: undefined } },
      MEDIUMBLOB: { ts: { type: "Buffer", default: undefined } },
      LONGBLOB: { ts: { type: "Buffer", default: undefined } },
      BLOB: { ts: { type: "Buffer", default: undefined } },
      BINARY: { ts: { type: "Buffer", default: undefined } },
      VARBINARY: { ts: { type: "Buffer", default: undefined } },
      BIT: { ts: { type: "Buffer", default: undefined } },
      CHAR: { ts: { type: "String", default: "''" } },
      VARCHAR: { ts: { type: "String", default: "''" } },
      TINYTEXT: { ts: { type: "String", default: "''" } },
      MEDIUMTEXT: { ts: { type: "String", default: "''" } },
      LONGTEXT: { ts: { type: "String", default: "''" } },
      TEXT: { ts: { type: "String", default: "''" } },
      ENUM: { ts: { type: "String", default: "''" } },
      SET: { ts: { type: "String", default: "''" } },
      DECIMAL: { ts: { type: "String", default: "''" } },
      BIGINT: { ts: { type: "String", default: "''" } },
      TIME: { ts: { type: "String", default: "''" } },
      GEOMETRY: { ts: { type: "String", default: "''" } }
    }
  }
};

/*
dao tools
 */

function executeCommand() {

  if (command === 'help') {
    console.log('Dao - cli is a command-line tool for quickly generating interfaces or classes with objects from a database.');
    console.log('\n\n', '           Commands ');
    console.log('-_-**************************---');
    Object.keys(dao.programs).forEach(e => {
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
  path: ruta + 'dao-cli.json',
  config: undefined,
  programs: {}
};

module.exports = {
  add: function (name, program) {
    dao.programs[name] = program;
  },
  exec: function () {
    command = process.argv.slice(local ? 3 : 2)[0];
    options = process.argv.slice(local ? 4 : 3);
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






