import mongoose from "mongoose";
import categoryModel from "../model/category";
await mongoose.connect(process.env.MONGODB_URL);
const categories = [
    { name: "Family", group: "Type" },
    { name: "Friends", group: "Type" },
    { name: "Couple", group: "Type" },
    { name: "Easy", group: "Difficulty" },
    { name: "Medium", group: "Difficulty" },
    { name: "Hard", group: "Difficulty" },
    { name: "Basketball", group: "Activity" },
    { name: "Badminton", group: "Activity" },
    { name: "Volleyball", group: "Activity" },
    { name: "Tennis", group: "Activity" },
    { name: "Table Tennis", group: "Activity" },
    { name: "Ice Hockey", group: "Activity" },
    { name: "Skateboarding", group: "Activity" },
    { name: "Skiing", group: "Activity" },
    { name: "Snowboarding", group: "Activity" },
    { name: "Cycling", group: "Activity" },
];
await categoryModel.insertMany(categories);
process.exit();
//# sourceMappingURL=seedCategories.js.map