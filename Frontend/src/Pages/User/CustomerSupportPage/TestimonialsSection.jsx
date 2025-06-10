import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dumbbell, Users, CreditCard, Calendar, Trophy, Heart, Plus, Minus, Search } from "lucide-react"

const faqData = {
  "Equipment & Training": {
    icon: Dumbbell,
    questions: [
      {
        question: "What types of equipment do you have available?",
        answer:
          "We offer a comprehensive range of equipment including free weights, cardio machines, resistance training equipment, functional training areas, and specialized equipment for powerlifting and Olympic lifting.",
      },
      {
        question: "Do you provide personal training services?",
        answer:
          "Yes! We have certified personal trainers available for one-on-one sessions, small group training, and specialized programs. All trainers are certified and experienced in various fitness disciplines.",
      },
      {
        question: "Are there beginner-friendly programs?",
        answer:
          "We offer beginner orientation sessions, foundational fitness classes, and personalized workout plans designed specifically for those new to fitness or returning after a break.",
      },
      {
        question: "What safety measures are in place?",
        answer:
          "We maintain strict safety protocols including equipment sanitization, proper ventilation, emergency procedures, and trained staff supervision during peak hours.",
      },
      {
        question: "Can I get a workout plan customized for my goals?",
        answer:
          "Yes! Our trainers create personalized workout plans based on your fitness goals, current fitness level, any limitations, and preferred training style.",
      },
    ],
  },
  "Membership & Pricing": {
    icon: CreditCard,
    questions: [
      {
        question: "What membership options do you offer?",
        answer:
          "We offer flexible membership plans including monthly, quarterly, and annual options. Plans range from basic gym access to premium packages with additional services like classes and personal training sessions.",
      },
      {
        question: "Are there any joining fees or hidden costs?",
        answer:
          "We believe in transparent pricing. Our membership fees are clearly outlined with no hidden costs. Some plans may include a one-time enrollment fee, which is always disclosed upfront.",
      },
      {
        question: "Can I freeze or cancel my membership?",
        answer:
          "Yes, we offer flexible membership management. You can freeze your membership for medical reasons or travel, and cancellation policies vary by membership type with reasonable notice periods.",
      },
      {
        question: "Do you offer student or senior discounts?",
        answer:
          "We provide special pricing for students with valid ID, seniors (65+), military personnel, and first responders. Corporate group discounts are also available.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, debit cards, bank transfers, and offer automatic payment options for convenience. Cash payments are accepted for day passes and some services.",
      },
    ],
  },
  "Classes & Programs": {
    icon: Users,
    questions: [
      {
        question: "What group fitness classes do you offer?",
        answer:
          "We offer a diverse range of classes including HIIT, yoga, pilates, spin, Zumba, strength training, boxing, and specialized programs like senior fitness and prenatal classes.",
      },
      {
        question: "How do I book classes?",
        answer:
          "Classes can be booked through our mobile app, website, or at the front desk. We recommend booking in advance as popular classes fill up quickly.",
      },
      {
        question: "Are classes included in membership?",
        answer:
          "Most group fitness classes are included in our standard membership. Some specialized classes or workshops may require an additional fee, which is clearly indicated in the schedule.",
      },
      {
        question: "What if I'm new to group fitness?",
        answer:
          "We welcome beginners! Many of our classes offer modifications for different fitness levels, and our instructors provide guidance to ensure you feel comfortable and safe.",
      },
      {
        question: "Can I try a class before committing?",
        answer:
          "Yes! We offer trial classes for new members and day passes for non-members to experience our group fitness offerings before making a commitment.",
      },
    ],
  },
  "Facilities & Hours": {
    icon: Calendar,
    questions: [
      {
        question: "What are your operating hours?",
        answer:
          "We're open Monday-Friday 5:00 AM to 11:00 PM, Saturday-Sunday 6:00 AM to 10:00 PM. Holiday hours may vary, and we provide 24/7 access for premium members.",
      },
      {
        question: "What amenities do you provide?",
        answer:
          "Our facilities include locker rooms with showers, towel service, water fountains, a juice bar, childcare services, parking, and complimentary WiFi throughout the facility.",
      },
      {
        question: "Is parking available?",
        answer:
          "Yes, we provide free parking for all members and guests. Our parking lot is well-lit and monitored for security.",
      },
      {
        question: "Do you have childcare services?",
        answer:
          "We offer supervised childcare services during peak hours for children ages 6 months to 12 years. This service is included with premium memberships and available for a small fee with basic memberships.",
      },
      {
        question: "Are the facilities accessible?",
        answer:
          "Yes, our facility is fully ADA compliant with accessible entrances, restrooms, equipment, and parking spaces. We're committed to providing an inclusive environment for all members.",
      },
    ],
  },
  "Health & Nutrition": {
    icon: Heart,
    questions: [
      {
        question: "Do you offer nutrition counseling?",
        answer:
          "Yes! We have registered dietitians available for nutrition consultations, meal planning, and ongoing support to help you achieve your health and fitness goals.",
      },
      {
        question: "Are there healthy food options available?",
        answer:
          "Our juice bar offers protein shakes, smoothies, healthy snacks, and supplements. We partner with local vendors to provide fresh, nutritious options.",
      },
      {
        question: "Can you help with weight management goals?",
        answer:
          "We offer comprehensive weight management programs that combine personalized training, nutrition guidance, and ongoing support to help you reach and maintain your goals.",
      },
      {
        question: "Do you provide body composition analysis?",
        answer:
          "Yes, we offer body composition testing using advanced technology to track your progress beyond just weight, including muscle mass, body fat percentage, and metabolic rate.",
      },
      {
        question: "Are there programs for specific health conditions?",
        answer:
          "We offer specialized programs for various conditions including diabetes management, cardiac rehabilitation, arthritis-friendly exercise, and post-physical therapy fitness programs.",
      },
    ],
  },
  "Success & Results": {
    icon: Trophy,
    questions: [
      {
        question: "How do you track member progress?",
        answer:
          "We use a combination of fitness assessments, body composition analysis, progress photos, and our mobile app to help you track workouts, measurements, and achievements over time.",
      },
      {
        question: "What kind of results can I expect?",
        answer:
          "Results vary based on individual goals, consistency, and effort. Most members see improvements in strength and endurance within 4-6 weeks, with visible changes typically occurring within 8-12 weeks of consistent training.",
      },
      {
        question: "Do you offer challenges or competitions?",
        answer:
          "Yes! We regularly host fitness challenges, transformation contests, and friendly competitions to keep members motivated and engaged in their fitness journey.",
      },
      {
        question: "How do you celebrate member achievements?",
        answer:
          "We recognize member milestones through our social media, member spotlight features, achievement badges in our app, and special recognition events throughout the year.",
      },
      {
        question: "What support do you provide for long-term success?",
        answer:
          "We offer ongoing support through regular check-ins, program adjustments, educational workshops, community events, and access to our team of fitness professionals.",
      },
    ],
  },
}

