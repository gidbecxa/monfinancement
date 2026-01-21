'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

export default function FamiliesCarousel() {
  const familyImages = [1, 2, 3, 4, 5]

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={true}
        loop={true}
        className="rounded-2xl shadow-2xl overflow-hidden"
      >
        {familyImages.map((num) => (
          <SwiperSlide key={num}>
            <div className="relative w-full h-96 md:h-[500px]">
              <Image
                src={`/images/families/family-${num}.jpg`}
                alt={`Happy family ${num}`}
                fill
                className="object-cover"
                priority={num === 1}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
