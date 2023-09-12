import "./App.css";
import Header from "./components/Header/Header";
import useFetch from "./hooks/useFetch";
import Map from "./components/Map/Map"
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [url,setUrl] = useState('https://aamir041.github.io/js_projects/new_data.json');

  const [tempUrl,setTempUrl] = useState(null);

  const {data:paths} = useFetch(url);
  let stops = null;
  if(paths){
    stops = [paths[0]]
    stops.push(paths[paths.length-1]);
  }
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA5Lt3E5gYb-lfogvaSpCrvCpocLqHwNOI`;

  const changeUrl = () => {
    setUrl(tempUrl)
  }

  useEffect(() => {

  },[url])

  return (
    <div className="app">
      <Header/>

      <div className="map-inputs">
                <input type="text" placeholder="Paste URL"  onChange={(e) => setTempUrl(e.target.value)}/>
                <button onClick={changeUrl}> Change URL</button>
      </div>

      {paths && stops ? 
      <Map
          paths={paths}
          stops={stops}
          googleMapURL={mapURL}
          changeUrl = {changeUrl}
          loadingElement={<div/>}
          containerElement={<div className='mapContainer'  />}
          mapElement={<div style={{ height: `100%` }} />}
      /> 
      : <h1>Please Enter A Valid URL</h1>}
    </div>
  );
}

export default App;
