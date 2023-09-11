import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import useFetch from "./hooks/useFetch";
// import Map from "./Components/Map/Map";

function App() {

  const { data: paths} = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/path');
  const { data: stops } = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/stops');
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA5Lt3E5gYb-lfogvaSpCrvCpocLqHwNOI`;

  return (
    <div className="app">
      <Header/>
      {paths && stops ? 
      <Map
          paths={paths}
          stops={stops}
          googleMapURL={mapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div className='mapContainer'  />}
          mapElement={<div style={{ height: `100%` }} />}
      /> 
      : <h1>Kuch Nahi Hai</h1>}
    </div>
  );
}

export default App;
