import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/authorContext';
import Layout from './layout/MainLayout';
import ProductsPage from './pages/productPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import CategoryListForm from './pages/CategoryListForm';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/categories" element={<CategoryListForm />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;