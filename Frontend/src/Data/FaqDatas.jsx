import {Dumbbell, Activity, Cpu, Heart, CreditCard, Tag, Truck, Users, ShoppingBag,  MessageCircle} from "lucide-react"

import {MdSportsGymnastics} from "react-icons/md"


const FaqDatas = ()=> {

    return {

      "Strength Equipment": {
        icon: Dumbbell,
        questions: [
          {
            question: "What types of strength equipment are available on FitLab?",
            answer:
              "FitLab offers a wide range of strength equipment including dumbbells, barbells, weight plates, racks, benches, resistance bands, kettlebells, and functional training tools. Products are organized into deeply nested categories so users can easily find equipment based on training style and experience level."
          },
          {
            question: "How do I know which strength equipment suits my workout?",
            answer:
              "FitLab enables exercise-based product discovery, allowing you to explore equipment based on exercises, muscle groups, difficulty levels, and training goals—making it easier to choose the right gear for your routine."
          },
          {
            question: "Are detailed specifications provided for strength products?",
            answer:
              "Yes. Each product page includes detailed specifications such as dimensions, material, weight capacity, usage recommendations, and safety guidelines to help you make informed decisions."
          },
          {
            question: "Can I save or plan strength equipment purchases?",
            answer:
              "Absolutely. You can add products to smart wishlists, assign priorities, customize thumbnails, and plan purchases over time or share lists with others."
          }
        ]
      },
    
      "Cardio & Training Equipment": {
        icon: Heart,
        questions: [
          {
            question: "What types of cardio and conditioning equipment can I find?",
            answer:
              "FitLab features cardio and conditioning equipment such as skipping ropes, resistance trainers, rowing trainers, agility tools, and endurance-focused accessories suited for both home and gym training."
          },
          {
            question: "How does FitLab help me choose cardio equipment?",
            answer:
              "Products can be explored based on workout type, intensity, muscle involvement, and fitness level—helping you align equipment choices with your training goals."
          }
        ]
      },
    
      "Workout Tracking & Health": {
        icon: Activity,
        questions: [
          {
            question: "Does FitLab help me track my workouts?",
            answer:
              "Yes. FitLab includes a workout tracking engine where you can create reusable workout templates, track sessions using timers, and monitor performance trends over time."
          },
          {
            question: "What health metrics can I track on FitLab?",
            answer:
              "You can maintain a comprehensive health profile including height, weight, BMI, blood pressure, and body composition metrics—all organized in one place."
          },
          {
            question: "How do dashboards and insights help me improve?",
            answer:
              "FitLab’s dashboards visualize workout history, health metrics, and progress patterns, helping you identify trends and make data-driven fitness decisions."
          }
        ]
      },

      "Fitness Training & Exercises": {
        icon: MdSportsGymnastics,
        questions: [
          {
            question: "What does the Fitness Training section offer?",
            answer:
              "The Fitness Training section helps users explore exercises based on body parts, muscle groups, and training goals, with structured exercise libraries."
          },
          {
            question: "What details are available for each exercise?",
            answer:
              "Each exercise includes detailed instructions, muscle focus, difficulty level, demonstrations, videos, GIFs, and execution tips."
          },
          {
            question: "Can exercises be filtered or searched?",
            answer:
              "Yes. Exercises can be filtered by equipment, body part, muscle group, exercise type, and difficulty to help users quickly find what they need."
          },
          {
            question: "Can training help with equipment selection?",
            answer:
              "Yes. Users can discover exercises first and then explore related equipment directly, making shopping aligned with training needs."
          }
        ]
      },
    
      "Coach+ Personal Fitness Companion": {
        icon: Cpu,
        questions: [
          {
            question: "What is Coach+ on FitLab?",
            answer:
              "Coach+ is a personalized fitness companion designed to support your training journey with goal-based guidance, workout insights, and contextual recommendations."
          },
          {
            question: "Is Coach+ a replacement for a human trainer?",
            answer:
              "Coach+ complements your training by providing intelligent guidance and insights, but it does not replace certified medical or professional coaching advice."
          }
        ]
      },
    
      "Smart Shopping & Wishlists": {
        icon: Heart,
        questions: [
          {
            question: "What makes FitLab shopping different?",
            answer:
              "FitLab connects training and shopping. Instead of browsing randomly, you can discover products based on exercises, goals, and fitness plans."
          },
          {
            question: "How do smart wishlists work?",
            answer:
              "You can create multiple wishlists, customize thumbnails, assign priorities to lists and individual products, and share them to plan fitness goals more effectively."
          }
        ]
      },
    
      "Wallet & Payments": {
        icon: CreditCard,
        questions: [
          {
            question: "What payment options does FitLab support?",
            answer:
              "FitLab supports multiple secure payment gateways including Razorpay, Stripe, and PayPal. Users can also pay directly using their FitLab wallet or choose Cash on Delivery where applicable."
          },
          {
            question: "What is the FitLab Wallet?",
            answer:
              "The FitLab Wallet is a unified digital wallet that allows users to store balance, make faster checkouts, track transactions, and use wallet funds across shopping, subscriptions, and services."
          },
          {
            question: "Does the wallet support auto-recharge?",
            answer:
              "Yes. FitLab offers both fully automatic and semi-automatic wallet recharge options. Users can configure auto-recharge thresholds or manually approve recharges based on their preference."
          },
          {
            question: "Can I use wallet balance along with other payment methods?",
            answer:
              "Yes. Wallet balance can be combined with other payment methods during checkout if the wallet balance is insufficient for the full order value."
          }
        ]
      },

      "Coupons & Offers": {
        icon: Tag,
        questions: [
          {
            question: "Where can I find available coupons?",
            answer:
              "FitLab provides a dedicated Coupons page that shows all coupons currently eligible for your account based on usage, order value, and validity."
          },
          {
            question: "How are offers displayed on FitLab?",
            answer:
              "Active offers are highlighted across the homepage, product listings, and promotional sections to ensure users never miss ongoing deals."
          },
          {
            question: "Does FitLab automatically apply the best coupon?",
            answer:
              "Yes. During checkout, FitLab intelligently evaluates all eligible coupons and automatically applies the best available discount to your order."
          },
          {
            question: "Can I change or remove the applied coupon?",
            answer:
              "Absolutely. Users can replace the auto-applied coupon with another eligible one or remove it entirely before completing checkout."
          }
        ]
      },

      "Shopping & Product Discovery": {
        icon: ShoppingBag,
        questions: [
          {
            question: "How can I filter products on the shopping page?",
            answer:
              "Products can be filtered by price range, muscle group, brand, category, sub-category, popularity, ratings, and reviews."
          },
          {
            question: "Can I shop based on training goals?",
            answer:
              "Yes. FitLab allows users to discover products based on exercises, muscle groups, and workout styles for more purposeful shopping."
          },
          {
            question: "Are product reviews visible?",
            answer:
              "Yes. Users can view ratings and reviews on product pages to make informed purchasing decisions."
          }
        ]
      },
    
      "Orders & Delivery": {
        icon: Truck,
        questions: [
          {
            question: "What checkout options are available?",
            answer:
              "FitLab supports checkout using Razorpay, Stripe, PayPal, wallet balance, and Cash on Delivery for eligible locations and products."
          },
          {
            question: "Can I track my order after placing it?",
            answer:
              "Yes. Users can track order status in real time from the Orders section, including processing, shipped, out-for-delivery, and delivered stages."
          },
          {
            question: "Can I cancel or modify an order?",
            answer:
              "Orders can be cancelled or modified before they enter the shipping stage. Once shipped, standard return policies apply."
          },
          {
            question: "Is Cash on Delivery available for all products?",
            answer:
              "Cash on Delivery availability depends on product type, order value, and delivery location. Eligible orders will show the option during checkout."
          }
        ]
      },
    
      "Peer Fitness Economy": {
        icon: Users,
        questions: [
          {
            question: "What is the peer-powered fitness economy?",
            answer:
              "FitLab enables a trust-based ecosystem where users can lend or receive financial support within the platform, making fitness more accessible."
          }
        ]
      },
    
      "Support & Assistance": {
        icon: MessageCircle,
        questions: [
          {
            question: "How can I get help if I’m stuck?",
            answer:
              "FitLab offers real-time assistance through chat and video support, ensuring users receive help whenever they need it."
          },
          {
            question: "Is support available for both shopping and fitness features?",
            answer:
              "Yes. Our support team assists with product selection, orders, platform usage, fitness tracking features, and general queries."
          }
        ]
      }
    }
}


export default FaqDatas