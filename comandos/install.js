
var fs = require('fs');
var dao = require('../dao');
var command = {
        help: () => {
            console.log("install options..[] name ")
        },
        nparam: 1,
        options: {
            alias: { 'db': 'database', 'p': 'password', 'u': 'user' },
            "host": 'Direccion del host',
            "port": "Puerto del servidor de base de datos",
            "database": "Nombre de la base de datos",
            "password": "contraseña",
            "user": "usuario",
            "type": "tipo de conexion a realizar",
            "json-file": "Fichero de configuracion completo"

        },
        action: (options, params) => {
            if (fs.existsSync(dao.path())) {
                dao.conf(JSON.parse(fs.readFileSync(dao.path())));
            } else {
                fs.writeFileSync(dao.path(), JSON.stringify(dao.conf()));
            }
            var nuevo_host = dao.conf().hosts[params[0]]  ? dao.conf().hosts[params[0]] : {};
            dao.conf()["hosts"] = {};

            if (!options["json-file"]) {
                //console.log(options);

                options.host ? nuevo_host["host"] = options.host : '';
                options.port ? nuevo_host["port"] = options.port : '';
                options.type ? nuevo_host["type"] = options.type : '';
                options.user ? nuevo_host["user"] = options.user : '';
                options.password ? nuevo_host["password"] = options.password : '';
                options.database ? nuevo_host["database"] = options.database : '';

            } else {
                nuevo_host = options["--json-file"];
            }

            dao.conf().hosts[params[0]] = nuevo_host;

           // console.log(dao.conf());

            fs.writeFileSync(dao.path(), JSON.stringify(dao.conf()));
        }
    }

module.exports = command;