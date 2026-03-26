export const pricingPlans = [
  {
    id: 1,
    name: "Basic",
    price: 60,
    currency: "ZAR",
    period: "month",
    devices: "1 TV + 1 Phone",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "HD Quality",
      "1 TV device + 1 Phone",
      "+R20/month per extra device",
    ],
    popular: false
  },
  {
    id: 2,
    name: "Standard",
    price: 150,
    currency: "ZAR",
    period: "3 months",
    devices: "1 TVs +  Phones",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "Full HD Quality",
      "2 TV devices + 2 Phones",
      "+R20/month per extra device",
    ],
    popular: true
  },
  {
    id: 3,
    name: "Premium",
    price: 320,
    currency: "ZAR",
    period: "6 months",
    devices: "1 TVs + 1 Phones",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "4 TV devices + 4 Phones",
      "+R20/month per extra device",
    ],
    popular: false
  },
  {
    id: 4,
    name: "Family",
    price: 600,
    currency: "ZAR",
    period: "12 months",
    devices: "Unlimited devices",
    features: [
      "3-day free trial",
      "60,000+ Movies & Series",
      "4K Quality",
      "Unlimited devices",
      "Priority support",
    ],
    popular: false
  }
];

export const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is Family Binge?",
        a: "Family Binge is a streaming platform with 60,000+ movies and series. Available on web, Android, Smart TV and TV Stick."
      },
      {
        q: "Is there a free trial?",
        a: "Yes! We offer a 3-day free trial so you can explore our entire library before subscribing. No credit card required to start."
      },
      {
        q: "What devices can I watch on?",
        a: "You can watch on your phone, tablet, computer, Smart TV, and TV Stick. Each plan includes 1 TV device and 1 phone as standard, with extra devices available for R20/month each."
      }
    ]
  },
  {
    category: "Subscription & Payment",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept PayPal, Visa, and Mastercard. All prices are in South African Rand (ZAR)."
      },
      {
        q: "Can I add more devices to my plan?",
        a: "Yes! You can add extra TV devices or phones to any plan for R20 per device per month."
      },
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel anytime from your account settings. Your access continues until the end of your billing period."
      }
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        q: "The video won't play, what should I do?",
        a: "Try switching servers using the server selector. If one source doesn't work, try another. Also check your internet connection."
      },
      {
        q: "Video is buffering constantly",
        a: "Buffering is usually caused by a slow internet connection. Try switching to a different server source, or connect to a faster network."
      }
    ]
  }
];

export const categories = ["All", "Movies", "Series", "Action", "Comedy", "Drama", "Horror", "Sci-Fi"];
