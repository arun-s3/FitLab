import { Dumbbell, Heart, CreditCard, ShoppingBag, Pill, Truck} from "lucide-react"



const FaqDatas = ()=> {

    return {

      "Strength Equipment": {
        icon: Dumbbell,
        questions: [
          {
            question: "What types of strength equipment do you sell?",
            answer:
              "We offer a comprehensive range of strength equipment including dumbbells, barbells, weight plates, power racks, squat stands, bench presses, resistance bands, kettlebells, and cable machines. All equipment is commercial-grade and suitable for home gyms.",
          },
          {
            question: "Do you provide assembly service for heavy equipment?",
            answer:
              "Yes! We offer professional assembly service for all major strength equipment. Our certified technicians will deliver, assemble, and test your equipment to ensure it's ready for use. Assembly service is available for an additional fee and can be selected during checkout.",
          },
          {
            question: "What's the weight capacity of your equipment?",
            answer:
              "Our strength equipment is built to commercial standards with weight capacities ranging from 300lbs to 1000lbs depending on the item. Each product page includes detailed specifications including maximum weight capacity, dimensions, and safety ratings.",
          },
          {
            question: "Do you offer equipment warranties?",
            answer:
              "All our strength equipment comes with manufacturer warranties ranging from 1-10 years depending on the brand and product type. We also offer extended warranty options for additional peace of mind. Warranty details are clearly listed on each product page.",
          },
          {
            question: "Can I try the equipment before purchasing?",
            answer:
              "We have showrooms in major cities where you can test select equipment. Additionally, we offer a 30-day satisfaction guarantee - if you're not completely satisfied with your purchase, you can return it for a full refund (return shipping fees may apply).",
          },
        ],
      },
    "Cardio Machines": {
      icon: Heart,
      questions: [
        {
          question: "What cardio machines do you have available?",
          answer:
            "Our cardio collection includes treadmills, elliptical trainers, stationary bikes, rowing machines, stair climbers, and air bikes. We carry both commercial-grade and home-use models from top brands like NordicTrack, Peloton, Concept2, and Life Fitness.",
        },
        {
          question: "Do your cardio machines require special electrical setup?",
          answer:
            "Most of our cardio machines plug into standard household outlets (110V). Some commercial-grade treadmills may require 220V outlets. We clearly specify power requirements on each product page and can arrange electrical consultation if needed.",
        },
        {
          question: "What's included with cardio machine delivery?",
          answer:
            "Standard delivery includes curbside drop-off. We also offer white-glove delivery service which includes delivery to your desired room, unpacking, assembly, and basic setup. This service is highly recommended for larger cardio machines.",
        },
        {
          question: "Do you offer financing options for expensive cardio equipment?",
          answer:
            "Yes! We partner with leading financing companies to offer 0% APR financing for qualified customers. Options include 6, 12, 18, and 24-month payment plans. You can apply for financing during checkout and get instant approval decisions.",
        },
        {
          question: "What maintenance is required for cardio machines?",
          answer:
            "We provide detailed maintenance guides with every purchase. Most machines require basic cleaning and occasional lubrication. We also offer annual maintenance packages and have a network of certified repair technicians for warranty and post-warranty service.",
        },
      ],
    },
    "Accessories & Gear": {
      icon: ShoppingBag,
      questions: [
        {
          question: "What gym accessories do you sell?",
          answer:
            "We carry a wide range of accessories including yoga mats, resistance bands, foam rollers, gym gloves, lifting belts, straps, gym bags, water bottles, towels, and recovery tools. We also stock specialty items like gymnastic rings, suspension trainers, and agility equipment.",
        },
        {
          question: "Do you offer bulk discounts for gym accessories?",
          answer:
            "Yes! We offer tiered discounts for bulk purchases. Buy 5+ items and save 10%, 10+ items save 15%, and 20+ items save 20%. This is perfect for outfitting home gyms, small studios, or corporate fitness centers. Discounts are automatically applied at checkout.",
        },
        {
          question: "What's your return policy for accessories?",
          answer:
            "Accessories can be returned within 30 days of purchase in original, unused condition with original packaging. Items like resistance bands, gloves, and personal care items are final sale for hygiene reasons. Return shipping is free for defective items.",
        },
        {
          question: "Do you carry eco-friendly and sustainable products?",
          answer:
            "We have a dedicated eco-friendly section featuring products made from recycled materials, natural rubber, organic cotton, and sustainable bamboo. Look for our 'Green Choice' badge on qualifying products throughout our store.",
        },
        {
          question: "Can I get personalized recommendations for accessories?",
          answer:
            "Yes! Our fitness experts offer free consultations to help you choose the right accessories for your workout style and goals. You can chat with us online, call our customer service, or visit our showrooms for personalized recommendations.",
        },
      ],
    },
    "Supplements & Nutrition": {
      icon: Pill,
      questions: [
        {
          question: "What types of supplements do you carry?",
          answer:
            "We stock a comprehensive range including protein powders, pre-workouts, post-workout recovery, vitamins, minerals, creatine, BCAAs, fat burners, and meal replacement shakes. All products are from verified, reputable brands and third-party tested for purity.",
        },
        {
          question: "Are your supplements safe and tested?",
          answer:
            "Yes! All our supplements are from FDA-registered facilities and undergo rigorous third-party testing for purity, potency, and safety. We only partner with brands that follow Good Manufacturing Practices (GMP) and provide certificates of analysis.",
        },
        {
          question: "Do you offer subscription services for supplements?",
          answer:
            "Yes! Our auto-delivery subscription service saves you 15% on every order and ensures you never run out of your favorite supplements. You can customize delivery frequency, pause, or cancel anytime. Free shipping is included on all subscription orders.",
        },
        {
          question: "Can you help me choose the right supplements for my goals?",
          answer:
            "Our certified nutritionists and fitness experts provide free consultations to help you select supplements based on your fitness goals, dietary restrictions, and current routine. We also offer detailed product guides and comparison tools.",
        },
        {
          question: "What's your policy on expired or damaged supplements?",
          answer:
            "We guarantee fresh products with at least 12 months until expiration. If you receive expired or damaged supplements, we'll replace them immediately at no cost. We also offer a satisfaction guarantee - if you're not happy with a product, return it within 30 days for a full refund.",
        },
      ],
    },
    "Shipping & Delivery": {
      icon: Truck,
      questions: [
        {
          question: "What are your shipping options and costs?",
          answer:
            "We offer standard shipping (5-7 business days), expedited shipping (2-3 business days), and next-day delivery in select areas. Free standard shipping on orders over $99. Large equipment may require freight shipping with scheduled delivery appointments.",
        },
        {
          question: "Do you deliver to all locations?",
          answer:
            "We ship to all 50 US states, Canada, and select international locations. Some oversized items may have shipping restrictions. Hawaii, Alaska, and international orders may incur additional shipping fees. Check our shipping calculator at checkout for exact costs.",
        },
        {
          question: "How do you handle large equipment delivery?",
          answer:
            "Large equipment is shipped via freight carriers with scheduled delivery appointments. We offer curbside delivery (standard) or white-glove service (delivery to room of choice, unpacking, and assembly). You'll receive tracking information and delivery appointment scheduling.",
        },
        {
          question: "What if my order arrives damaged?",
          answer:
            "We carefully package all items, but if something arrives damaged, contact us within 48 hours with photos. We'll arrange immediate replacement or refund. For large equipment, our delivery team will inspect items with you upon delivery and note any damage.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes! You'll receive tracking information via email once your order ships. You can also track orders in your account dashboard. For large equipment, we'll provide freight tracking numbers and coordinate delivery appointments directly with you.",
        },
      ],
    },
    "Orders & Payment": {
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. For large purchases, we also offer financing options and accept bank transfers. All transactions are secured with 256-bit SSL encryption.",
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer:
            "Orders can be modified or cancelled within 2 hours of placement if they haven't entered our fulfillment process. After that, you can return items according to our return policy. Contact customer service immediately if you need to make changes.",
        },
        {
          question: "Do you offer price matching?",
          answer:
            "Yes! We offer price matching on identical items from authorized retailers. The item must be in stock at both stores, and we'll match the price plus beat it by 5%. Price matching requests must be submitted before purchase with proof of competitor pricing.",
        },
        {
          question: "What's your return and refund policy?",
          answer:
            "Most items can be returned within 30 days in original condition for a full refund. Large equipment has a 14-day return window due to shipping costs. Supplements and personal care items are final sale. Return shipping is free for defective items, customer pays return shipping otherwise.",
        },
        {
          question: "Do you offer corporate or bulk pricing?",
          answer:
            "Yes! We offer special pricing for gyms, corporate wellness programs, schools, and bulk purchasers. Contact our business sales team for custom quotes on large orders. We also provide dedicated account management and flexible payment terms for qualified business customers.",
        },
      ],
    } 
  }
}


export default FaqDatas