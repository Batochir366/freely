"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axiosInstance from "@/utils/axios";
import { useScan } from "@/app/context/ScanContext";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const QrBooking = () => {
  const [qrId, setQrId] = useState<string | null>(null);
  const { scanned, setScanned } = useScan();

  useEffect(() => {
    let socket: WebSocket;

    const createQrSession = async () => {
      try {
        const res = await axiosInstance.post("/qr/create-qr-session");
        const qrIdFromServer = res.data.qrId;
        setQrId(qrIdFromServer);

        socket = new WebSocket("wss://freely-backend-lztj.onrender.com");

        socket.onopen = () => {
          socket.send(JSON.stringify({ qrId: qrIdFromServer }));
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.scanned) {
            setScanned(true);
            socket.close();
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
        };
      } catch (error) {
        console.error("Failed to create QR session", error);
      }
    };

    createQrSession();

    return () => {
      if (socket) socket.close();
    };
  }, [setScanned]);

  const qrUrl = qrId
    ? `https://freely-backend-lztj.onrender.com/qr/scan/${qrId}`
    : "";

  return (
    <div className="text-center flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Scan QR to Confirm</h2>

      {scanned ? (
        <p className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-2xl shadow-md"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold text-lg">Booking Confirmed</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 mt-2"
          >
            Thank you for your booking 🎉
          </motion.p>
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
