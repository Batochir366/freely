"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axiosInstance from "@/utils/axios";
import { useScan } from "@/app/context/ScanContext";

export const QrBooking = () => {
  const [qrId, setQrId] = useState<string | null>(null);
  const { scanned, setScanned } = useScan();

  useEffect(() => {
    const createQrSession = async () => {
      try {
        const res = await axiosInstance.post("/qr/create-qr-session");
        const qrIdFromServer = res.data.qrId;
        setQrId(qrIdFromServer);

        const socket = new WebSocket("wss://freely-backend-lztj.onrender.com");

        socket.onopen = () => {
          socket.send(JSON.stringify({ qrId: qrIdFromServer }));
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log(message, "message");
          if (message.scanned) {
            setScanned(true);
            socket.close();
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
        };

        return () => socket.close();
      } catch (error) {
        console.error("Failed to create QR session", error);
      }
    };

    createQrSession();
  }, [setScanned]);

  const qrUrl = qrId
    ? `https://freely-backend-lztj.onrender.com/qr/scan/${qrId}`
    : "";

  return (
    <div className="text-center flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Scan QR to Confirm</h2>

      {scanned ? (
        <p className="text-green-600 font-semibold text-lg mt-4">
          ✅ Booking Confirmed
        </p>
      ) : qrId ? (
        <>
          <QRCodeCanvas value={qrUrl} size={256} />
          <p className="mt-2 text-gray-500 text-sm">
            Scan with your phone to confirm
          </p>
        </>
      ) : (
        <p className="text-gray-500">Generating QR...</p>
      )}
    </div>
  );
};
