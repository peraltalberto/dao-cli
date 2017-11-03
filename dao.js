


var command = process.argv.slice(2)[0];
var options = process.argv.slice(3);


/*
dao tools
 */

function executeCommand() {
  var program = dao.programs[command];
  var action = program.action;
  var params = process.argv.slice(process.argv.length - program.nparam);
  var poptions = program.options;
  var conjunto = [];
  options.forEach(function (value, i, all) {
    var option = poptions.alias[value] ? poptions.alias[value] : (poptions[value] ? value : undefined);
    // console.log(poptions[value]+"--"+option+"++"+value);
    if (option) {
      this[option] = all[i + 1];
    }
  }, conjunto);
  action(conjunto, params);
}

var dao = {
  path: 'dao-cli.json',
  config: {
    hosts: {
        
    },
    templates: {
        ts: {
            interface: "export interface [name] { [fields] }",
            param: "public [name]:[type];",
            ext: ".ts"
        }
    }
},
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
    if (typeof conf === 'undefined') {
      return dao.config;
    } else {
      dao.config = conf;
    }
  }

}






