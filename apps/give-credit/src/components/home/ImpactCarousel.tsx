'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import InitiativeCardCompactShort from '../InitiativeCardCompactShort'

export default function ImpactCarousel(props:any) {
  const initiatives = props.initiatives
  const innerWidth = typeof window !== "undefined" ? window.innerWidth : 1366
  const [screenWidth, setScreenWidth] = useState(innerWidth)
  const setDimension = () => { setScreenWidth(innerWidth) }

  useEffect(() => {
    if(typeof window !== "undefined"){
      window.addEventListener('resize', setDimension)
      return () => {
        window.removeEventListener('resize', setDimension)
      }
    }
  }, [screenWidth])

  const slideCount = screenWidth / 400

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
      { initiatives.map((initiative:any) => {
        return (
          <SwiperSlide key={initiative.id}>
            <InitiativeCardCompactShort initiative={initiative} />
          </SwiperSlide>
        )
      }) }
      </Swiper>
    </div>
  )
}
