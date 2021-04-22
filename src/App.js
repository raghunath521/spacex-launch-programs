import React from 'react';
import './App.css';
import Spacexlp from './spacexlp/spacexlp';

function App() {
    const developer = 'Venkata Raghu';
    return (
      <div className="main-content">
        <h1>SpaceX Launch Programs</h1>
        <Spacexlp ></Spacexlp>
        <h3 className='footer'>Developed by: {developer}</h3>
      </div>
  );
}

export default App;
