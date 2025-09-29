import { Request, Response } from "express";
import WebSocket from "ws";
declare const sessions: Map<string, WebSocket>;
export declare const createQrSession: (req: Request, res: Response) => void;
export declare const scanQrCode: (req: Request, res: Response) => Response<any, Record<string, any>>;
export { sessions };
//# sourceMappingURL=qrController.d.ts.map