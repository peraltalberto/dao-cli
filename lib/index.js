var dao = require('../dao');
var configCommand = require('../comandos/config');
var mysqlCommand = require('../comandos/mysql');


dao.add('config',configCommand);
dao.add('mysql',mysqlCommand);

dao.exec();

