const Sequelize = require('sequelize');
const faker = require('faker');
const { DataTypes: { STRING }} = Sequelize;
const express = require('express');
const app = express();
const path = require('path');

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the-facet-store');

const Product = conn.define('product', {
  name: STRING,
  color: STRING,
  shape: STRING
});

const seed = async()=> {
  await conn.sync({ force: true });
  if(process.env.SIMPLE_SEED){
    await Promise.all([
      Product.create({name: 'blue square', color: 'blue', shape: 'square'}),
      Product.create({name: 'blue square 2', color: 'blue', shape: 'square'}),
      Product.create({name: 'blue circle', color: 'blue', shape: 'circle'}),
      Product.create({name: 'blue triangle', color: 'blue', shape: 'triangle'}),
      Product.create({name: 'red triangle', color: 'red', shape: 'triangle'}),
      Product.create({name: 'red square', color: 'red', shape: 'square'}),
    ]);

  }
  else {
    const products = [];
    const shapes = 'circle, oval, triangle, rhombus, square, rectangle, trapezoid, pentagon, hexagon, octagon'.split(',').slice(0, 4).map(s => s.trim());
    const colors = [];
    while(colors.length < 4){
      colors.push(faker.commerce.color())
    }
    while(products.length < 500){
      products.push({ name: faker.commerce.productName(), color: faker.random.arrayElement(colors), shape: faker.random.arrayElement(shapes) });
    }
    await Promise.all(products.map(p => Product.create(p)));
  }
};


const port = process.env.PORT || 3000;

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/products/:filter?', async(req, res, next)=> {
  try {
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.listen( port, async() => {
  console.log(`listening on port ${port}`);
  await seed();
});
