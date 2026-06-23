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
      .get("http://localhost:5000/api/home/banners")
      .then((res) => setBanners(res.data.banners))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation
      loop={banners.length > 1}
      className="h-[450px]"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={banner._id || index}>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="bg-black/60 p-6 rounded-xl text-center">
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
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
