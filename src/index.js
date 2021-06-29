import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';
import Facet from './Facet';


const App = (props)=> {
  const [products, setProducts] = useState([]);
  const [filter, setFilter ] = useState({ color: '', shape: '' });

  //filter is based on url
  useEffect(()=> {
    if(props.match.params.filter){
      setFilter(JSON.parse(props.match.params.filter));
    }
    else {
      setFilter({ color: '', shape: '' }); 
    }
  }, [ props.match.params.filter]);

  //change url to change filter
  const navigate = (ev)=> {
    const _filter = {...filter};
    _filter[ev.target.name] = ev.target.value;
    props.history.push(`${JSON.stringify(_filter)}`);
  };

  //load all products once
  useEffect(async()=> {
    const response = await fetch('/api/products');
    const products = await response.json();
    setProducts(products);
  }, []);

  //to do filter products based on filter and allow navigation

  return (
    <div>
      <section>
        <a href='#'>All</a>
        <h2>Filters</h2>
        <pre>
        {
          JSON.stringify(filter)
        }
        </pre>
      </section>
      <section>
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Color</th>
              <th>Shape</th>
            </tr>
          </thead>
          <tbody>
            {
              products
                .map( product => {
                return (
                  <tr key={ product.id }>
                    <td>
                      { product.name }
                    </td>
                    <td>
                      { product.color }
                    </td>
                    <td>
                      { product.shape }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Routes = ()=> {
  return (
    <HashRouter>
      <Route component= { App } path='/:filter?' />
    </HashRouter>
  );
};

render(<Routes />, document.querySelector('#root'));
