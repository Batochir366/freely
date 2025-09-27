import {
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MapPinned,
  Phone,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Card } from "./ui/card";
const MarkerIcon = new L.DivIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(<MapPin className=" text-red-400" />),
});
export const MapInfo = ({
  facebook,
  address,
  instagram,
  website,
  number,
  position,
}: {
  facebook: string;
  address: string;
  instagram: string;
  website: string;
  number: string;
  position: number[];
}) => {
  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="z-0">
        <Card className="p-0 overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 relative">
            {position && (
              <MapContainer
                center={[position[0], position[1]]}
                zoom={15}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
                style={{ width: "100%", height: "100%" }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  icon={MarkerIcon}
                  position={[position[0], position[1]]}
                />
              </MapContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="p-4 gap-0">
            <h3 className="font-semibold mb-3 text-white">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <MapPinned className="w-5 h-5 text-white/80" />
                </div>
                <a
                  className="break-all relative text-white/80 hover:text-cyan-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300"
                  href="https://www.google.com/maps"
                >
                  {address}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Phone className="w-5 h-5 text-white/80" />
                </div>
                <p className="break-all relative text-white/80 hover:text-cyan-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300">
                  (+976) {number}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="p-4 gap-0">
            <h3 className="font-semibold mb-3 text-white">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <Instagram className="w-5 h-5 text-white/80" />
                </div>
                <a
                  className="break-all relative text-white/80 hover:text-cyan-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300"
                  href="https://www.instagram.com/"
                >
                  {instagram}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Facebook className="w-5 h-5 text-white/80" />
                </div>
                <a
                  className="break-all relative text-white/80 hover:text-cyan-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300"
                  href="https://www.facebook.com/"
                >
                  {facebook}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Globe className="w-5 h-5 text-white/80" />
                </div>
                <a
                  className="break-all relative text-white/80 hover:text-cyan-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300"
                  href="https://chatgpt.com/"
                >
                  {website}
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
