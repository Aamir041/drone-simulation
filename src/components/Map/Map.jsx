import React, { useEffect, useState, useCallback } from "react";
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
    Polyline,
} from "react-google-maps";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import "../../App.css";

const Map = ({ paths, stops }) => {
    const [progress, setProgress] = useState(null);
    const velocity = 30;
    let intialDate;
    let interval = null;

    const droneIcon = {
        url: "https://images.vexels.com/media/users/3/211837/isolated/lists/b4b43ec942ae9c695fc7f43d59234182-drone-quad-tilted-front.png",
        scaledSize: new window.google.maps.Size(55, 55),
        anchor: new window.google.maps.Point(20, 20),
        scale: 0.7,
    };

    const mid = parseInt(paths.length / 2);
    const centerPathLatitide = paths[mid].lat;
    const centerPathLongitude = paths[mid + 5].lng;

    useEffect(() => {
        calculatePath();
        return () => {
            interval && window.clearInterval(interval);
        };
    }, [paths]);

    const getDist = () => {
        const differenceInTime = (new Date() - intialDate) / 1000;
        return differenceInTime * velocity;
    };

    const moveDrone = () => {
        const dist = getDist();
        if (!dist) {
            return;
        }

        let progress = paths.filter((coordinates) => coordinates.dist < dist);

        let nextLine = paths.find((coordinates) => coordinates.dist > dist);

        if (!nextLine) {
            setProgress(progress);
            window.clearInterval(interval);
            console.log("Trip Ended");
            return;
        }

        const lastLine = progress[progress.length - 1];

        const lastLineLatLng = new window.google.maps.LatLng(
            lastLine.lat,
            lastLine.lng
        );

        const nextLineLatLng = new window.google.maps.LatLng(
            nextLine.lat,
            nextLine.lng
        );

        const totalDist = nextLine.dist - lastLine.dist;
        const percent = (dist - lastLine.dist) / totalDist;

        // helps in to find a point that is exactly halfway between these two points.
        const position = window.google.maps.geometry.spherical.interpolate(
            lastLineLatLng,
            nextLineLatLng,
            percent
        );

        mapUpdate();
        setProgress(progress.concat(position));
    };

    const calculatePath = () => {
        paths = paths.map((coordinates, idx, arr) => {
            // for fist coordinate in path
            if (idx === 0) return { ...coordinates, dist: 0 };

            const { lat: lat1, lng: long1 } = coordinates;
            const latLong1 = new window.google.maps.LatLng(lat1, long1);

            const { lat: lat2, lng: long2 } = arr[0];
            const latLong2 = new window.google.maps.LatLng(lat2, long2);

            const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
                latLong1,
                latLong2
            );

            return { ...coordinates, dist };
        });
    };

    const startSim = useCallback(() => {
        if (interval) {
            window.clearInterval(interval);
        }
        setProgress(null);
        intialDate = new Date();
        interval = window.setInterval(moveDrone, 1000);
    }, [interval, intialDate]);

    const mapUpdate = () => {
        const dist = getDist();

        if (!dist) return;

        let progress = paths.filter((coordinates) => coordinates.dist < dist);
        const nextLine = paths.find((coordinates) => coordinates.dist > dist);

        let point1, point2;

        if (nextLine) {
            point1 = progress[progress.length - 1];
            point2 = nextLine;
        } else {
            point1 = progress[progress.length - 2];
            point2 = progress[progress.length - 1];
        }

        const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
        const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);
    };

    return (
        <Card variant="outlined">
            <div className="btnCont">
                <Button variant="contained" onClick={startSim}>
                    Start Simulation
                </Button>
            </div>

            <div className="gMapCont">
                <GoogleMap
                    defaultZoom={17}
                    defaultCenter={{ lat: centerPathLatitide, lng: centerPathLatitide }}
                >
                    <Polyline
                        path={paths}
                        options={{
                            strokeColor: "#ff007b",
                            strokeWeight: 6,
                            strokeOpacity: 0.6,
                            defaultVisible: true,
                        }}
                    />

                    {stops.data.map((stop, index) => (
                        <Marker
                            key={index}
                            position={{
                                lat: stop.lat,
                                lng: stop.lng,
                            }}
                            title={stop.id}
                            label={`${index + 1}`}
                        />
                    ))}

                    {progress && (
                        <>
                            <Polyline path={progress} options={{ strokeColor: "#00eeff" }} />

                            <Marker icon={droneIcon} position={progress[progress.length - 1]} />
                        </>
                    )}
                </GoogleMap>
            </div>
        </Card>
    );
};


export default withScriptjs(
  withGoogleMap(
    Map
  )
)