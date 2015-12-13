import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import spark from 'spark';
import utils from './utils';

import ParticleLogin from '../../particle-login';

const initialState = {
  temperature: {
    celsius: '0',
    fahrenheit: '0',
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TEMPERATURE':
      return {
        temperature: {
          celsius: action.celsius,
          fahrenheit: action.fahrenheit,
        }
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

const Temperature = ({ value }) => (
  <div style={{marginBottom: "20px"}}>
    <div className='main-temp'>
      {value.temperature.celsius} &deg;C
    </div>
    <div className='secondary-temp'>
      {value.temperature.fahrenheit} &deg;F
    </div>
  </div>
);

const App = () => (
  <div className='app-container'>
    <div className='temperature-widget'>
      <Temperature value={store.getState()} />
    </div>
  </div>
);

const render = () => {
  ReactDOM.render(
    <App/>,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();

spark.on('login', function() {
  spark.getEventStream('getTemp', 'mine', function({data}) {
    if(isNaN(data)) {
      return;
    }

    let celsius = data - 273.15;
    let fahrenheit = utils.formatNumber(utils.celsiusToFahrenheit(celsius), 2);
    celsius = utils.formatNumber(celsius, 1);

    store.dispatch({
      type: 'UPDATE_TEMPERATURE',
      celsius,
      fahrenheit,
    });
  });
});
spark.login(ParticleLogin);
