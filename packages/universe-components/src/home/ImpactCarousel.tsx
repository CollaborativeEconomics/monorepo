'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Initiative } from '@cfce/database';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import InitiativeCardCompactShort from '../initiative/InitiativeCardCompactShort';

export default function ImpactCarousel(props: { initiatives: Initiative[] }) {
  const initiatives = props.initiatives;
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1366;
  const [screenWidth, setScreenWidth] = useState(innerWidth);
  const setDimension = useCallback(() => {
    setScreenWidth(innerWidth);
  }, [innerWidth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', setDimension);
      return () => {
        window.removeEventListener('resize', setDimension);
      };
    }
  }, [setDimension]);

  const slideCount = screenWidth / 400;

  return (
    <div className="relative left-0 right-0">
      <Swiper
        slidesPerView={slideCount}
        spaceBetween={30}
        pagination={{ clickable: true }}
        className="impactCarousel"
        centeredSlides={true}
        navigation={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[Autoplay, Pagination, Navigation]}
        speed={800}
        loop
      >
        {initiatives.map(initiative => {
          return (
            <SwiperSlide key={initiative.id}>
              <InitiativeCardCompactShort initiative={initiative} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
