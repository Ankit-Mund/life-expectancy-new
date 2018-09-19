exports.write = function(fs, JSON, fileName) {
    const path = "./output/" + fileName;
    fs.writeFile(path, JSON, 'utf8', function (err) {
        if (err) throw err;
        // console.log("JSON file" + fileName + " has been saved.");
    });
}