export default function TestimonialsSection() {
  const [selectedTopic, setSelectedTopic] = useState("Equipment & Training")
  const [openQuestion, setOpenQuestion] = useState(null)
  const [hoveredTopic, setHoveredTopic] = useState(null)
  const [hoveredQuestion, setHoveredQuestion] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 200, y: 200 })
  const [searchQuery, setSearchQuery] = useState("")
  const faqContainerRef = useRef(null)

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  const handleMouseMove = (e) => {
    if (faqContainerRef.current) {
      const rect = faqContainerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
  

        <div className="relative">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,0 C50,15 100,5 150,20 C200,35 250,10 300,25 C350,40 400,15 450,30 C500,45 550,20 600,35 C650,50 700,25 750,40 C800,55 850,30 900,45 C950,60 1000,35 1050,50 C1100,65 1150,40 1200,55 L1200,60 L0,60 Z" />
          </svg>
        </div>

      <div className="relative">
        {/* <div className="relative z-10">
          <svg className="w-full h-16 text-black" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,60 C50,45 100,55 150,40 C200,25 250,50 300,35 C350,20 400,45 450,30 C500,15 550,40 600,25 C650,10 700,35 750,20 C800,5 850,30 900,15 C950,0 1000,25 1050,10 C1100,5 1150,20 1200,5 L1200,0 L0,0 Z" />
          </svg>
        </div> */}

        <div ref={faqContainerRef} className="bg-black relative overflow-hidden" onMouseMove={handleMouseMove}>
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(75, 85, 99, 0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(75, 85, 99, 0.7) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, 
                  rgba(168, 85, 247, 0.4) 0%, 
                  rgba(168, 85, 247, 0.2) 30%, 
                  transparent 70%
                )
              `,
              opacity: 0.6,
            }}
          />

          <div className="relative z-10 container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}
                  Asked Questions
                </span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto">
                Welcome to our FAQ section, where you'll find answers to all your burning questions about our gym and
                fitness services!
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="lg:w-1/4"
              >
                <div className="sticky top-8">
                  <div className="space-y-2">
                    {Object.entries(faqData).map(([topic, data]) => {
                      const isSelected = selectedTopic === topic
                      const isHovered = hoveredTopic === topic

                      return (
                        <motion.button
                          key={topic}
                          className={`block w-full text-left py-2.5 px-4 rounded-lg transition-all duration-200 text-sm ${
                            isSelected
                              ? "text-purple-400 bg-purple-500/10"
                              : isHovered
                                ? "text-purple-300 bg-purple-500/5"
                                : "text-gray-400 hover:text-gray-300"
                          }`}
                          onClick={() => setSelectedTopic(topic)}
                          onMouseEnter={() => setHoveredTopic(topic)}
                          onMouseLeave={() => setHoveredTopic(null)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {topic}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="lg:w-3/4 space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                    </div>
                    {selectedTopic} Questions
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTopic}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    {faqData[selectedTopic].questions.map((faq, index) => {
                      const isOpen = openQuestion === index
                      const isHovered = hoveredQuestion === index

                      return (
                        <motion.div
                          key={index}
                          className="relative"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onMouseEnter={() => setHoveredQuestion(index)}
                          onMouseLeave={() => setHoveredQuestion(null)}
                        >
                          <motion.div
                            className="relative rounded-xl overflow-hidden bg-black"
                            animate={{
                              borderTop:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderLeft:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderRight:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.8)"
                                  : "2px solid rgba(168, 85, 247, 0.3)",
                              borderBottom:
                                isHovered || isOpen
                                  ? "2px solid rgba(168, 85, 247, 0.2)"
                                  : "2px solid rgba(168, 85, 247, 0.1)",
                            }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            <motion.button
                              className="w-full p-4 text-left relative"
                              onClick={() => toggleQuestion(index)}
                              style={{
                                backgroundImage:
                                  isHovered || isOpen
                                    ? "linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 1) 100%)"
                                    : "linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, rgba(0, 0, 0, 1) 100%)",
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-base font-semibold text-white pr-4">{faq.question}</h3>
                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                  {isOpen ? (
                                    <Minus className="w-5 h-5 text-purple-400" />
                                  ) : (
                                    <Plus className="w-5 h-5 text-purple-400" />
                                  )}
                                </motion.div>
                              </div>
                            </motion.button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 bg-black border-t border-purple-500/20">
                                    <p className="text-gray-300 leading-relaxed text-sm">{faq.answer}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
