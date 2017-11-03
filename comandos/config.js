
var fs = require('fs');
var dao = require('../dao');
var command = {
    help: () => {
        console.log("./> dao config [l list][ [db database <nombre db>] [p password <pass>] [u user <usuario>] [host <host db>]  <Nombre>]");
    },
    nparam: 1,
    options: {
        alias: { 'db': 'database', 'p': 'password', 'u': 'user', 'l': 'list' },
        "host": 'Direccion del host',
        "port": "Puerto del servidor de base de datos",
        "database": "Nombre de la base de datos",
        "password": "contraseña",
        "user": "usuario",
        "list": () => {
            console.log(dao.conf().hosts);
        },
        "type": "tipo de conexion a realizar",
        "json-file": "Fichero de configuracion completo"

    },
    action: (options, params) => {
        //console.log(options, params[0]);
        if (options.list || (params[0] == 'l' || params[0] == 'list')) {
            console.log('Listado de Configuraciones');
            command.options.list();
        } else {

            var nuevo_host = dao.conf().hosts[params[0]] ? dao.conf().hosts[params[0]] : {};
            dao.conf()["hosts"] = dao.conf()["hosts"]?dao.conf()["hosts"]:{};

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
            console.log(JSON.stringify(dao.conf().hosts));
        }
    }
}

module.exports = command;