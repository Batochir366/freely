import mongoose from "mongoose";
declare const categoryModel: mongoose.Model<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
}, {}> & {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
}>, {}> & mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    group: "Type" | "Difficulty" | "Activity";
    icons: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default categoryModel;
//# sourceMappingURL=category.d.ts.map