import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldAlert, Sparkles, MessageSquare, ShoppingCart, Send, Box, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { ProductCard } from './Home';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [product, setProduct] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const prodRes = await api.get(`/api/products/${id}`);
        setProduct(prodRes.data);

        try {
          const revRes = await api.get(`/api/products/reviews/${id}`);
          setReviews(revRes.data || []);
        } catch (err) {
          // Handled silently
        }

        try {
          const recRes = await api.get(`/api/ai/recommendations/${id}`);
          setRecommendations(recRes.data.recommendations || []);
        } catch (err) {
          // Handled silently
        }
      } catch (err) {
        addToast('Failed to load product details.', 'error');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDetails();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      addToast('Please log in to add items to your cart.', 'warning');
      return navigate('/role-selection');
    }
    try {
      await api.post('/api/cart/add', {
        productId: id,
        quantity,
      });
      // Synchronize Zustand shopping cart
      await useCartStore.getState().fetchCart();
      addToast('Successfully added item to cart.', 'success');
    } catch (err) {
      // Axios error interceptor handles it
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return addToast('Please log in to write a review.', 'warning');
    }
    if (!comment.trim()) {
      return addToast('Please enter feedback comment.', 'warning');
    }

    setIsSubmittingReview(true);
    try {
      await api.post(`/api/products/review/${id}`, {
        rating,
        comment,
      });
      addToast('Review submitted successfully!', 'success');
      setComment('');
      
      // Reload reviews and product score
      const revRes = await api.get(`/api/products/reviews/${id}`);
      setReviews(revRes.data || []);
      const prodRes = await api.get(`/api/products/${id}`);
      setProduct(prodRes.data);
    } catch (err) {
      // Interceptor handles duplicate review errors
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Box className="w-12 h-12 text-indigo-650 animate-bounce mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading catalog item details...</p>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

  return (
    <div className="space-y-16">
      {/* Product Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 card-premium-gradient p-8 rounded-3xl">
        {/* Gallery Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 relative group shadow-sm">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Purchase Options */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-4">
              {product.category}
            </span>

            <h1 className="font-display font-black text-3xl text-slate-900 mb-2">{product.name}</h1>
            
            {/* Seller stats */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-500">Seller:</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-555" /> {product.sellerName || 'Verified Vendor'}
              </span>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">({product.rating || '0.0'})</span>
              <span className="text-xs text-slate-500">· {product.reviewsCount || 0} reviews</span>
            </div>

            <p className="text-sm text-slate-650 leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>
          </div>

          <div>
            {/* Price block */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display font-black text-3xl text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">Inclusive of all local platform charges</span>
            </div>

            {/* Stock Actions */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-slate-550 hover:text-slate-900 font-black cursor-pointer transition-all duration-100 hover:scale-125 active:scale-75"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-slate-550 hover:text-slate-900 font-black cursor-pointer transition-all duration-100 hover:scale-125 active:scale-75"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{product.stock} items left in stock</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-3d btn-3d-buyer btn-shimmer-wrap font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add Product to Cart
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-xs font-bold">Temporarily Out of Stock</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews & Feedback Form */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-500" /> Customer Feedbacks ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev._id} className="card-premium-gradient p-5 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
                        {rev.userName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center card-premium-gradient rounded-2xl">
              <p className="text-xs text-slate-500">No reviews listed yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Rating Submission Form */}
        <div className="card-premium-gradient p-6 rounded-2xl space-y-4">
          <h3 className="font-display text-lg font-black text-slate-900">Share Your Experience</h3>
          <p className="text-xs text-slate-500">Submit a verified review comment and score for this product.</p>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-slate-500">Select Rating Score</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="p-1 transition-colors cursor-pointer"
                  >
                    <Star className={`w-6 h-6 ${val <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-slate-500">Feedback comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain what you like or dislike about this product..."
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs bg-white text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full btn-3d btn-3d-buyer font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Feedback'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* AI Recommendations Slider */}
      {recommendations.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-100">
          <div>
            <h3 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-550 animate-pulse" /> AI Smart Recommendations
            </h3>
            <p className="text-xs text-slate-500">Predictive recommendations calculated dynamically using active categories.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((rec) => (
              <ProductCard key={rec._id || rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default ProductDetails;
