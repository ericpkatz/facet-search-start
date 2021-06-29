import React from 'react';

const Facet = ({ map, name, navigate, filter })=> {
  return (
    <div>
      <h3>{ name }</h3>
      <div className='facets-container'>
        <label>All <input checked={ filter[name] === '' } onChange={ navigate } type='checkbox' name={ name } value=''/></label>
        {
          Object.entries(map).map(([ key, value])=> {
            return (
              <label key={ key }>
                { key } ({ value })
                <input checked={ filter[name] === key } onChange={ navigate } type='checkbox' name={ name } value={ key }/>
              </label>
            );
          })
        }
      </div>
    </div>
  );
};

export default Facet;
