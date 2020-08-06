const dbService = require("../../services/db.service");

async function query(filterBy = {}) {
  try {
    var { criteria, rowCount } = await _buildCriteria(filterBy);
    const products = await dbService.runSQL(criteria);

    return { products, rowCount };
  } catch (err) {
    throw Error(err);
  }
}

async function update(xmlObj) {
  const arr = xmlObj.Root.Product;
  const queriesArray =  _buildQueryChuncks(arr);
  
  // clear the existing data in the table
  const clearTable = "TRUNCATE TABLE product";
  await dbService.runSQL(clearTable);

  // check if queriesArray exist
  if(!queriesArray.length) throw new Error(`Product list did not updated`);

  else {
    queriesArray.forEach( async(q) => {
      var okPacket = await dbService.runSQL(q);
      if (okPacket.affectedRows !== 0) {
        console.log('affectedRows', okPacket.affectedRows);
        return okPacket;
      }
      throw new Error(`Bad query`);
    })
  }
  return 'SUCCESSFULY UPDATED!'
}

module.exports = {
  query,
  update,
};

async function _buildCriteria(filterBy) {
  try {
    console.log("FILTER", filterBy);

    let query = "";
    let order = "Code";
    let limit = "";
    let offset = 0;
    
    if (filterBy.term) {
      query = `Name LIKE '%${filterBy.term}%'`;
    }
    if (filterBy.sortBy) {
      order = `${filterBy.sortBy}`;
    }

    // get row count from query
    let rowCount = await _getRowCount(query);

    if (filterBy.limit && filterBy.limit !== "all") {
      // rowCount = await _getRowCount(query);

      if (filterBy.page) {
        console.log("ROW COUNT", rowCount);
        const tempOffset = filterBy.page * filterBy.limit;
        console.log("tempOffset", tempOffset);

        if (tempOffset < rowCount) {
          offset = tempOffset;
        } else {
          const page = Math.floor(rowCount / filterBy.limit);
          offset = page * filterBy.limit;
        }
      }
      limit = `LIMIT ${offset}, ${filterBy.limit} `;
    }

    if (!query) query = 1;

    const criteria = `SELECT * FROM product  WHERE ${query} ORDER BY ${order} ${limit};`;
    let results = { criteria, rowCount };
    return results;
  } catch (err) {
    throw new Error("Bad query");
  }
}

async function _getRowCount(query) {
  try {
    if (!query) query = 1;

    console.log("QUERY", query);
    const criteria = `SELECT COUNT(*) FROM product WHERE ${query};`;
    const rowDataPacket = await dbService.runSQL(criteria);
    if (rowDataPacket) {
      const rowCount = rowDataPacket[0]["COUNT(*)"];
      return rowCount;
    }
  } catch (err) {
    throw new Error("Bad Count query");
  }
}

function _buildQueryChuncks(arr) {
  // Split the array of product into smaller chuncks
  let queriesArray = [];
  while (arr.length > 0) {
    let chunck = arr.splice(0, 999);
    let query = _buildInsertQuery(chunck);
    queriesArray.push(query);
  }
  return queriesArray;
}

function _buildInsertQuery(arr) {
  // build a INSERT statment from the chunk
  let query = `INSERT INTO product (Code, Name, CostPrice, RetailPrice, Qty, ManufacturerCode) VALUES `;
  arr.forEach((p, idx) => {
    query += `(${p.Code["#text"]}, '${p.Name["#text"]}', ${p.CostPrice["#text"]}, ${p.RetailPrice["#text"]}, ${p.Qty["#text"]}, '${p.ManufacturerCode["#text"]}')`;
    query += idx != arr.length - 1 ? "," : ";";
  });
  return query;
}
