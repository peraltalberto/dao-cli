module.exports = {
    normalizeNameU : (name_file)=>{
        var palabras = name_file.split('_');
        if(palabras.length == 0)
        palabras = name_file.split('-');
        var newName = '';
        for(var i = 0; i<palabras.length; i++){
            var string = palabras[i];
            newName += string.substr(0,1).toUpperCase()+string.substr(1,string.length).toLowerCase();
        }
        return newName;
    },
    normalizeNameL : (name_file)=>{
        var palabras = name_file.split('_');
        if(palabras.length == 0)
        palabras = name_file.split('-');
        var newName = '';
        for(var i = 0; i<palabras.length; i++){
            var string = palabras[i];
            newName += string.substr(0,1).toUpperCase()+string.substr(1,string.length).toLowerCase();
        }
        return newName.substr(0,1).toLowerCase();
    }
}