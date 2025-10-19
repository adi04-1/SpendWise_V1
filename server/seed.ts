import { storage } from "./storage";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create default users
    console.log("Creating default users...");
    const admin = await storage.createUser({
      username: "admin",
      fullName: "Administrator",
      firstName: "Admin",
      role: "admin",
    });
    console.log(`✓ Created admin user: ${admin.id}`);

    const adi = await storage.createUser({
      username: "adi",
      mobileNumber: "1234567890",
      fullName: "Adi Kumar",
      firstName: "Adi",
      shortName: "AD",
      role: "standard",
    });
    console.log(`✓ Created user Adi: ${adi.id}`);

    // Create default categories with colors
    console.log("\nCreating default categories...");
    const shopping = await storage.createCategory({
      name: "Shopping",
      color: "hsl(280 60% 60%)",
    });
    console.log(`✓ Created category: Shopping`);

    const food = await storage.createCategory({
      name: "Food",
      color: "hsl(25 75% 55%)",
    });
    console.log(`✓ Created category: Food`);

    const bills = await storage.createCategory({
      name: "Bills",
      color: "hsl(200 60% 50%)",
    });
    console.log(`✓ Created category: Bills`);

    const others = await storage.createCategory({
      name: "Others",
      color: "hsl(160 50% 50%)",
    });
    console.log(`✓ Created category: Others`);

    const misc = await storage.createCategory({
      name: "Misc",
      color: "hsl(45 70% 55%)",
    });
    console.log(`✓ Created category: Misc`);

    // Create default subcategories
    console.log("\nCreating default subcategories...");
    await storage.createSubcategory({
      categoryId: shopping.id,
      name: "Amazon",
    });
    await storage.createSubcategory({
      categoryId: shopping.id,
      name: "Flipkart",
    });
    await storage.createSubcategory({
      categoryId: shopping.id,
      name: "Swiggy Instamart",
    });
    await storage.createSubcategory({
      categoryId: shopping.id,
      name: "Store",
    });
    console.log(`✓ Created 4 subcategories for Shopping`);

    await storage.createSubcategory({
      categoryId: food.id,
      name: "Swiggy",
    });
    await storage.createSubcategory({
      categoryId: food.id,
      name: "Restaurant",
    });
    await storage.createSubcategory({
      categoryId: food.id,
      name: "Groceries",
    });
    console.log(`✓ Created 3 subcategories for Food`);

    await storage.createSubcategory({
      categoryId: bills.id,
      name: "Electricity",
    });
    await storage.createSubcategory({
      categoryId: bills.id,
      name: "Internet",
    });
    await storage.createSubcategory({
      categoryId: bills.id,
      name: "Phone",
    });
    console.log(`✓ Created 3 subcategories for Bills`);

    // Create default payment modes
    console.log("\nCreating default payment modes...");
    await storage.createPaymentMode({ name: "Cash" });
    await storage.createPaymentMode({ name: "Credit Card" });
    await storage.createPaymentMode({ name: "Debit Card" });
    await storage.createPaymentMode({ name: "GPay/UPI" });
    console.log(`✓ Created 4 payment modes`);

    // Create default made-for entities
    console.log("\nCreating default made-for entities...");
    await storage.createMadeForEntity({ name: "Personal" });
    await storage.createMadeForEntity({ name: "Shared" });
    await storage.createMadeForEntity({ name: "Amma" });
    console.log(`✓ Created 3 made-for entities`);

    // Create sample year for Adi
    console.log("\nCreating sample year for Adi...");
    const year2025 = await storage.createYear({
      userId: adi.id,
      year: 2025,
      budget: "600000",
    });
    console.log(`✓ Created year 2025 for Adi`);

    // Create sample months
    console.log("\nCreating sample months...");
    const october = await storage.createMonth({
      yearId: year2025.id,
      monthName: "October",
      monthNumber: 10,
      budget: "50000",
    });
    console.log(`✓ Created October 2025`);

    const september = await storage.createMonth({
      yearId: year2025.id,
      monthName: "September",
      monthNumber: 9,
      budget: "50000",
    });
    console.log(`✓ Created September 2025`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDefault credentials:");
    console.log(`  Admin user ID: ${admin.id}`);
    console.log(`  Adi user ID: ${adi.id}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
