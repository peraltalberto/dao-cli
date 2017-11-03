![shieldsIO](https://img.shields.io/github/issues/peraltalberto/dao-cli.svg)
![shieldsIO](https://img.shields.io/github/release/peraltalberto/dao-cli.svg)
[![npm](https://img.shields.io/npm/v/dao-cli.svg)](https://www.npmjs.com/package/dao-cli)
![shieldsIO](https://img.shields.io/github/license/peraltalberto/dao-cli.svg)

# DAO - CLI

##### ***Dao - cli***  es una herramineta en linea de comandos para generar de manera rapida las interfaces o clases con los objetos desde base de datos. 

##### ***Dao - cli***  is a command-line tool for quickly generating interfaces or classes with objects from a database.

## INSTALACIÓN - INSTALL

> `npm install dao-cli -g`

una vez instalado tenemos de momento dos comandos.

#### > INSTALL 
 
 El comando `install` crea el fichero dao-cli.json con las configuraciones tanto de plantillas de creacion de ficheros, como de conexiones a bases de datos. 
 
 >    Sintaxis de comando:
 `dao install [db database <nombre db>] [p password <pass>] [u user <usuario>] [host <host db>] <Nombre>`
 
 
El fichero resultante dao-cil.json: 
~~~
{
    "hosts": {
        "MYDB": {
            "database": "mydb",
            "host":"localhost",
            "user":"root",
            "password":"1234"
        }
    },
    "templates": {
        "ts": {
            "interface": "export interface [name] { [fields] }",
            "param": "public [name]:[type];",
            "ext": ".ts"
        }
    }
}
~~~
 #### >MYSQL
 
 El comando `mysql` es el encargado de generar el fichero dao.
 
 >    Sintaxis de comando:
 `dao mysql [n name <ruta y nombre del fichero destino>][t template <template>] <conexion> <nombre de la tabla>`
 
 Fichero resultante:
 `dao mysql MYDB my_table`
 ~~~
export interface my_table { 
    public aNumber:Number;
    public aChar:String;
    public aDate:Date;
    public aBlob:Buffer;
}
 ~~~
