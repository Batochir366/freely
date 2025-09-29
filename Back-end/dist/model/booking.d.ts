import mongoose from "mongoose";
declare const BookingModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
    user: string;
    company: mongoose.Types.ObjectId;
    bookingDate: NativeDate;
    startTime: string;
    endTime: string;
    status: "pending" | "booked" | "cancelled";
    price: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default BookingModel;
//# sourceMappingURL=booking.d.ts.map