const productService = require("./product.service");

async function getProducts(req, res) {
  try {
    const results = await productService.query(req.query);

    res.json(results);
  } catch (err) {
    res.status(404).send("Query didn't get any results");
  }
}

async function updateProducts(req, res) {
  try {
    const { xmlObj } = req.body; // a JS object from XML file
    const results = productService.update(xmlObj);
    res.status(200).send(results); 
  } catch (err) {
    res.status(400).send(err);
  }
}

module.exports = {
  getProducts,
  updateProducts,
};
