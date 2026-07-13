import React, { useState, useRef } from 'react';
import { 
  Save, 
  Store, 
  FileText, 
  Image, 
  Globe, 
  Edit2, 
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Building2,
  Palette,
  Tag,
  Eye
} from 'lucide-react';

const StoreSettings = () => {
  const [formData, setFormData] = useState({
    storeName: "Zaalima Luxury Apparel",
    description: "Premium multi-tenant traditional and streetwear boutique collections.",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
  });

  const [isEditing, setIsEditing] = useState({
    storeName: false,
    description: false,
    logoUrl: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset error state when user types
    if (saveStatus) setSaveStatus(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setFormData((prev) => ({ ...prev, logoUrl: imageUrl }));
      setLogoPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Updating tenant settings via PUT ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/stores`, formData);
      setSaveStatus('success');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoError = () => {
    setLogoPreviewError(true);
  };

  const handleReset = () => {
    setFormData({
      storeName: "Zaalima Luxury Apparel",
      description: "Premium multi-tenant traditional and streetwear boutique collections.",
      logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
    });
    setLogoPreviewError(false);
    setSaveStatus(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-400" />
              Store Settings
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Configure your public storefront branding identity parameters
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition"
            >
              Reset Changes
            </button>
          </div>
        </div>

        {/* Save Status Alert */}
        {saveStatus && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            saveStatus === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {saveStatus === 'success' 
                ? 'Store settings saved successfully!' 
                : 'Failed to save settings. Please try again.'}
            </span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Store Name Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">
                  Store Brand Name
                </label>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-11"
                  placeholder="Enter your store name"
                  required 
                />
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  {formData.storeName.length}/50
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-1">
                This name will appear in your storefront header and browser tabs
              </p>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">
                  Bio / Public Description
                </label>
              </div>
              <div className="relative">
                <textarea 
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Describe your store and what makes it unique..."
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {formData.description.length}/200
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-1">
                A compelling description helps customers understand your brand
              </p>
            </div>

            {/* Logo Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">
                  Branding Logo Asset URL
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input 
                      type="url" 
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xs text-slate-300 pl-11 pr-24"
                      placeholder="https://example.com/logo.png"
                      required 
                    />
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition"
                      >
                        <Upload className="w-3.5 h-3.5 inline mr-1" />
                        Upload
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    Enter a URL or upload an image from your device
                  </p>
                </div>

                {/* Logo Preview Card */}
                <div className="md:w-56 bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                    {formData.logoUrl && !logoPreviewError ? (
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover"
                        onError={handleLogoError}
                      />
                    ) : (
                      <Store className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">
                      Logo Preview
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {logoPreviewError ? 'Invalid image URL' : 'Live preview'}
                    </p>
                    {logoPreviewError && (
                      <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Invalid URL
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Logo Suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-500">Quick templates:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8" 
                    }));
                    setLogoPreviewError(false);
                  }}
                  className="px-2.5 py-1 bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-400 rounded-lg transition"
                >
                  Fashion
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      logoUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b" 
                    }));
                    setLogoPreviewError(false);
                  }}
                  className="px-2.5 py-1 bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-400 rounded-lg transition"
                >
                  Tech
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      logoUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc" 
                    }));
                    setLogoPreviewError(false);
                  }}
                  className="px-2.5 py-1 bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-400 rounded-lg transition"
                >
                  Lifestyle
                </button>
                <span className="text-xs text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logoUrl: "" }));
                    setLogoPreviewError(false);
                  }}
                  className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                  <span>All fields required</span>
                </div>
                <span className="text-slate-700">|</span>
                <span>Changes saved automatically</span>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition"
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Tag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Need help with your store settings?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your store name and logo appear across your storefront. For best results, 
                use a square logo (1:1 ratio) and keep your description under 200 characters.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">
                  View Storefront
                </a>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">
                  Brand Guidelines
                </a>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;