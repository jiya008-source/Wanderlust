require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLAS_URL;

main().catch((err) => console.log("❌ DB connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB Atlas");
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("🧹 Deleted old listings");

  const user = await User.findOne({ username: "jiya" });

  if (!user) {
    console.log("❌ User 'jiya' not found. Please register first.");
    return;
  }

  const listingsWithOwner = initData.data.map((listing) => ({
    ...listing,
    owner: user._id,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log(`✅ ${listingsWithOwner.length} listings seeded with owner: ${user.username}`);
};

initDB();
