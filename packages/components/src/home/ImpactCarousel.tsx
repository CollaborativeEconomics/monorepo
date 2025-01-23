'use client';

import type { Initiative } from '@cfce/database';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import InitiativeCardCompactShort from '~/initiative/InitiativeCardCompactShort';

export default function ImpactCarousel(props: { initiatives: Initiative[] }) {
  const initiatives = props.initiatives;
  return (
    <div className="relative left-0 right-0">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        className="impactCarousel"
        centeredSlides={true}
        navigation={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[Autoplay, Pagination, Navigation]}
        speed={800}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          800: {
            slidesPerView: 2,
          },
          976: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
          1440: {
            slidesPerView: 3,
          },
        }}
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
