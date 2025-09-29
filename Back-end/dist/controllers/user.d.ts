import { Request, Response } from "express";
export declare const createUser: (req: Request, res: Response) => Promise<any>;
export declare const getUsers: (req: Request, res: Response) => Promise<any>;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const promoteToAdmin: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.d.ts.map