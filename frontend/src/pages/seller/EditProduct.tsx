import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Sparkles, Loader, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [imageInput, setImageInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        const prod = response.data;
        setName(prod.name || '');
        setDescription(prod.description || '');
        setPrice(prod.price?.toString() || '');
        setStock(prod.stock?.toString() || '');
        setCategory(prod.category || 'Electronics');
        setImageInput(prod.images?.[0] || '');
      } catch (err) {
        addToast('Error loading product data', 'error');
        navigate('/seller/products');
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id, navigate, addToast]);

  const handleGenerateAiDescription = async () => {
    if (!name.trim()) {
      return addToast('Please enter a product name first.', 'warning');
    }

    setIsAiLoading(true);
    try {
      const response = await api.post('/api/ai/generate-description', {
        productName: name,
      });
      setDescription(response.data.result);
      addToast('AI Description generated successfully!', 'success');
    } catch (err) {
      // Local fallback simulation
      const fallbackDesc = `Premium brand new ${name}.\n\nFeatures:\n1. Elite ergonomics\n2. Durable build quality\n3. Hyperlocal platform warranty\n4. Verified vendor supply\n5. Fluid design parameters\n\nBuy today from local verified partners.`;
      setDescription(fallbackDesc);
      addToast('AI Simulation: Created localized description blueprint.', 'info');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !stock || !category) {
      return addToast('Please fill out all required fields.', 'warning');
    }

    setIsLoading(true);
    try {
      const imagesList = imageInput.trim() ? [imageInput.trim()] : [];
      await api.put(`/api/products/${id}`, {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: imagesList,
      });

      addToast('Product updated successfully!', 'success');
      navigate('/seller/products');
    } catch (err) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
      {/* Title block */}
      <div>
        <button
          onClick={() => navigate('/seller/products')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Catalog
        </button>
        <h1 className="font-display font-black text-3xl text-slate-800">Edit Product Listing</h1>
        <p className="text-xs text-slate-500">Update product specifics and manage catalog details.</p>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-500">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., RGB Mechanical Gaming Keyboard"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* AI Description generation tool */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase text-slate-500">Product Description</label>
            <button
              type="button"
              disabled={isAiLoading}
              onClick={handleGenerateAiDescription}
              className="btn-3d btn-3d-ai btn-shimmer-wrap disabled:opacity-50 text-[10px] px-3.5 py-1.5 flex items-center gap-1 scale-90"
            >
              {isAiLoading ? (
                <Loader className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              )}
              Regenerate with AI
            </button>
          </div>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type details or use AI tool above..."
            className="w-full border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Category & Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500">Catalog Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-800"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500">Thumbnail Image URL</label>
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500">Price tag (INR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2999"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500">Supply stock volume</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-3d btn-3d-seller btn-shimmer-wrap disabled:opacity-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs"
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
