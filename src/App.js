import "./App.css";
import Header from "./components/Header/Header";
// import useFetch from "./hooks/useFetch";
import Map from "./components/Map/Map"
import data from "./paths/new_data.json"
// console.log(data);
function App() {

  const paths = data;
  let stops = null;
  if(paths){
    stops = [paths[0]]
    stops.push(paths[paths.length-1]);
  }
  console.log(paths);
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
      : <h1>Failed To Load</h1>}
    </div>
  );
}

export default App;
