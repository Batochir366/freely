import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

const sessions: Map<string, WebSocket> = new Map();

export const createQrSession = (req: Request, res: Response) => {
  const qrId = uuidv4();
  res.json({ qrId });
};

export const scanQrCode = (req: Request, res: Response) => {
  const qrId = req.params.qrId;
  const socket = sessions.get(qrId);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ scanned: true }));
    sessions.delete(qrId);
    return res.type("html").send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>QR Scanned</title>
    <!-- Tailwind Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mx-auto">
        <span class="text-3xl">✅</span>
      </div>
      <h1 class="mt-4 text-2xl font-semibold text-emerald-800">Booking Confirmed</h1>
      <p class="mt-2 text-sm text-slate-500">Спасибо — your booking has been confirmed successfully.</p>
      <a href="/" class="mt-6 inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium">Back to Home</a>
    </div>
  </body>
</html>
`);
  } else {
    return res.status(404).send("Invalid or expired QR");
  }
};

export { sessions };
