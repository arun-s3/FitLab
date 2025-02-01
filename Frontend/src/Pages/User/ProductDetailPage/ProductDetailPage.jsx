import React, {useEffect, useState, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {Star, Minus, Plus, Heart, ChevronLeft, ChevronRight} from 'lucide-react'
import {toast} from 'react-toastify'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import {SiteSecondaryFillButton} from '../../../Components/SiteButtons/SiteButtons'
import {addToCart, removeFromCart, resetCartStates} from '../../../Slices/cartSlice'
import {CustomHashLoader, CustomScaleLoader} from '../../../Components/Loader//Loader'
import StarGenerator from '../../../Components/StarGenerator/StarGenerator'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import Footer from '../../../Components/Footer/Footer'


const Card = ({children, className})=> (
  <div className={`border rounded-lg shadow-sm ${className}`}> {children} </div>
)

export default function ProductDetailPage(){
  const [quantity, setQuantity] = useState(1)
  const [selectedWeight, setSelectedWeight] = useState(null)
  const [activeTab, setActiveTab] = useState("description")
  const [reviewSort, setReviewSort] = useState("newest")
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [packedupCart, setPackedupCart] = useState({})

  const [productDetails, setProductDetails] = useState({})

  const [currentImageIndex, setCurrentImageIndex] = useState(null)
  const thumbnailRef = useRef(null)

  const location = useLocation()

  const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)
  const dispatch = useDispatch()

  useEffect(()=> {
    if(location?.state?.product){
        console.log("location.state.product-->", location.state.product)
        setProductDetails(location.state.product)
        setSelectedWeight(location.state.product.weights[0])
        const thumbnailIndex = location.state.product.images.findIndex(img=> img.isThumbnail)
        setCurrentImageIndex(thumbnailIndex)
    }
  },[location])

  useEffect(()=> {
    if(error && error.toLowerCase().includes('product')){
      console.log("Error from ProductDetailPage-->", error)
      toast.error(error)
      dispatch(resetCartStates())
    }
    if(productAdded){
      console.log("Product added to cart successfully!")
      // const newItem = {
      //   product,
      //   id: Date.now(),
      //   quantity: quantity,
      //   weight: selectedWeight
      // }
      setPackedupCart(cart)
      setIsCartOpen(true)
      dispatch(resetCartStates())
    }
    if(productRemoved){
      setPackedupCart(cart)
      dispatch(resetCartStates())
    }
  },[error, productAdded, productRemoved, cart])

  const reviews = [
    {
      id: 1,
      name: "Nikhil SM",
      avatar: "https://via.placeholder.com/50",
      rating: 5,
      comment: "The product got delivered a day ago, they are very easy to handle but they have to be handled carefully... Hope they last long, they appear much bigger than most dumbbells but it offers a good grip, while placing the dumbbells back care must be taken..."
    },
    {
      id: 2,
      name: "Sam T",
      avatar: "https://via.placeholder.com/50",
      rating: 5,
      comment: "Super easy to use and makes changing weights a breeze. The weights hold in place quite well after a nice audible click. Their support team is quite active and is very prompt in signing any issues you have. Overall, I would definitely recommend getting these."
    },
    {
      id: 3,
      name: "Ajith Kavil",
      avatar: "https://via.placeholder.com/50",
      rating: 5,
      comment: "I got this looking for adjustable dumbbells and was happy to receive really cool looking dumbbells with great built quality. I find them to be totally worth the money - only hope is that their after sales is good in Kolkata where I'm using the pair."
    }
  ]

  const similarProducts = [
    {
      id: 1,
      name: "Chest Biceps Curler",
      price: "Rs 45,500",
      image: "https://via.placeholder.com/200",
      rating: 5,
      discount: "-20%"
    },
    {
      id: 2,
      name: "PowerKettle Pro 35kg",
      price: "Rs 10,799",
      image: "https://via.placeholder.com/200",
      rating: 5
    },
    {
      id: 3,
      name: "45 Degree Leg Press",
      price: "Rs 83,900",
      image: "https://via.placeholder.com/200",
      rating: 5,
      discount: "-20%"
    },
    {
      id: 4,
      name: "CE 300G Lateral Raise",
      price: "Rs 67,000",
      image: "https://via.placeholder.com/200",
      rating: 5
    }
  ]

  const headerBg = {
        backgroundImage: "url('/header-bg.png')",
        backgrounSize: 'cover'
  }

  const handleReviewSubmit = (e)=> {
    e.preventDefault()
    console.log('Review submitted')
  }

  const sortedReviews = [...reviews].sort((a, b)=> {
    if (reviewSort === 'newest') return b.id - a.id
    if (reviewSort === 'highest') return b.rating - a.rating
    if (reviewSort === 'lowest') return a.rating - b.rating
    return 0
  })

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 2)

  const handlePrevProduct = ()=> {
    setCurrentProductIndex((prevIndex)=>  prevIndex === 0 ? similarProducts.length - 1 : prevIndex - 1)
  }

  const handleNextProduct = ()=> {
    setCurrentProductIndex((prevIndex)=> prevIndex === similarProducts.length - 1 ? 0 : prevIndex + 1)
  }

  const selectImage = (index)=> {
    thumbnailRef.current.src = productDetails.images[index].url
    setCurrentImageIndex(index)
  }
  
  const handleAddToCart = (product) => {
    console.log("Inside handleAddToCart()--")
    dispatch( addToCart({productId: product._id, quantity}) )
    console.log("Dispatched successfully")
    // const newItem = {
    //   product,
    //   id: Date.now(),
    //   quantity: quantity,
    //   weight: selectedWeight
    // }
    // setCartItems([...cartItems, newItem])
    // setIsCartOpen(true)
  }

  const updateQuantity = (id, newQuantity) => {
    // setCartItems(
    //   cartItems.map((item) =>
    //     item.id === id ? { ...item, quantity: newQuantity } : item
    //   )
    // );
    dispatch( addToCart({productId: id, quantity: newQuantity}) )
  };
  

  const removeFromTheCart = (id) => {
    // setCartItems(cartItems.filter(item => item.id !== id)) 
    dispatch(removeFromCart({productId: id}))
  }

  return (
    <section id='ProductDetailPage'>
        <header style={headerBg}>

            <Header />

        </header>

        <BreadcrumbBar heading='Product Details'/>

        <main className='flex gap-[2rem] px-[4rem] mb-[10rem]'>
            <div className="container mx-auto px-[16px] py-[32px]">
              <div className="grid md:grid-cols-2 gap-[3rem]">
                {/* Product Images */}
                <div className="space-y-[16px]">
                  <div className="border rounded-lg p-[16px] bg-white">
                    <img src={Object.keys(productDetails).length ? productDetails?.thumbnail.url : ''} alt="Product Tumbnail"
                      className="w-full h-auto" ref={thumbnailRef}/>
                  </div>
                  <div className="flex gap-[16px]">
                    { Object.keys(productDetails).length &&
                        productDetails.images.map((image, index) => (
                          <img key={image.url} src={image.url} alt={`Product view ${image.name}`}
                              className={`border rounded-lg w-[96px] h-[96px] object-cover cursor-pointer
                                 ${currentImageIndex === index? 'outline outline-2 outline-secondary outline-offset-[2px]' : ''}`} 
                                    onClick={()=> selectImage(index)}/>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-[24px]"> 
                  <div className="space-y-[8px]">
                    <div className="flex items-center gap-[8px]">

                      <StarGenerator product={productDetails} />

                      <span className="text-[14px] text-gray-500">(10 Reviews)</span>
                    </div>
                    <h1 className="text-[24px] font-bold capitalize"> {productDetails.title} </h1>
                    <p className="text-gray-600">
                      {productDetails.subtitle}
                    </p>
                    <div className="text-[24px] font-bold"> &#8377; {productDetails.price} </div>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-medium mb-[8px]">WEIGHT:  <span> {selectedWeight && selectedWeight}KG </span> </h3>
                    <div className="grid grid-cols-2 gap-[8px] gap-x-[1rem]">
                      {productDetails && productDetails.weights &&
                        productDetails.weights.map((weight) => (
                          <SiteSecondaryFillButton key={weight} variant={selectedWeight === weight ? "default" : "outline"}
                              className="w-full" clickHandler={() => setSelectedWeight(weight)}>
                            {weight} KG
                          </SiteSecondaryFillButton>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[16px]">
                    <div className="flex items-center border rounded-md">
                      <SiteSecondaryFillButton variant="ghost" size="icon" customStyle={{paddingInline: '12px'}}
                          clickHandler={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="w-[16px] h-[16px]" />
                      </SiteSecondaryFillButton>
                      <span className="w-[48px] text-center">{quantity}</span>
                      <SiteSecondaryFillButton variant="ghost" size="icon" customStyle={{paddingInline: '12px'}}
                          clickHandler={() => setQuantity(quantity + 1)}>
                        <Plus className="w-[16px] h-[16px]" />
                      </SiteSecondaryFillButton>
                    </div>
                    <SiteSecondaryFillButton variant="outline" size="icon">
                      <Heart className="w-[16px] h-[16px]" />
                    </SiteSecondaryFillButton>
                  </div>
                  
                  <SiteSecondaryFillButton className="w-full bg-[#CCFF00] hover:bg-primary text-black" 
                      clickHandler={()=> handleAddToCart(productDetails)}>
                    { loading? <CustomHashLoader loading={loading}/> : 'Add to Cart' }
                  </SiteSecondaryFillButton>
                </div>
              </div>
                  
              <div className="mt-[64px]">
                <div className="border-b">
                  <nav className="flex space-x-[32px]" aria-label="Tabs">
                    {['Description', 'Additional Info', 'Reviews'].map((tab) => (
                      <button key={tab.toLowerCase()} onClick={() => setActiveTab(tab.toLowerCase())}
                          className={`py-[16px] px-[4px] border-b-2 font-medium text-[14px] 
                              ${activeTab === tab.toLowerCase() ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="mt-[32px]">
                  {activeTab === 'description' && (
                    <div>
                      {productDetails.description &&
                        <>
                          <h2 className="text-[24px] font-bold mb-[16px]">Product Description</h2>
                          <p> {productDetails.description} </p>
                        </>
                      }
                    </div>
                  )}

                  {activeTab === 'additional info' && 
                    productDetails.additionalInformation &&
                      <>
                        <div>
                          <h2 className="text-[24px] font-bold mb-[16px]">Additional Information</h2>
                          <ul className="list-disc list-inside space-y-[8px]">
                            {
                              productDetails.additionalInformation.map(info=> (
                                <li>
                                  {info}
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </>
                  }

                  {activeTab === 'reviews' && (
                    <div>
                      <h2 className="text-[24px] font-bold mb-[16px]">Customer Reviews</h2>
                      <div className="flex justify-between items-center mb-[16px]">
                        <p>{reviews.length} reviews</p>
                        <select value={reviewSort} className="text-[13px] py-[1px] border border-secondary rounded-md p-[8px]"
                             onChange={(e)=> setReviewSort(e.target.value)}>
                          <option value="newest">Newest</option>
                          <option value="highest">Highest Rated</option>
                          <option value="lowest">Lowest Rated</option>
                        </select>
                      </div>
                      <div className="space-y-[24px]">
                        {displayedReviews.map((review) => (
                          <div key={review.id} className="flex gap-[16px]">
                            <img src={review.avatar} alt={review.name} className="w-[48px] h-[48px] rounded-full"/>
                            <div>
                              <h3 className="font-medium">{review.name}</h3>
                              <div className="flex items-center gap-[4px] my-[4px]">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="w-[16px] h-[16px] fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <p className="text-[13px] text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!showAllReviews && reviews.length > 2 && ( 
                        <SiteSecondaryFillButton className="mt-[16px] text-[14px]" onClick={() => setShowAllReviews(true)}>
                          Load more
                        </SiteSecondaryFillButton>
                      )}
                      <form onSubmit={handleReviewSubmit} className="mt-[32px]">
                        <h3 className="text-[18px] font-medium mb-[16px]">Write a Review</h3>
                        <div className="space-y-[16px]">
                          <div>
                            <label htmlFor="rating" className="block text-[14px] font-medium text-gray-700">
                              Rating
                            </label>
                            <select id="rating" name="rating"
                                className="mt-[4px] block w-full pl-[12px] pr-[40px] py-[8px] text-[14px] border-gray-300
                                             focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md">
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating} Star{rating !== 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="comment" className="block text-[14px] font-medium text-gray-700">
                              Comment
                            </label>
                            <textarea id="comment" name="comment" rows={3} className="mt-[4px] block w-full text-[14px]
                               border-gray-300 rounded-md" placeholder="Write your review here..."/>
                          </div>
                          <SiteSecondaryFillButton type="submit">Submit Review</SiteSecondaryFillButton>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-[64px] relative">
                <h2 className="text-[24px] font-bold mb-[32px]">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[24px]">
                  {similarProducts.slice(currentProductIndex, currentProductIndex + 4).map((product) => (
                    <Card key={product.id} className="relative">
                      {product.discount && (
                        <span className="absolute top-[8px] left-[8px] bg-purple-600 text-white px-[8px] py-[4px] rounded-md text-[14px]">
                          {product.discount}
                        </span>
                      )}
                      <div className="p-[16px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-auto mb-[16px]"
                        />
                        <div className="flex items-center gap-[4px] mb-[8px]">
                          {Array.from({length: product.rating}).map((_, i) => (
                            <Star key={i} className="w-[16px] h-[16px] fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="font-bold mt-[4px]">{product.price}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-[8px] rounded-full shadow-md"
                  onClick={handlePrevProduct}>
                  <ChevronLeft className="w-[24px] h-[24px]" />
                </button>
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-[8px] rounded-full shadow-md"
                  onClick={handleNextProduct}>
                  <ChevronRight className="w-[24px] h-[24px]" />
                </button>
              </div>

              <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} packedupCart={packedupCart} 
                  updateQuantity={updateQuantity} removeFromTheCart={removeFromTheCart} />

            </div>

        </main>
        
        <Footer/>

    </section>
  )
}


