import mongoose from "mongoose";
declare const ReviewModel: mongoose.Model<{
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
}, {}> & {
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
}>, {}> & mongoose.FlatRecord<{
    comment: string;
    name: string;
    createdAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    starCount: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ReviewModel;
//# sourceMappingURL=review.d.ts.map