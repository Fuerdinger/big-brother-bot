var fs = require('fs');

class IO
{
    constructor(){}
    exists(serverName, localName)
    {
        return fs.existsSync(__dirname + '/../data/servers/'+serverName+'/'+localName+'.json');
    }
    openFile(serverName, localName, flag)
    {
        return fs.openSync(__dirname + '/../data/servers/'+serverName+'/'+localName+'.json', flag);
    }
    writeToFile(fd, json, flag)
    {
        fs.writeFileSync(fd, JSON.stringify(json), {encoding:'utf8', flag:flag});
    }
    readFromFile(fd, flag)
    {
        return fs.readFileSync(fd, {encoding:'utf8', flag:flag});
    }
    closeFile(fd)
    {
        fs.closeSync(fd);
    }
}

module.exports = {IO};