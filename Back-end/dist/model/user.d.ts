import mongoose from "mongoose";
declare const UserModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    isAdmin: boolean;
    userName?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    photo?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default UserModel;
//# sourceMappingURL=user.d.ts.map