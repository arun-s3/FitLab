import { Dumbbell, Users, CreditCard, Calendar, Trophy, Heart} from "lucide-react"



const FaqDatas = ()=> {

  return {
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
}

export default FaqDatas