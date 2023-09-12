import "./App.css";
import Header from "./components/Header/Header";
import useFetch from "./hooks/useFetch";
import Map from "./components/Map/Map"
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [url,setUrl] = useState(null);

  const [tempUrl,setTempUrl] = useState(null);
  const[errorApi, setErrorApi] = useState(false);

  const {data:paths} = useFetch(url);
  let stops = null;
  if(paths){
    stops = [paths[0]]
    stops.push(paths[paths.length-1]);
  }
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA5Lt3E5gYb-lfogvaSpCrvCpocLqHwNOI`;

  const changeUrl = () => {
    if(tempUrl.indexOf("aamir") >= 0){
      setUrl(tempUrl);
      setErrorApi(false);
    }
    else{
      setErrorApi(true);
    }
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

      {
        errorApi && <div className="error-api">
          <h1>Invalid API</h1>
          <p className="readme-link">
          Refer api from reademe only : <a href="https://github.com/Aamir041/drone-simulation/blob/main/README.md " target="_blank" >https://github.com/Aamir041/drone-simulation/blob/main/README.md</a>
          </p>
        </div>
      }

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
      : 
      <div className="invalid-screen">
        <h1>Please Enter A Valid URL or Refersh Page</h1>
        <p className="readme-link">
          Refer api from reademe only : <a href="https://github.com/Aamir041/drone-simulation/blob/main/README.md " target="_blank" >https://github.com/Aamir041/drone-simulation/blob/main/README.md</a>
          </p>
      </div>
      }
    </div>
  );
}

export default App;
