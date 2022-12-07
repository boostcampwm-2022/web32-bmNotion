const path = require('path');
const fs = require("fs");

const imageController = {
    processImage: async (req, res) => {
        const file = req.body;
        
        const buf = Buffer.from(file)
        // console.log(buf)
        
        // const result = fs.createReadStream(file)
        // console.log(result);
        
        // console.log(typeof file);
        // console.log(file);

        res.sendStatus(201);
        // res.sendFile(path.join(__dirname, '../../../client/public/assets/chunseek.png'));
        // res.send();
    }
};

module.exports = { imageController };
