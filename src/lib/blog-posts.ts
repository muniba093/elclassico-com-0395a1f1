export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  date: string;
  readMinutes: number;
  cover: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-a-restaurant-business-in-pakistan",
    title: "How to Start a Restaurant Business in Pakistan (2026 Step-by-Step Guide)",
    description:
      "A practical step-by-step guide to starting a restaurant business in Pakistan: budget, licences, location, menu pricing, staffing and marketing.",
    keywords:
      "how to start a restaurant, restaurant business plan, restaurant startup cost, food business in Pakistan",
    date: "2026-07-12",
    readMinutes: 8,
    cover:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    intro:
      "Opening a restaurant looks glamorous from the outside, but the businesses that survive their first two years are the ones built on boring fundamentals: a tight concept, honest numbers, and a kitchen that can repeat the same dish 300 times a week. Here is the exact order we recommend for anyone starting out.",
    sections: [
      {
        heading: "1. Pick a concept narrow enough to be remembered",
        body: [
          "The fastest way to fail is to sell everything to everyone. Pick one hero category — BBQ, burgers, biryani, specialty coffee — and let the rest of the menu support it.",
          "Write a one-line positioning statement: who you serve, what you serve, and why you are different. If you can't say it in one line, customers can't repeat it to a friend.",
        ],
      },
      {
        heading: "2. Build a realistic startup budget",
        body: [
          "Typical cost buckets: rent and security deposit, kitchen equipment, interior and signage, POS and website, initial inventory, licences, and at least three months of running capital.",
          "The mistake most first-time owners make is spending 100% of their capital on opening day and having nothing left for the slow first quarter. Keep 25–30% in reserve.",
        ],
      },
      {
        heading: "3. Sort out registration and licences early",
        body: [
          "Register the business, get an NTN, and apply for your food authority licence and health certificates for staff. Fire safety and municipal approvals depend on your city.",
          "Start this before renovation, not after — approvals are the most common reason openings slip by months.",
        ],
      },
      {
        heading: "4. Price the menu from food cost, not from competitors",
        body: [
          "Calculate the exact cost of every plate, then target a 28–35% food cost. Add packaging cost for delivery items — it is the silently profit-eating line.",
          "Use menu engineering: place your highest-margin dishes at the top-right of each section and give them a photo.",
        ],
      },
      {
        heading: "5. Launch online on day one",
        body: [
          "A simple website with your menu, prices, opening hours and an online ordering button converts better than any social page, because it owns the customer relationship and the data.",
          "Add your restaurant to Google Business Profile with real photos and consistent name, address and phone. Local search is where most first visits begin.",
        ],
      },
      {
        heading: "6. Marketing that actually works in year one",
        body: [
          "Soft launch with a limited menu and invite local food creators. Collect reviews from the very first week.",
          "Run a loyalty or promo code offer for repeat orders — retaining a customer costs a fraction of acquiring a new one.",
        ],
      },
    ],
  },
  {
    slug: "trending-food-business-ideas-2026",
    title: "12 Trending Food Business Ideas for 2026 (And What Customers Actually Order)",
    description:
      "The food trends worth building a business on in 2026 — from cloud kitchens and smash burgers to specialty coffee and high-protein menus.",
    keywords: "trending food business ideas, cloud kitchen, food trends 2026, restaurant trends",
    date: "2026-07-20",
    readMinutes: 6,
    cover:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
    intro:
      "Trends only matter when they match real ordering behaviour. These are the formats we see growing fastest — and the reason each one works.",
    sections: [
      {
        heading: "Formats with the strongest demand",
        body: [
          "Cloud kitchens: low rent, delivery-first, easy to test two brands from one kitchen.",
          "Smash burgers and loaded fries: high margin, fast ticket times, extremely shareable.",
          "Specialty coffee with a small food menu: daily repeat visits and premium pricing.",
          "Desi BBQ and karahi in premium packaging: family orders with a high average basket.",
          "High-protein and calorie-labelled meals: fitness customers order on a weekly subscription.",
          "Dessert-only counters: late-night traffic with tiny kitchen footprints.",
        ],
      },
      {
        heading: "What makes them profitable",
        body: [
          "Short menus with shared ingredients keep wastage low and speed high.",
          "Packaging that survives 25 minutes of delivery protects your reviews more than any ad budget.",
          "Direct online ordering removes 15–30% aggregator commission from every order.",
        ],
      },
      {
        heading: "How to test an idea in 30 days",
        body: [
          "Run the concept as a weekend menu from your existing kitchen, promote it locally, and measure repeat orders — not just first orders.",
          "If more than 25% of customers order twice in a month, the idea has legs.",
        ],
      },
    ],
  },
  {
    slug: "restaurant-online-ordering-system-guide",
    title: "Why Every Restaurant Needs Its Own Online Ordering System",
    description:
      "Commissions, customer data and repeat orders: why a direct online ordering system beats delivery aggregators for restaurants.",
    keywords:
      "restaurant online ordering system, online food ordering website, reduce delivery commission",
    date: "2026-07-28",
    readMinutes: 5,
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    intro:
      "Aggregators bring volume, but they own the customer. A direct ordering system on your own website turns one-time orders into a repeatable business.",
    sections: [
      {
        heading: "The commission math",
        body: [
          "On a Rs. 2,000 order, a 25% commission is Rs. 500 — often more than the profit on the food itself.",
          "Shifting even 30% of your orders to your own website can double net profit without selling a single extra plate.",
        ],
      },
      {
        heading: "You keep the customer data",
        body: [
          "Names, phone numbers, addresses and order history let you run promo codes, win-back offers and loyalty campaigns.",
          "Aggregators never share that data with you.",
        ],
      },
      {
        heading: "What a good ordering flow needs",
        body: [
          "A menu with clear photos and prices, a cart that remembers items, promo code support, cash and online payment, and live order tracking.",
          "Admin-side: instant new-order alerts, order status updates, and simple menu editing without a developer.",
        ],
      },
    ],
  },
  {
    slug: "restaurant-seo-tips-get-found-on-google",
    title: "Restaurant SEO: 9 Ways to Get Your Cafe Found on Google",
    description:
      "Practical local SEO tips for restaurants and cafes: Google Business Profile, menu pages, reviews, schema markup and location keywords.",
    keywords: "restaurant SEO, local SEO for restaurants, cafe marketing, Google Business Profile",
    date: "2026-08-01",
    readMinutes: 6,
    cover:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80",
    intro:
      "Most restaurant discovery happens in one place: someone typing “best burgers near me”. Local SEO decides whether they find you or the place across the road.",
    sections: [
      {
        heading: "Own your Google Business Profile",
        body: [
          "Claim it, add accurate hours, category, menu link and at least 20 real photos.",
          "Reply to every review — profiles with active responses rank and convert better.",
        ],
      },
      {
        heading: "Put your real menu on your website as text",
        body: [
          "Menus posted as images can't be read by search engines. A text menu page with dish names, descriptions and prices ranks for hundreds of long-tail dish searches.",
        ],
      },
      {
        heading: "Use location keywords naturally",
        body: [
          "Write for phrases people actually type: “family restaurant in <your area>”, “late night BBQ delivery <your city>”.",
          "Add these to page titles, headings and the first paragraph — not stuffed everywhere.",
        ],
      },
      {
        heading: "Add structured data and keep pages fast",
        body: [
          "Restaurant and Menu schema helps Google show hours, ratings and price range directly in results.",
          "Compress photos — a slow menu page loses mobile customers before the food loads.",
        ],
      },
      {
        heading: "Publish content that answers real questions",
        body: [
          "Blog posts about your dishes, catering options, and area guides bring in searchers before they are hungry, and keep bringing them for years.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);