"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Marker as LeafletMarker, LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { MiniInfoCard } from "@/app/(main)/Explore/components/MiniInfoCard";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: Array<{
    address: string;
    coordinate: [number, number];
  }>;
  phoneNumber: string;
  category: string[];
  socialMedia: {
    Facebook: string;
    instagram: string;
    website: string;
  };
  images: string[];
  companyLogo: string;
  pricing: number;
}

const MarkerIcon = new L.DivIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MapPin className=" hidden text-red-400" />
  ),
});

interface MapComponentProps {
  clicked: LatLngTuple | null;
  setClicked: Dispatch<SetStateAction<LatLngTuple | null>>;
  address: string;
  setAddress: (address: string) => void;
  myCompanies: Company[] | undefined;
  jumpToDetail: (id: string) => void;
  children: React.ReactNode;
}

export const MapComponent = ({
  clicked,
  setClicked,
  address,
  setAddress,
  myCompanies,
  jumpToDetail,
  children,
}: MapComponentProps) => {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [clicked]);

  const ChangeZoomControlPosition = () => {
    const map = useMap();
    useEffect(() => {
      map.zoomControl.setPosition("bottomright");
    }, [map]);
    return null;
  };

  function ClickHandler({
    setClicked,
  }: {
    setClicked: Dispatch<SetStateAction<LatLngTuple | null>>;
  }) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const coords: LatLngTuple = [lat, lng];
        setClicked(coords);
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setAddress(data.display_name);
          })
          .catch((err) => console.error("Geocoding error:", err));
      },
    });

    return null;
  }

  return (
    <div className="w-full h-screen flex">
      <MapContainer
        className="w-full h-full z-10"
        center={[47.92, 106.91]}
        zoom={14}
        attributionControl={false}
      >
        <ClickHandler setClicked={setClicked} />
        <ChangeZoomControlPosition />
        {clicked && (
          <Marker icon={MarkerIcon!} ref={markerRef} position={clicked}>
            <Popup>
              <p className="text-black font-bold text-[18px] flex pb-2 h-0">
                Are you sure 🤔
              </p>
              <div className="flex flex-col size-fit gap-3 items-end ">
                <h1 className=" text-[14px]">{address}</h1>
                {children}
              </div>
            </Popup>
          </Marker>
        )}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/5811666f-ea6e-421b-a1a8-c220b61f6b36/{z}/{x}/{y}{r}.png?access-token=uqeYaHBOlPqp13ESsgteE53obi4o78aMNktTHsvSRtv6g2DhywRCEzEIelnC7vhx"
        />
        {myCompanies && (
          <>
            {myCompanies.map((el: Company) => (
              <div key={el._id} onClick={() => jumpToDetail(el._id)}>
                <Marker
                  position={[
                    el.location[0].coordinate[0],
                    el.location[0].coordinate[1],
                  ]}
                  icon={L.icon({
                    iconUrl: `${el.companyLogo}`,
                    iconSize: [60, 60],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                    className: " rounded-full object-cover",
                  })}
                >
                  <MiniInfoCard
                    price={el.pricing}
                    imageUrl={el.companyLogo}
                    name={el.name}
                    location={el.location[0].address}
                  />
                </Marker>
              </div>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};
