import axios from "axios";
import { Icon } from "leaflet";
import React, { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import useSWR from "swr";
import "./App.css";

export const icon = new Icon({
   iconUrl: "/leaf-green.png",
   shadowUrl: "leaf-shadow.png",
   iconSize: [38, 95],
   shadowSize: [50, 64],
   iconAnchor: [22, 94],
   shadowAnchor: [4, 62],
   popupAnchor: [-3, -76],
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function App() {
   const [activeSchool, setActiveSchool] = useState(null);

   const { data, error } = useSWR("/api/v1/schools", fetcher);
   const schools = data && !error ? data : [];
   const position = [-1.94, 29.87];
   const zoom = 9;
   console.log(schools);
   if (error) {
      return <Alert variant="danger">There is a problem</Alert>;
   }
   if (!data) {
      return (
         <Spinner
            animation="border"
            variant="danger"
            role="status"
            style={{
               width: "400px",
               height: "400px",
               margin: "auto",
               display: "block",
            }}
         />
      );
   }
   return (
      <MapContainer center={position} zoom={zoom}>
         <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />

         {schools.features.map((school) => (
            <Marker
               key={school.properties.name}
               position={[
                  school.geometry.coordinates[1],
                  school.geometry.coordinates[0],
               ]}
               onClick={() => {
                  setActiveSchool(school);
               }}
               icon={icon}
            >
               <Popup
                  onClose={() => {
                     setActiveSchool(null);
                  }}
               >
                  <div>
                     <h5>{school.properties.name}</h5>
                     <p>{school.properties.province}</p>
                  </div>
               </Popup>
            </Marker>
         ))}
         {/* {activeSchool && (
            <Popup
               position={[
                  activeSchool.geometry.coordinates[1],
                  activeSchool.geometry.coordinates[0],
               ]}
               onClose={() => {
                  setActiveSchool(null);
               }}
            >
               <div>
                  <h2>{activeSchool.properties.name}</h2>
                  <h2>{activeSchool.properties.province}</h2>
               </div>
            </Popup>
         )} */}
      </MapContainer>
   );
}
