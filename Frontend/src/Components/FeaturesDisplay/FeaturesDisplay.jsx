import React from 'react'


export default function FeaturesDisplay({darkVariant = false, topRoom = true}){


  const features = [
    {
      title: 'Product Support',
      description: 'Up to 3 years on-site warranty available for your peace of mind.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    },
    {
      title: 'Personal Account',
      description: 'With big discounts, free delivery and a dedicated support specialist.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    },
    {
      title: 'Amazing Savings',
      description: 'Up to 70% off new Products, you can be sure of the best price.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    }
  ]

  const darkBg = {
    background: 'linear-gradient(#240c34, black)'
  }

    
    return(
        <div className={`mb-[1rem] grid grid-cols-1 md:grid-cols-3 gap-[2rem] ${topRoom && 'mt-[4rem]'} p-[2rem]
           ${!darkVariant && 'rounded-[8px]'}`}
            style={darkVariant ? darkBg : {background: '#F8F1FF'}}>
          {
           features && features.length > 0 && features.map(feature=> (
              <div className="text-center">
                <div className="w-[4rem] h-[4rem] bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-[1rem]">
                  <svg className="w-[2rem] h-[2rem] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className={`font-bold mb-[8px] ${darkVariant ? 'text-white' : 'text-black'}`}> {feature.title} </h3>
                <p className={`text-[14px] ${darkVariant ? 'text-[#cdc8c8]' : 'text-gray-600'}`}>
                 {feature.description}
                </p>
              </div>
           )) 
          }
        </div>
    )
}