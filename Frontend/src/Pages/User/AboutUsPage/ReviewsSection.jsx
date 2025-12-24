import React, { useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"

import { MessageCircle } from "lucide-react"
import axios from 'axios'


const ReviewCard = ({ avatar, name, role, review, delay }) => {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-8 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full" />
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">{review}</p>
      
    </motion.div>
  )
}

export default function ReviewsSection() {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const [testimonials, setTestimonials] = useState([])

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL
    
  useEffect(() => {
    async function loadTestimonials() {
      try {   
        console.log("Inside loadTestimonials()")
        const response = await axios.get(`${baseApiUrl}/testimony/top`, { withCredentials: true })
        console.log("response.data.testimonies---->", response.data.testimonies)

        if(response.status === 200){
          const fetchedTestimonials = response.data.testimonies.map((testimony) => {
            const { userId, ...rest } = testimony
            const fullName = userId?.firstName && userId?.lastName 
              ? `${userId.firstName} ${userId.lastName}` 
              : userId?.username 

            return {
              name: fullName,
              avatar: userId?.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                || '/default-avatar.png',
              rating: testimony.rating,
              title: testimony.title,
              review: testimony.comment,
            }
          })
          console.log("fetchedTestimonials-------------->", fetchedTestimonials)
          setTestimonials(fetchedTestimonials)
        }
      }
      catch (error) {
        console.log("Error fetching top testimonies:", error)
      }
    }
    
      loadTestimonials()
  }, [])


  return (
    <section ref={ref} className="pb-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-gray-900 mb-4"
        >
          What Our Customers Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-600 mb-12"
        >
          Real stories from real fitness enthusiasts
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ReviewCard
            avatar="/placeholder.svg?height=48&width=48"
            name="Sarah Johnson"
            role="Fitness Enthusiast"
            review="FitLab has completely transformed my fitness journey. The equipment quality is exceptional, and the community support keeps me motivated. I've seen results I never thought possible!"
            delay={0}
          />
          <ReviewCard
            avatar="/placeholder.svg?height=48&width=48"
            name="Michael Chen"
            role="Professional Athlete"
            review="As a competitive athlete, I demand the best. FitLab delivers premium equipment and expert coaching that has taken my performance to the next level. Highly recommended!"
            delay={0.1}
          />
          <ReviewCard
            avatar="/placeholder.svg?height=48&width=48"
            name="Emily Rodriguez"
            role="Wellness Coach"
            review="The holistic approach FitLab takes to fitness is refreshing. It's not just about equipment—it's about building a healthier lifestyle. My clients love the platform!"
            delay={0.2}
          />
          <ReviewCard
            avatar="/placeholder.svg?height=48&width=48"
            name="David Thompson"
            role="Gym Owner"
            review="I've partnered with FitLab for our facility and it's been amazing. Their products are top-notch and their commitment to customer service is unmatched."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  )
}
