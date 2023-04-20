const express = require("express");
const ProductService = require("./ProductService");
const ProductUtility=require('./productUtility');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
​
//get firstpage
app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
//get products
app.get("/products", async (req, res) => {
  let products = await ProductService.getProducts();
  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  let id = req.params.id;
  let product = await ProductService.getProductById(id);
  if (!product ) {
    res.status(404).send("product not found");
  } 
  else res.status(200).json(product);
});

//add products
app.post("/products", async (req, res) => {
    let productInput = req.body;
    //required validations
    const error = ProductUtility.isValidInputProduct(productInput);
    if(error) 
    {
        console.log(error);
        res.status(400).json(error);
        return; 
    }
    const result = await ProductService.addProduct(productInput);
    if(result=="err1")
    {
        res.status(400).json({err : "Duplicate Entry !(Product with similar name already exists)"});
        return;
    }
    else if(result=="err2")
    {
        res.status(400).json({err : "Duplicate Entry! Product with same url already exists"});
        return;
    }
    res.status(201).json(result);

});

//port listen
app.listen(port, () => {
    console.log(`Products app listening on port ${port}`);
  });