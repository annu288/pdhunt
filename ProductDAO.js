//connection
const mysql = require("mysql");
const util = require("util");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Honey29#",
  database: "pdhunt",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Connected to MySQL Server!");
});
const query = util.promisify(connection.query).bind(connection);

//get method
let getProductsFromDB = async (id) => {
  let detailedProduct;
  detailedProduct = await query(
    'SELECT p.id,p.name,p.short_desp,p.long_desp,p.visit_url,p.icon_url,created_on,created_by,updated_on,updated_by,GROUP_CONCAT(DISTINCT image.url SEPARATOR ",") AS images, GROUP_CONCAT(DISTINCT comment.desp SEPARATOR ",") AS comments, COUNT(DISTINCT upvote.user_id) as upvote_count FROM product p left JOIN image ON image.prod_id = p.id left JOIN comment ON comment.prod_id = p.id LEFT JOIN upvote ON upvote.prod_id = p.id GROUP BY p.id'
  );
  // map to convert strings of images and tags into array
  detailedProduct = detailedProduct.map((row) => ({
    ...row,
    images: row.images ? row.images.split(",") : [],
    comments: row.comments ? row.comments.split(",") : [],
  }));
  id = Number(id);
  //this will return result of product of particular id
  if (id) {
    detailedProduct = detailedProduct.find((ele) => ele.id === id);
    return detailedProduct;
  }
  //this will return result of all products
  else {
    let homePageProducts = [];
    detailedProduct.forEach((element) => {
      const {
        id,
        name,
        short_desp,
        icon_url,
        visit_url,
        upvote_count,
        comments,
      } = element;
      let product = {
        id,
        name,
        short_desp,
        icon_url,
        visit_url,
        upvote_count,
        comments_count: comments.length,
      };
      homePageProducts.push(product);
    });
    return homePageProducts;
  }
};
//get noOfProducts
const getNoOfProductsQuery = `SELECT COUNT(id) as cnp FROM product `;

//add method
let addProductToDB = async (productInput) => {
  //validation for duplicate entry (Business Logic)
  let countOfProductByName = await query(
    getNoOfProductsQuery + `WHERE name = "${productInput["name"]}" `
  );
  if (countOfProductByName[0].cnp) return "err1";
  let countOfProductByUrl = await query(
    getNoOfProductsQuery + `WHERE visit_url = "${productInput["visit_url"]}" `
  );
  if (countOfProductByUrl[0].cnp) return "err2";

  let userId = Date.now(); //creating automatic generated id
  userId = Math.floor(userId / 1000);

  let columnQuery = "id,";
  let valuesQuery = `${userId},`;
  columnQuery += `name, visit_url,icon_url,short_desp,long_desp,created_by,created_on,updated_by,updated_on`;
  valuesQuery += `"${productInput["name"]}","${productInput["visit_url"]}","${productInput["icon_url"]}","${productInput["short_desp"]}","${productInput["long_desp"]}",${productInput["created_by"]},"${productInput["created_on"]}",${productInput["updated_by"]},"${productInput["updated_on"]}" `;

  let defaultQuery = "SELECT * FROM product";

  let sqlQuery = `INSERT INTO product (${columnQuery}) VALUES(${valuesQuery}) `;
  sqlQuery = productInput ? sqlQuery : defaultQuery;
  let result = await query(sqlQuery);

  result["id"] = userId; // adding the generated id in result
  return result;
};

module.exports = { addProductToDB, getProductsFromDB };
