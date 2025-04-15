import React from 'react'
import { assets, features } from '../assets/assets'

const BotttomBanner = () => {
  return (
    <div className='relative mt-24'>
        <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block' />
        <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden' />
        <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24'>
            <div>
                <h1 className='text-2xl md:text-3xl font-semibold mb-6 text-primary'>Why We Are the Best</h1>
                {
                    features.map((feature,index)=>(
                        <div className='flex items-center gap-4 mt-2' key={index}>
                            <img src={feature.icon} alt={feature.title} className='md:w-11 w-9' />
                            <div>
                            <h3 className='text-lg md:text-xl font-semibold'>{feature.title}</h3>
                            <p className='text-gray-500/70 text-xs md:text-sm'>{feature.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default BotttomBanner