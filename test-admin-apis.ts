// Test admin APIs
async function testAdminAPIs() {
  try {
    // Test dashboard analytics
    console.log("Testing dashboard analytics...");
    const analyticsRes = await fetch("http://localhost:5000/api/admin/dashboard/analytics");
    const analyticsData = await analyticsRes.json();
    console.log("Dashboard analytics:", JSON.stringify(analyticsData, null, 2));
    
    // Test orders
    console.log("Testing orders...");
    const ordersRes = await fetch("http://localhost:5000/api/admin/orders");
    const ordersData = await ordersRes.json();
    console.log("Orders:", JSON.stringify(ordersData, null, 2));
    
    // Test products
    console.log("Testing products...");
    const productsRes = await fetch("http://localhost:5000/api/admin/products");
    const productsData = await productsRes.json();
    console.log("Products:", JSON.stringify(productsData, null, 2));
    
    // Test categories
    console.log("Testing categories...");
    const categoriesRes = await fetch("http://localhost:5000/api/admin/categories");
    const categoriesData = await categoriesRes.json();
    console.log("Categories:", JSON.stringify(categoriesData, null, 2));
    
  } catch (error) {
    console.error("Error testing admin APIs:", error);
  }
}

testAdminAPIs();