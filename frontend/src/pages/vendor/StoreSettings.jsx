import React, { useState } from 'react';

const StoreSettings = () => {
  const [formData, setFormData] = useState({
    storeName: "Zaalima Luxury Apparel", // Aligned with storeName schema path
    description: "Premium multi-tenant traditional and streetwear boutique collections.",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Updating tenant settings via PUT ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/stores`, formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Store Settings</h1>
          <p className="text-slate-400 mt-1">Configure your public storefront branding identity parameters.</p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Store Brand Name</label>
              <input 
                type="text" 
                name="storeName" // Exact schema case synchronization
                value={formData.storeName}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Bio / Public Description</label>
              <textarea 
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Branding Logo Asset URL</label>
              <input 
                type="url" 
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono text-xs text-slate-300"
                required 
              />
              
              {formData.logoUrl && (
                <div className="mt-4 flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo Preview" 
                    className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-xs text-slate-400">
                    <p className="font-semibold text-slate-300">Live Asset Map Preview</p>
                    <p>Renders active storefront brand resolution thumbnail</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-6 flex justify-end">
              <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-md transition cursor-pointer">
                Save Configuration Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;