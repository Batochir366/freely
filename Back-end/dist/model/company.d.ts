import mongoose from "mongoose";
declare const CompanyModel: mongoose.Model<{
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
}, {}> & {
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    name: string;
    user: mongoose.Types.ObjectId;
    location: mongoose.Types.DocumentArray<{
        coordinate: number[];
        address?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        coordinate: number[];
        address?: string | null | undefined;
    }> & {
        coordinate: number[];
        address?: string | null | undefined;
    }>;
    phoneNumber: string;
    category: mongoose.Types.ObjectId[];
    socialMedia: mongoose.Types.DocumentArray<{
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }> & {
        instagram?: string | null | undefined;
        Facebook?: string | null | undefined;
        website?: string | null | undefined;
    }>;
    images: string[];
    description?: string | null | undefined;
    companyLogo?: string | null | undefined;
    companyCoverImage?: string | null | undefined;
    pricing?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default CompanyModel;
//# sourceMappingURL=company.d.ts.map