import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddTool from './pages/AddTool';
import EditTool from './pages/EditTool';
import ToolDetail from './pages/ToolDetail';
import QRGenerator from './pages/QRGenerator';
import { InventoryProvider } from './context/InventoryContext';

function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTool />} />
            <Route path="/edit/:id" element={<EditTool />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
            <Route path="/generator" element={<QRGenerator />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </InventoryProvider>
  );
}

export default App;
