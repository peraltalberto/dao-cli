
var fs = require('fs-extra');
var path = require('path');
var mysql = require('mysql');
var dao = require('../dao');
var types_js = ['Number', 'Date', 'Buffer', 'String'];


function casting(type) {
    type = type.toUpperCase();
    switch (type) {
        case 'TINYINT':
        case 'SMALLINT':
        case 'INT':
        case 'MEDIUMINT':
        case 'YEAR':
        case 'FLOAT':
        case 'DOUBLE':
            return types_js[0];
        case 'TIMESTAMP':
        case 'DATE':
        case 'DATETIME':
            return types_js[1];
        case 'TINYBLOB':
        case 'MEDIUMBLOB':
        case 'LONGBLOB':
        case 'BLOB':
        case 'BINARY':
        case 'VARBINARY':
        case 'BIT':
            return types_js[2];
        case 'CHAR':
        case 'VARCHAR':
        case 'TINYTEXT':
        case 'MEDIUMTEXT':
        case 'LONGTEXT':
        case 'TEXT':
        case 'ENUM':
        case 'SET':
        case 'DECIMAL':
        case 'BIGINT':
        case 'TIME':
        case 'GEOMETRY':
            return types_js[3];
    }
}

var command = {
    help: () => {
        console.log("mysql [options] conf_name table ")
    },
    nparam: 2,
    options: {
        alias: { 't': "template", 'n': 'name' },
        "template": "ts",
        "name": "file nombre"
    },
    action: (options, params) => {
        if (fs.existsSync(dao.path())) {
            dao.conf(JSON.parse(fs.readFileSync(dao.path())));
        } else {
            fs.writeFileSync(dao.path(), JSON.stringify(dao.conf()));
        }
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
                    var file_text = template.interface;
                    file_text = file_text.replace('[name]', params[1]);
                    fields = '';
                    field_text = template.param;

                    for (let i = 0; i < results.length; i++) {
                        var el = results[i];
                        fields = fields + '\n' + field_text.replace('[name]', el['COLUMN_NAME']).replace('[type]', casting(el['DATA_TYPE']));

                    };
                    // console.log(fields);
                    file_text = file_text.replace('[fields]', fields);

                    var dir = options.name ? options.name : params[1] + template.ext;
                    console.log(dir, path.dirname(dir));
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