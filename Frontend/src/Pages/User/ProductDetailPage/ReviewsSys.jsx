import React, {useState, useMemo} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import {Star} from 'lucide-react'

import {SiteSecondaryFillButton} from '../../../Components/SiteButtons/SiteButtons'


export default function ReviewsPanel({onReviewSubmit}){

    const [reviewSort, setReviewSort] = useState("newest")
    const [showAllReviews, setShowAllReviews] = useState(false)

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

    const fadeUp = {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
    }

    const INITIAL_COUNT = 2

    const sortedReviews = [...reviews].sort((a, b)=> {
      if (reviewSort === 'newest') return b.id - a.id
      if (reviewSort === 'highest') return b.rating - a.rating
      if (reviewSort === 'lowest') return a.rating - b.rating
      return 0
    })

    const displayedReviews = useMemo(()=> 
      (showAllReviews ? reviews : reviews.slice(0, INITIAL_COUNT)),
      [reviews, showAllReviews]
    )

    const handleReviewSubmit = (e)=> {
      e.preventDefault()
      console.log('Review submitted')
    }
    

    return(
        <section>
            <motion.h2 
              className="text-[17px] font-bold mb-[16px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
               Customer Reviews 
            </motion.h2>
            <motion.div 
              className="flex justify-between items-center mb-[16px]"
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <p> {reviews.length} reviews </p>
              <select 
                value={reviewSort} 
                className="text-[13px] py-[1px] border border-secondary rounded-md p-[8px]"
                onChange={(e)=> setReviewSort(e.target.value)}
                >
                    <option value="newest"> Newest </option>
                    <option value="highest"> Highest Rated </option>
                    <option value="lowest"> Lowest Rated </option>
              </select>
            </motion.div>
            <div className="space-y-[24px]">
              <AnimatePresence>
              {
                displayedReviews.map((review)=> (
                  <motion.div key={review.id} 
                      className="flex gap-[16px]"
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                  >
                    <img src={review.avatar} 
                      alt={review.name} 
                      className="w-[48px] h-[48px] rounded-full"
                     />
                    <div>
                      <h3 className="font-medium"> {review.name} </h3>
                      <div className="flex items-center gap-[4px] my-[4px]">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-[16px] h-[16px] fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-[13px] text-gray-600"> {review.comment} </p>
                    </div>
                  </motion.div>
                ))
              }
              </AnimatePresence>
            </div>
            {!showAllReviews && reviews.length > INITIAL_COUNT && ( 
              <motion.div
                // className="mt-[16px]"
                initial="hidden"
                animate="show"
                variants={fadeUp}
              >
                <SiteSecondaryFillButton 
                  className="mt-[16px] text-[14px]" 
                  onClick={() => setShowAllReviews(true)}
                  >
                      Load more
                </SiteSecondaryFillButton>
              </motion.div>
            )}
            <motion.form 
              onSubmit={handleReviewSubmit} 
              className="mt-[32px]"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <h3 className="text-[15px] text-secondary font-medium mb-[16px]"> Write a Review </h3>
              <div className="space-y-[16px]">
                <div>
                  <label htmlFor="rating" 
                    className="block text-[14px] font-medium text-gray-700"
                  >
                    Rating
                  </label>
                  <select 
                    id="rating" 
                    name="rating"
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
                  <label htmlFor="comment" 
                    className="block text-[14px] font-medium text-gray-700"
                  >
                    Comment
                  </label>
                  <textarea 
                    id="comment" 
                    name="comment" 
                    rows={3} 
                    className="mt-[4px] block w-full text-[14px]
                     border-gray-300 rounded-md" placeholder="Write your review here..."
                  />
                </div>
                <SiteSecondaryFillButton 
                    type="submit" 
                    className='text-[14px]' 
                    clickHandler={()=> onReviewSubmit()}>
                        Submit Review
                </SiteSecondaryFillButton>
              </div>
            </motion.form>
        </section>
    )
}