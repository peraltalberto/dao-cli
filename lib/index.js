var dao = require('../dao');
var installCommand = require('../comandos/install');
var mysqlCommand = require('../comandos/mysql');


dao.add('install',installCommand);
dao.add('mysql',mysqlCommand);

dao.exec();

