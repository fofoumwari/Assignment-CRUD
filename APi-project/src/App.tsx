import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import ProductsPage from "./pages/ProductsPage";
import ProductsPage from "./pages/productPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/authorContext";
import ProductDetails from "./pages/ProductList";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
             <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
