import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  ProductsPage  from '../pages/productPage';
import ProductDetails from '../pages/ProductList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
