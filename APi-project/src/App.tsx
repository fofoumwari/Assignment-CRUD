import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProductsPage from "./pages/productPage";
import ProductDetails from "./pages/ProductList";
import CategoryListForm from "./pages/CategoryListForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<CategoryListForm />} />
          {/* More routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;