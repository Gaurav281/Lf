// components/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { 
  Lock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    telegramLink: '',
    tags: '',
    price: 0,
    rating: 0,
    downloads: 0
  });

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        fetchProducts();
        fetchStats();
      } else {
        alert('Invalid password!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/stats`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const productData = {
        ...newProduct,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ 
          password,
          ...productData 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts([...products, data.product]);
        setShowAddForm(false);
        setNewProduct({
          title: '',
          description: '',
          telegramLink: '',
          tags: '',
          price: 0,
          rating: 0,
          downloads: 0
        });
        alert('Product added successfully!');
        fetchStats();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted successfully!');
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Run seed data
  const runSeedData = async () => {
    if (!confirm('This will replace all existing products with seed data. Continue?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const seedData = [
        // ... (same as initialProducts array from seed.js)
      ];
      
      const response = await fetch(`${API_BASE}/admin/products/bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({ 
          password,
          products: seedData 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.count} products seeded successfully!`);
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthenticated(true);
      fetchProducts();
      fetchStats();
    }
  }, []);

  // Login form
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-6">
              Default password: admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your products and view statistics</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={runSeedData}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Seed Data
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              setAuthenticated(false);
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <div className="text-sm text-gray-400">Total Products</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(stats.totalDownloads / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-400">Total Downloads</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.latestProducts.length}</div>
                <div className="text-sm text-gray-400">Recent</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="mb-8 bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Product Title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
              
              <input
                type="text"
                placeholder="Telegram Link"
                value={newProduct.telegramLink}
                onChange={(e) => setNewProduct({...newProduct, telegramLink: e.target.value})}
                className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
              
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              
              <input
                type="number"
                placeholder="Downloads"
                value={newProduct.downloads}
                onChange={(e) => setNewProduct({...newProduct, downloads: parseInt(e.target.value) || 0})}
                className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-4"
              required
            />
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
              
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Products ({products.length})</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm text-gray-300">{product.downloads.toLocaleString()} downloads</div>
                    <div className="text-xs text-gray-500">Rating: {product.rating}/5</div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-red-600/20 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}