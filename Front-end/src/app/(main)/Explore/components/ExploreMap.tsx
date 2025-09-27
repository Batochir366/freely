"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MiniInfoCard } from "./MiniInfoCard";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLoading } from "@/app/context/LoadingContext";
interface Company {
  _id: string;
  name: string;
  description: string;
  location: Array<{
    address: string;
    coordinate: [number, number];
  }>;
  phoneNumber: string;
  category: [
    {
      icon: string;
      name: string;
    }
  ];
  socialMedia: {
    Facebook: string;
    instagram: string;
    website: string;
  };
  images: string[];
  companyLogo: string;
  pricing: number;
}

const ExploreMap = ({ data }: { data: Company[] }) => {
  const router = useRouter();
  const { loading } = useLoading();
  const jumpToDetail = (_id: string) => {
    router.push(`/Company/${_id}`);
  };
  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="w-full h-full flex rounded-lg">
        <MapContainer
          className=" size-full z-10 "
          center={[47.92, 106.91]}
          zoom={14}
          maxZoom={19}
          minZoom={1}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.jawg.io/5811666f-ea6e-421b-a1a8-c220b61f6b36/{z}/{x}/{y}{r}.png?access-token=uqeYaHBOlPqp13ESsgteE53obi4o78aMNktTHsvSRtv6g2DhywRCEzEIelnC7vhx"
          />
          {data && (
            <>
              {data.map((el: Company) => (
                <div key={el._id} onClick={() => jumpToDetail(el._id)}>
                  <Marker
                    position={[
                      el.location[0].coordinate[0],
                      el.location[0].coordinate[1],
                    ]}
                    icon={L.icon({
                      iconUrl: `${el.companyLogo}`,
                      iconSize: [30, 30],
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
    </>
  );
};

export default ExploreMap;
