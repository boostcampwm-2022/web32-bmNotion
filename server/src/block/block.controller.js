const imageController = {
    processImage: async (req, res) => {
        const {file} = req.body;
        
        console.log(file);

        res.sendStatus(201);
    }
};

module.exports = { imageController };
