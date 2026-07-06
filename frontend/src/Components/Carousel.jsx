import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Carousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/home/banners")
      .then((res) => setBanners(res.data.banners))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        navigation
        loop={banners.length > 1}
        observer={true}
        observeParents={true}
        watchOverflow={true}
        className="w-full h-[450px]"
      >
      {banners.map((banner, index) => (
        <SwiperSlide key={banner._id || index}>
          <div className="h-full relative bg-slate-800">
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="bg-black/60 p-6 rounded-xl text-center max-w-lg">
                <h1 className="text-4xl font-bold text-white mb-3">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-lg text-gray-200 mb-5">{banner.subtitle}</p>
                )}
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
};

export default Carousel;
