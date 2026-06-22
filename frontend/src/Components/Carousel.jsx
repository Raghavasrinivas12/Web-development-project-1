import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Carousel = () => {
  const banners = [
    {
      title: "Mega Sale 2026",
      subtitle: "Up to 70% Off on Electronics",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      title: "Fashion Collection",
      subtitle: "Latest Trends at Best Prices",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    },
    {
      title: "ShopHub Marketplace",
      subtitle: "Many Stores, One Hub",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
    },
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation
      loop={true}
      className="h-[500px]"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `url(${banner.image})`,
            }}
          >
            <div className="bg-black/60 p-8 rounded-xl text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                {banner.title}
              </h1>

              <p className="text-xl text-gray-200 mb-6">
                {banner.subtitle}
              </p>

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
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