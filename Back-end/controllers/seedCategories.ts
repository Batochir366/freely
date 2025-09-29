const mongoose = require("mongoose");
const categoryModel = require("../model/category").default;

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);

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
    console.log("Categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
