
var fs = require('fs-extra');
var path = require('path');
var mysql = require('mysql');
var util = require('../lib/util');
var dao = require('../dao');
var types_js = ['Number', 'Date', 'Buffer', 'String'];

var command = {
    help: () => {
        console.log(`./> dao mysql [d path <ruta del fichero>][n name <nombre del objeto>][t template <template>] <conexion> <nombre de la tabla>`)
    },
    nparam: 2,
    options: {
        alias: { 't': "template", 'd': 'path', 'n': 'name' },
        "template": "ts",
        "path": "path file",
        "name": "name to object"
    },
    action: (options, params) => {

        let connexion = mysql.createConnection(dao.conf().hosts[params[0]]);
        connexion.connect();
        connexion.query("SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = ?",
            params[1],
            (err, results, fields) => {

                if (err) {
                    console.log("Upps no se a podido conectar con la BBDD");
                    console.log(err.sqlMessage);
                } else {
                    var template = dao.conf().templates[options.template ? options.template : 'ts'];
                    var type_maps = dao.conf().type_maps;
                    var file_text = template.interface;
                    file_text = file_text
                    .replace(new RegExp('#name#', 'g') , options.name ? options.name : params[1])
                    .replace(new RegExp('#nameU#', 'g') , util.normalizeNameU(options.name ? options.name : params[1]))
                    .replace(new RegExp('#nameL#', 'g') , util.normalizeNameL(options.name ? options.name : params[1]));
                    fields = '';
                    console.log(file_text);
                    field_text = template.param;

                    for (let i = 0; i < results.length; i++) {
                        var el = results[i];
                        fields = fields + '\n' + field_text
                        .replace(new RegExp('#name#', 'g') , el['COLUMN_NAME'])
                        .replace(new RegExp('#nameU#', 'g') ,util.normalizeNameU( el['COLUMN_NAME']))
                        .replace(new RegExp('#nameL#', 'g') ,util.normalizeNameL( el['COLUMN_NAME']))
                        .replace(new RegExp('#type#', 'g'),type_maps.mysql[el['DATA_TYPE']
                        .toUpperCase()].ts.type)
                        .replace(new RegExp('#default#', 'g'),type_maps.mysql[el['DATA_TYPE']
                        .toUpperCase()].ts.default);
                    };
                    // console.log(fields);
                    file_text = file_text.replace('[fields]', fields);

                    var dir = (options.path ?
                        (fs.existsSync('src') ? 'src/' : '') + options.path + (options.name ? options.name : params[1]) + template.ext
                        :
                        (options.name ? options.name : params[1]) + template.ext);
                    console.log('Create: ',path.dirname(dir), (options.name ? options.name : params[1]) + template.ext);
                    if (!fs.existsSync(path.dirname(dir))) {
                        fs.mkdirpSync(path.dirname(dir));
                    }
                    fs.writeFileSync(dir, file_text);
                    connexion.end();
                }
            });
    }
}

module.exports = command;