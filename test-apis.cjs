const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';
let testProductId = '';
let testCollectionId = '';

async function testAPIs() {
  try {
    console.log('Testing APIs...\\n');

    // 1. Test registration
    console.log('1. Testing registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✓ Registration successful');
      authToken = registerResponse.data.token;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('✓ User already exists, continuing with login...');
        // Try login instead
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✓ Login successful');
        authToken = loginResponse.data.token;
      } else {
        throw error;
      }
    }

    // 2. Test login
    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✓ Login successful');
    
    // 3. Test get user profile
    console.log('3. Testing get user profile...');
    const userProfileResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ User profile retrieved successfully');

    // 4. Test update user profile
    console.log('4. Testing update user profile...');
    const updateUserResponse = await axios.put(`${BASE_URL}/users/me`, {
      fullName: 'Updated Test User'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✓ User profile updated successfully');

    // 5. Test get products
    console.log('5. Testing get products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log('✓ Products retrieved successfully');

    // 6. Test get categories
    console.log('6. Testing get categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
    console.log('✓ Categories retrieved successfully');

    // 7. Test get brands
    console.log('7. Testing get brands...');
    const brandsResponse = await axios.get(`${BASE_URL}/brands`);
    console.log('✓ Brands retrieved successfully');

    // 8. Test get collections
    console.log('8. Testing get collections...');
    const collectionsResponse = await axios.get(`${BASE_URL}/collections`);
    console.log('✓ Collections retrieved successfully');

    // 9. Test get cart
    console.log('9. Testing get cart...');
    const cartResponse = await axios.get(`${BASE_URL}/cart`);
    console.log('✓ Cart retrieved successfully');

    // 10. Test search
    console.log('10. Testing search...');
    const searchResponse = await axios.get(`${BASE_URL}/search?q=test`);
    console.log('✓ Search completed successfully');

    // 11. Test blog posts
    console.log('11. Testing blog posts...');
    const blogPostsResponse = await axios.get(`${BASE_URL}/blog`);
    console.log('✓ Blog posts retrieved successfully');

    // 12. Test blog categories
    console.log('12. Testing blog categories...');
    const blogCategoriesResponse = await axios.get(`${BASE_URL}/blog/categories`);
    console.log('✓ Blog categories retrieved successfully');

    // 13. Test checkout session
    console.log('13. Testing checkout session...');
    const checkoutSessionResponse = await axios.get(`${BASE_URL}/checkout/session/test`);
    console.log('✓ Checkout session retrieved successfully');

    // 14. Test apply coupon
    console.log('14. Testing apply coupon...');
    try {
      const couponResponse = await axios.post(`${BASE_URL}/coupons/apply`, {
        code: 'TEST',
        cartId: '123'
      });
      console.log('✓ Coupon applied successfully');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Coupon not found (expected)');
      } else {
        throw error;
      }
    }

    // 15. Test product reviews
    console.log('15. Testing product reviews...');
    const productReviewsResponse = await axios.get(`${BASE_URL}/products/test/reviews`);
    console.log('✓ Product reviews retrieved successfully');

    // 16. Test collection products
    console.log('16. Testing collection products...');
    const collectionProductsResponse = await axios.get(`${BASE_URL}/collections/test/products`);
    console.log('✓ Collection products retrieved successfully');

    console.log('\\n🎉 All API tests completed successfully!');
  } catch (error) {
    console.error('Error testing APIs:', error.response ? error.response.data : error.message);
  }
}

// Run the tests
testAPIs();