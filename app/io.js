var fs = require('fs');

class IO
{
    serversPath = __dirname + '/../data/servers/';
    constructor(){}
    
    exists(serverName, localName)
    {
        return fs.existsSync(this.serversPath+serverName+'/'+localName+'.json');
    }
    openFile(serverName, localName, flag)
    {
        return fs.openSync(this.serversPath+serverName+'/'+localName+'.json', flag);
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
    makeDir(dirName)
    {
        return fs.mkdirSync(this.serversPath+dirName);
    }
    getFilesInDir(serverName, localName)
    {
        return fs.readdirSync(this.serversPath+serverName+'/'+localName);
    }
}

module.exports = {IO};