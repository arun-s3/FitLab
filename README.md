# 🏋️ FitLab — Full Stack Unified Fitness Ecosystem with Smart e-commerce

**FitLab** is a **full-stack (MERN stack) fitness platform** that goes far beyond traditional e-commerce.
It combines **smart shopping, structured fitness training, fitness tracking, health tracking, AI insights, wallet-based payments, real-time video/text support, and personalized coaching** into a single ecosystem.

The platform is designed to simulate **a complete digital fitness environment** where users can train, shop, track health, receive AI guidance, and interact with support — all in one place.

---

## ⚙️ Tech Stack (MERN)

#### Frontend

• React • Redux • Tailwind • CSS • Framer Motion • Vanilla JavaScript • Canvas api • postMessage api

#### Backend

• Node.js • Express.js • MongoDB • Mongoose • Socket.io • WebRTC • JWT Authentication

#### Design

• Figma

#### Payment & Services

• Stripe • Razorpay • PayPal • Cloudinary • Nodemailer

### Deployment & DevOps

• AWS (EC2, S3, CloudFront, Route53, ACM) • NGINX • MongoDB Atlas  •GitLab CI (CI/CD) • GitHub Actions (CI/CD), • BigRock Domain

---

## 🌐 Live Web Application

* **User-side** : https://www.fitlab.co.in
* **Admin-side** : https://www.fitlab.co.in/admin

## 🎥 Project Demonstration Video

📺 Watch the complete platform walkthrough and feature demonstrations (with Chapter timestamps available):

https://www.youtube.com/watch?v=YTgUzVmnheo

🚀 **Quick Access:**

> Jump directly to 👉 [Product Walkthrough &amp; Feature Demonstrations (with gif images)](#-product-walkthrough--feature-demonstrations)

---

## 📑 Table of Contents

* 🎬 [Product Walkthrough &amp; Feature Demonstrations with gif images](#-product-walkthrough--feature-demonstrations)
* 🚀 [Key Highlights](#-key-highlights)
* 🏗️ [Platform &amp; System Features](#-platform--system-features)
* ⚙️ [Backend Systems &amp; Services](#-backend-systems--services)
* ☁️ [Infrastructure &amp; Deployment](#-infrastructure--deployment)
* 📸 [Screenshots](#-screenshots)
* 🧩 [Platform Capabilities](#-platform-capabilities)
* 👤 [User Features](#-user-features)
* 🛠️ [Admin Panel Features](#-admin-panel-features)
* 📁 [Project Structure](#-project-structure)
* 🎨 [Frontend Architecture](#-frontend-architecture)
* 🧠 [Backend Architecture](#-backend-architecture)
* 🔐 [Security Features](#-security-features)
* ⚙️ [Installation](#-installation)
* 🚀 [Future Improvements](#-future-improvements)

---

## 🎬 Product Walkthrough & Feature Demonstrations

Below are real interactions from the live system demonstrating core platform capabilities across fitness, commerce, AI, and admin operations.

### 🏠 Platform Overview & Home page Experience

* Home page showcasing navigation across modules, glimpses on- cart-sidebar, notifications, Coach+, and real-time support.

![HomePage](./gifs/home1.gif)

* Glimpses on- Important pages.

![HomePage](./gifs/home2.gif)

* Home page focuses on- Popular products carousal, Shop by categories, latest products, exclusive offers to choose, FitLab features, and testimonies

![HomePage](./gifs/home3.gif)

............................................................................................................................

### 📊 Admin Dashboard (Business & Operations Overview) & Customer Heatmap

Comprehensive complex analytics dashboards with multiple chart types, searching charts, and real-time business insights with appropriate loaders + Customer heatmap with info on top 5 state, top state with most orders vs with most customers

![AdminDashboard](./gifs/admin-dashboard.gif)
............................................................................................................................

### 🤖 AI Business Insights Engine (Admin)

AI-powered insights with recommendations, predictions, and probability-based analysis.

![AdminAiInsights](./gifs/admin-ai-insights.gif)
............................................................................................................................

### 🏋️ Fitness Training System

Discover exercises by muscle group, equipment, and difficulty with GIF demos, guided steps with videos & smart equipment recommendations with cursor based pagination, complex filtering, sorting and searching

![FitnessTrainingPage](./gifs/fitness-training.gif)
............................................................................................................................

### 🛒 Smart Shopping Experience

Advanced product discovery with highly flexible multi-filtering, debounced searching, limiting, sorting, with deeply nested category navigation, wishlist control, pagination and grid & list based views.

![Shopping](./gifs/shopping.gif)

............................................................................................................................

### 📦 Product Detail & Review System

Detailed product exploration with zoom-enabled images, product/category discount or offer info, variant selection, specifications, rich product information, verified reviews & system(add/edit, helpful, sorting), similar product recommendations and active offers.

![ProductDetailPage](./gifs/product-detail.gif)

............................................................................................................................

### 📦 Admin Product Management + Image Editor

* Advanced product creation system supporting variants, nested categories, flexible pricing/discount logic, and strict field & image validation with real-time feedback + Image editor (crop, filters, color tuning, RGB, hue-rotate, transforms) with automatic compression.

![AdminProductsPage](./gifs/admin-products.gif)

* Advanced product listing system with multi-filtering, sorting, search, and pagination, featuring real-time inventory management, block/unblock controls, inline editing, and CSV/PDF export across grid, list, and table views.

![AdminProductsPage](./gifs/admin-products-list.gif)

............................................................................................................................

### 📊 Fitness & Health Tracking System with dashboard and AI driven insights

* Comprehensive workout , templates, current workout detailed info including calories burned,  structured logging, workout history, AI driven progress insights and dashboard.

![FitnessTrackingPage](./gifs/fitness-tracker1.gif)

* Track BMI, weight, blood pressure, glucose, body composition, waist-hip ratio & other metrics & intelligent estimation of **potential health risks** and get weekly health progress with AI driven insights. Built-in reminders for consistent health logging.

![FitnessTrackingPage](./gifs/fitness-tracker2.gif)

............................................................................................................................

### 🤖 Coach+ AI Fitness Companion

Context-aware AI with session providing personalized fitness guidance and recommendations considering user's workout routines, health profile, orders, wishlist, etc.

![CoachPlus](./gifs/coach+.gif)

............................................................................................................................

### 💬 Real-Time Video/Text Chat Support System (User & Admin)

* Live persistent text chat and support console enabling instant communication, guest-mode chat, admin can search users and chat. Chats are saved. Also shows FAQ accordion

![SupportPage](./gifs/support1.gif)

* Video chat support , queue management, in-call messaging, admin-availabilitycontrol

![SupportPage](./gifs/support2.gif)

* Scheduling video chat sessions with topics and details and admin session filtering

![SupportPage](./gifs/support3.gif)

............................................................................................................................

### 💸 Wallet & Transaction System

* Integrated wallet with funding via Raorpay/Stripe/Paypal, transaction tracking with advanced filtering, sorting & pagination.

![WalletPage](./gifs/wallet1.gif)

* Lending & borrow money (peer to peer fitness economy), auto & semi-auto recharge
  ![WalletPage](./gifs/wallet2.gif)

............................................................................................................................

### 🛍 End-to-End Shopping Flow (Cart → Checkout)

Seamless purchase flow with smart coupon handling(with auto-application of best coupons), pricing breakdown with tax and product/category discounts.

![CartCheckoutFlow](./gifs/cart-checkout.gif)

............................................................................................................................

### 💳 Multi-Payment System, Checkout & Failure Handling

Multi-gateway payments (Razorpay, Stripe, Paypal, Wallet) with robust error handling, retry flows, automated refund fallback workflows and email confirmation.

![CheckoutError](./gifs/checkout-error.gif)

* Razorpay Integration

![CheckoutError](./gifs/checkout-razorpay.gif)

* Stripe integration

![CheckoutError](./gifs/checkout-stripe.gif)

* Payments via wallet

![CheckoutError](./gifs/checkout-wallet.gif)

............................................................................................................................

### 🎟 Admin Coupon Management

Advanced & flexible coupon creation(with percentage, fixed, bogo & free shipping based coupons) with plethora of options,advanced filtering, sorting and limiting targeting, scheduling, and analytics.

![Shopping](./gifs/admin-coupons.gif)

---

<details>
<summary>📸 <b>Explore More Features (Click to Expand)</b></summary>

A deeper look into supporting systems, extended workflows, and platform-wide capabilities.

---

### ❤️ Wishlist Planning System

Create and manage multiple wishlists with priorities, notes, reminders, editable thumbnail and shareable/public lists.

![Wishlist](./gifs/wishlist1.gif)
![Wishlist](./gifs/wishlist2.gif)

............................................................................................................................

### 👥 Admin Customer Management

Search, sort, filter, monitor user activity, block/unblock users, fraud controls, manage accounts, message users and analyze customer behavior & order insights.

![AdminCustomers](./gifs/admin-customers.gif)

............................................................................................................................

### 🔔 Real-Time Notification System

Socket-powered notifications with live updates, read/unread status, automation updaetes and system alerts.

![Notifications](./gifs/notifications.gif)

............................................................................................................................

### 🗂 Admin Category Management

Manage deeply nested categories, apply category discounts, block/unblock catgeory and control catalog structure dynamically.

![AdminCategories](./gifs/admin-categories.gif)

............................................................................................................................

### 📦 Order History & Tracking

Track past orders, cancel orders, refund orders, view status updates, manage returns, access invoices, add FItlab testimony and product review.

![OrderHistory](./gifs/order-history1.gif)
![OrderHistory](./gifs/order-history2.gif)

............................................................................................................................

### 👤 User Account & Profile System

Manage personal information, address, preferences, profile customization, reset password, change profile pic with front cam or upload file.

![UserAccount](./gifs/user-account.gif)

............................................................................................................................

### 🏷 Admin Offer Management

Create and manage highly flexible offer campaigns with thumbnail, complex options, scheduling, targeting, and performance tracking.

![AdminOffers](./gifs/admin-offers.gif)

............................................................................................................................

### 📑 Admin Order Management

Monitor all orders, change status, handle cancellations, approve returns, and process refunds.

![Admin Orders](./gifs/admin-orders.gif)

............................................................................................................................

### 🎟 User Coupons & Address Management

View search & apply coupons in the cart, add/edit/remove/make default addresses.

![Coupons & Address](./gifs/user-coupons-address.gif)

............................................................................................................................

### 📄 Platform, Error and Legal Pages

Includes Privacy Policy, Terms & Conditions, Contact Us, About Us, and custom error pages (401, 403, 404).

![Pages](./gifs/legal-pages.gif)

</details>
---

## 🚀 Key Highlights

### User-side

* 🛒 **Advanced Fitness Marketplace** — Deeply nested product categories, multi-variant products, powerful filtering, sorting and pagination with multiple product view modes.
* 🎯 **Exercise Discovery & Exercise-Driven Product Shopping**— Explore exercises by body part, muscle group, equipment type, difficulty level & variations with GIF demonstrations, step-by-step instructions, details & video guides while discovering best equipments in the process.
* 🏋️ **Workout Tracking & Exercise Training System** — Create custom exercise templates, track sets/reps/weight/rpe with workout timers, resume unfinished workouts, & view workout summaries with detailed information on with weekly/monthly precise insights.
* 📊 **Comprehensive Fitness & Health Tracking** — Track BMI, weight, blood pressure, glucose, body composition, waist-hip ratio & other metrics & intelligent estimation of **potential health risks** and get weekly health progress. Built-in reminders for consistent health logging.
* 📈 **Interactive Fitness Dashboards** — Visualize workout frequency, volume lifted, calories burned, muscle breakdown, and training progress with interactive charts.
* 🤖 **Coach+  Personal Fitness Companion** — Context-aware AI assistant providing workout guidance, insights, & product recommendations with disclaimers based on your activities like recent orders, wishlist, fitness & health tracking records.
* 🧠 **AI-Powered Fitness Insights** —AI analyzes workouts, health metrics, and platform data to generate personalized fitness insights..
* 🛍 **Smart Wishlist Planning System** — Create multiple wishlists with editable thumbnails using the built-in Fitlab Image editor, priorities, notes, reminders, expiry dates, and shareable or public lists.
* 💸 **Advanced Coupon & Offer Engine** — Supports percentage, fixed, BOGO and free shipping campaigns with **automatic best-**coupon detection, automatic best-offer detection**.** Visual offer showcase carousels highlighting active campaigns with modal exploration of eligible products or categories.
* 🧮 **Smart Discount Resolution System** — Automatically selects the best discount among product discounts, category discounts, and active offers.
* 🛒 **Intelligent Cart System** — Automatic coupon suggestions, tax calculations, quantity adjustments, personalized product recommendations and a **dynamic cart sidebar** for quick cart previews.
* 💳 **Unified Wallet & Multi-Gateway Payments** — Integrated Razorpay, Stripe, PayPal, wallet payments, COD, and automatic refund protection, robust error handling modals and retry options .
* 🔁 **Automatic Wallet Recharge System** — Automatic and semi-automatic recharge system via webhooks.
* 🤝 **Peer-to-Peer Fitness Economy** — Users can lend, borrow, and manage transactions directly inside the platform wallet.
* 📦 **Advanced Order & Return Management** — Order lifecycle tracking, order & product-level cancellations, submit return requests with image verification, wallet refunds and download invoice PDFs.
* ⭐ **Product Review & Testimonial System** — Verified purchase reviews with ratings, helpful votes, and interactive testimonial submissions..
* 💬 **Real-Time Customer Support** — Live text chat with typing indicators, persistent chat history and instant support.
* 🎥 **Live Video Support**— Queue-based video calls, scheduled sessions, in-call messaging and real-time support communication.
* 🖼 **Built-in Image Editing Studio** — Browser-based editor with cropping, filters, color adjustments, color correction, rotation, flipping and real-time preview.
* 🔔 **Real-Time Notification System** — Socket-powered notifications with read status and live updates.
* 🧭 **Structured User Interface Navigation** — Compact user sidebar with account quick-links, profile dropdown menu, and editable profile picture via **SelfieModal** supporting file upload or camera capture.
* 📄 **Professional Web Application Pages** — Includes fully designed Privacy Policy, Terms & Conditions, Contact Us, and About Us pages with user interaction features.

............................................................................................................................

### 🧑‍💼 Admin-side

* 👥 **Customer Management System** — Search, filter & sort customers, monitor online status, block/unblock users, flag fraudulent accounts, and send one-way notifications. View detailed user details with user statistics including returns, refunds, spending patterns, and last purchase data.
* 🎟 **Coupon Campaign Management** — Create and manage advanced coupon campaigns with usage limits, customer targeting, minimum order value, max disounts and product/category eligibility.
* 🏷 **Offer Campaign System** — Launch product-level promotional campaigns with thumbnails editable with Fitlab Image editor, recurrence scheduling, customer segmentation, and performance tracking.
* 📦 **Product Management Suite** — Add products with variants, upload/edit images using Fitlab Image editor, apply discounts, manage stock, block/unblock product and edit product details.
* 📊 **Product Catalog Control** — Advanced filtering, sorting & filtering, grid/list/table views, inventory monitoring, toggle block/unbock, and exporting product data to CSV/PDF.
* 🗂 **Nested Category Architecture** — Create deeply nested product categories with seasonal activation, category discounts, related categories, and badges. Allows to toggle block/unbock. Allows to edit category. Also can search & filter catgeories. Classified categories into tabs.
* 📑 **Order Management System** — Track and update order-level & product-level statuses, manage cancellations, approve returns, and process refunds. Allows advanced filtering, status filtering and sorting of orders with pagination
* 📉 **Business Intelligence Dashboard** — Analyze sales trends, revenue performance, order fulfillment metrics, and customer behavior insights.
* ⚙ **Operations Analytics Dashboard** — Monitor inventory levels, coupon usage, offer conversions, payment performance, and refund statistics.
* 🌍 **Customer Heatmap Analytics** — Geographic visualization of user distribution with top performing regions and customer density insights.
* 🤖 **AI Business Insights Engine** — AI analyzes platform data to generate predictive revenue trends and strategic recommendations.
* 💬 **Admin Support Console** — Manage live chat conversations with customers and respond to user queries in real time.
* 🎥 **Video Support Management** — Handle video call queues, scheduled sessions, support requests, in-call messaging and live assistance.
* 🖼 **Built-in Image Editing Studio** — Browser-based editor with cropping, filters, color adjustments, color correction, rotation, flipping and real-time preview.
* 🧭 **Structured Admin Operations Console** — Persistent sidebar navigation with nested modules, topbar controls, contextual back navigation and seamless admin page pattern background.

............................................................................................................................

### 🏗 Platform & System Features

* 🔐 **Secure Authentication System** — JWT authentication with refresh tokens, Google Sign-In, OTP verification, password recovery and contextual **AuthPrompt and AuthModal** access control, not allowing to access user features by guests
* 🧾 **User Account Recovery & Verification** — Email-based OTP verification with expiration timers & a secure “Forgot Password” reset workflow.
* ⚡ **Robust Error Handling & UX Feedback** — Dedicated error UI components, custom error pages (401/403/404), validation helpers, and graceful failure handling.
* 🔔 **Rich User Interaction System** — Toast notifications using Sonner and React-Toastify for real-time feedback and important alerts.
* ⏳ **Optimized Loading Experience** — Skeleton loaders, custom spinners, and React-spinners to ensure smooth loading states across the platform.
* 🧱 **Modular Frontend Architecture** — Feature-driven React component system with 50+ reusable UI components organized into structured layers (UI, layout, forms, modals, route-guards, socket providers, tools and feature modules) enabling scalable development and maintainable codebase.
* 🏗 **Production-Grade Architecture** — The project follows a scalable modular architecture similar to production-grade React applications, allowing features to evolve independently while maintaining consistent UI patterns.
* 🎨 **Professional Interface System** — Reusable UI architecture with elegant page transitions and micro-interactions powered by Framer Motion and custom CSS animations.
* 📄 **Extensive Pagination System** — Pagination implemented across data-heavy interfaces to ensure efficient browsing, structured navigation, and optimal performance when handling large datasets.
* 🛡 **Strict Form Validation Framework** — Comprehensive validations across all forms using shared validation helpers along with contextual inline validation logic and clear error messaging.
* ⚠ **Confirmation Modal Safeguards** — Confirmation dialogs triggered before destructive or critical actions to prevent accidental operations, alongside several page-specific interactive modals across the platform.

............................................................................................................................

## 🎨 Design

* The UI/UX of FitLab was initially designed in **Figma**.
* The design file is  available in the `/Design` folder.
* Includes initial layout planning, component structure, and UI flow diagrams, although several UI refinements were introduced during development.

---

## ✨ Animation & Interaction System

The platform uses **Framer Motion powered animations & some custom CSS animations** to create a smooth and engaging user experience.

* Context-aware **page transitions and component animations**
* Elegant **micro-interactions for modals, panels and UI elements**
* Smooth **navigation feedback and interaction transitions**

---

## 🧠 Backend Systems & Services

* 🧩 **Modular Node.js Architecture** — Layered backend structured with Controllers, Models, Services, Middleware, CronJobs, AI, utilities, and Routes modules for scalable server-side development.
* 🔐 **Authentication & Security** — JWT auth with refresh tokens, role-based route protection, secure cookies, and middleware-driven validation.
* 🧠 **AI Integration** — AI-powered fitness assistant generating contextual fitness, wrokout, health & business, insights using external APIs.
* 🔄 **Automated Cron Jobs** — Background schedulers managing category activation, coupons' status, recurring offers, fitness dataset updates, and wallet auto-recharge workflows.
* 💳 **Payment & Financial System** — Secure payment integrations with  **Stripe, Razorpay, and PayPal** for handling transactions and subscriptions.
* 🔗 **Webhook Event Processing** — Webhooks used to securely verify payment events and trigger automated wallet recharge workflows.
* 📡 **Real-Time Communication** — WebSocket-powered chat, notifications, and live updates implemented using Socket.io.
* ☁ **Media & External Services** — Cloudinary media storage with integrations for fitness datasets, AI services, and third-party APIs.

---

## ☁ Infrastructure & Deployment

* 🚀 **CI/CD Pipeline** — Automated builds and deployments via  **GitLab CI**  and GIthub Actions.
* 🌍 **Frontend Hosting & CDN** — React frontend deployed on **AWS S3** and distributed globally via  **CloudFront** .
* 🖥 **Backend Infrastructure** — Node.js API hosted on **AWS EC2** with **Nginx reverse proxy** and  **PM2 process management** .
* 🗄 **Database Infrastructure** — Cloud-hosted **MongoDB Atlas** cluster for scalable and managed database operations.
* 🌐 **Domain & DNS** — Domain registered via **BigRock** with DNS routing through  **AWS Route53** .
* 🔐 **Secure Environment Management** — Sensitive credentials managed through environment variables in the CI/CD pipeline.

---

## 📸 Screenshots

---

## 🧩 Platform Capabilities

FitLab is designed as a **multi-domain platform combining fitness training, digital commerce, health monitoring, AI insights, and real-time communication into a unified ecosystem.**

| System                                            | Description                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fitness Commerce Engine**                 | Advanced fitness marketplace supporting deeply nested categories, multi-variant products, intelligent cart system, wishlist planning, smart discount resolution across coupons/offers/category discounts, reviews, testimonials, and order lifecycle management including product/order cancellations. |
| **Exercise Intelligence System**            | Structured exercise database organized by body part, muscle group, equipment, difficulty and variations with GIF demonstrations, detailed instructions, and training video guides integrated with equipment discovery.                                                                                 |
| **Workout Training Engine**                 | Custom workout templates, live workout sessions with timers, set/rep/weight tracking, unfinished workout recovery, workout summaries and training analytics.                                                                                                                                           |
| **Health Monitoring Framework**             | Track BMI, weight, blood pressure, glucose, body composition, waist-hip ratio and other health metrics with reminders and long-term progress visualization.                                                                                                                                            |
| **Interactive Fitness Analytics**           | Advanced dashboards visualizing workout frequency, training volume, calories burned, muscle group distribution and overall fitness progression through interactive charts.                                                                                                                             |
| **AI Coach+ System**                        | Context-aware AI fitness companion generating personalized workout insights, guidance and product recommendations using user activity such as workouts, health tracking, wishlist and order history.                                                                                                   |
| **AI Business Intelligence Layer**          | AI-driven analytics engine generating predictive business insights, revenue trends and strategic recommendations from platform data.                                                                                                                                                                   |
| **Digital Wallet & Payment Infrastructure** | Multi-gateway payment system supporting Razorpay, Stripe, PayPal, wallet payments and COD with webhook-driven automatic recharge, refund management and transaction protection.                                                                                                                        |
| **Order & Transaction Management**          | Complete order lifecycle system supporting tracking, address management, product-level and order-level cancellations, return requests with image verification and automated wallet refunds.                                                                                                            |
| **Authentication & Account Security**       | Secure authentication with JWT access/refresh tokens, Google Sign-In, OTP verification, password recovery workflows and role-based access control.                                                                                                                                                     |
| **Real-Time Communication Infrastructure**  | Socket.io powered real-time notifications, live chat with typing indicators, persistent conversation history and queue-based video support sessions.                                                                                                                                                   |
| **Media Processing Toolkit**                | Browser-based image editing and processing tools supporting cropping, filters, color adjustments, rotation, flipping, compression and real-time preview.                                                                                                                                               |
| **Admin Operations Platform**               | Centralized admin system for customer management, product catalog control, coupon and offer campaigns, order processing, inventory monitoring and advanced business analytics dashboards.                                                                                                              |
| **Customer Intelligence & Analytics**       | Admin dashboards for monitoring customer behavior, order statistics, geographic distribution heatmaps, campaign performance and platform operations metrics.                                                                                                                                           |

---

## 🧑‍💻 User Features

### 🛍 Smart Fitness Marketplace

* Deep **nested product categories** with hierarchical browsing
* Advanced **search, filtering, sorting, and pagination**
* Multiple **product view modes (grid / list)**
* **Product variants** (size, weight, color, hp)
* Real-time **stock visibility and availability indicators**
* **Smart discount resolution** across product, category and campaign offers
* **Automatic best coupon detection** during checkout
* **Wishlist planning system** with priorities, notes, thumbnails, reminders and expiry dates
* Support for **multiple wishlists with shareable/public lists**
* Product **ratings, reviews and testimonials with helpful votes**
* **Offers showcase carousel** highlighting active campaigns with modal exploration of eligible products or categories

............................................................................................................................

### 🔎 Product & Exercise Discovery

Users can explore both **fitness knowledge and equipment discovery** through:

* Exercises categorized by **body part, muscle group, equipment, difficulty level and variations**
* **GIF demonstrations and step-by-step instructions**
* Integrated **YouTube video training guides**
* **Exercise-driven product discovery** recommending suitable equipment
* Helps user visualize & understand the primary and secondary muscle group used in each exerecise
* Related exercise suggestions and guided learning flow

............................................................................................................................

### 🏋️ Workout Training System

* Create **custom workout templates**
* Track **sets, reps, weight and rest timers** during sessions
* **Live workout sessions with timers**
* **Resume unfinished workouts**
* Detailed **workout summaries after each session**
* Long-term **training analytics and performance insights**
* View current and past workout histroy with pagination

............................................................................................................................

### 📊 Fitness & Health Tracking

Track and monitor personal health metrics including:

* **BMI, weight and body composition**
* **Blood pressure and glucose levels**
* **Waist-hip ratio and other indicators**
* Intelligent estimation of **potential health risks based on recorded metrics**
* Weekly and long-term **health progress tracking**
* **Reminder system** to maintain consistent tracking habits

............................................................................................................................

### 📈 Interactive Fitness Dashboards

Visual dashboards provide insights into:

* Workout frequency and training consistency
* Total **volume lifted** over time
* **Calories burned and training intensity**
* **Muscle group distribution analysis**
* Long-term **training progress trends**

............................................................................................................................

### 🤖 Coach+ AI Personal Fitness Companion

Coach+ acts as an **AI-driven fitness assistant** that:

* Provides **personalized workout insights**
* Suggests **training improvements**
* Recommends **relevant fitness products**
* Analyzes **workout history, health metrics, orders and wishlist activity**
* Delivers contextual guidance with responsible **AI safety disclaimers**

............................................................................................................................

### 🛒 Smart Cart System

* Quantity adjustments for products & product removal
* Automatic **best coupon selection**
* **Coupon comparison modal** for replacing applied coupons
* Automatic **Tax calculation**
* **Similar products** recommendations carousal
* **Offers showcase carousel** highlighting active campaigns with modal exploration of eligible products or categories
* **Auto-opening CartSidebar** displaying a quick order & payment summary when items are added to cart for quick checkout navigation

............................................................................................................................

### 💳 Payments, Wallet & Financial System

* Multiple **payment gateways (Razorpay, Stripe, PayPal)**
* **Wallet payments and Cash on Delivery (COD)**
* Integrated **wallet transaction history with intuitive UI**
* **Automatic wallet recharge system via webhooks**
* **Semi-automatic recharge options**
* Robust **payment error handling and retry mechanisms**

............................................................................................................................

### 🤝 Peer-to-Peer Fitness Economy

Users can interact financially within the platform:

* **Lend and borrow funds** between users
* Manage peer transactions **directly through the wallet**
* Transparent transaction tracking

............................................................................................................................

### ❤️ Wishlist Planning System

The wishlist system helps users **organize, track and plan future purchases** efficiently.

* Create and manage **multiple wishlists** with support for **public and sharing lists**
* Edit product images with **Fitlab Image editor**
* Add **priorities, notes, thumbnails, reminders and expiry dates** to wishlist items
* Assign **individual priorities and notes** for products within each list
* **Move products between wishlists** , quickly **add items to cart & track price changes, discounts and availability**
* Manage wishlist products using **search, filtering, sorting and pagination**
* Switch between **grid and list view modes**

............................................................................................................................

### 📦 Product Detail Experience

The product detail page provides a **rich, interactive product exploration experience** designed to help users make confident purchase decisions.

* **Product image gallery with zoom support and **variant selection** (size, weight, color, pack options, etc.)**
* Display of **smart discount resolution** across product, category and offer campaigns
* Clear **price presentation showing original price, discounts and final price**
* Detailed **product specifications and feature descriptions**
* Integrated **average rating with star distribution and review counts**
* Only verified purchasers can add or edit review
* **Supports review sorting and helpful vote ranking**
* **Add to cart and wishlist actions** with real-time feedback
* **Similar product carousal recommendations**

............................................................................................................................

### 🏠 Address Management System

The platform includes a flexible **address management system** that simplifies the checkout and delivery experience.

* Add, edit and delete **multiple delivery addresses**
* Ability to **set a default address**
* **Careful address field validations with structured form inputs**
* Support for **delivery instructions and gift addresses**

............................................................................................................................

### 📄 Checkout Experience

The checkout system is designed to provide a **clear, optimized and secure purchase flow** that minimizes friction while ensuring accurate order processing.

* Structured **order summary panel** displaying selected products, quantities and pricing
* Automatic **smart coupon resolution** to determine the best applicable discount
* Manual **coupon selection and replacement** through a comparison modal
* **Dynamic address selection** from saved delivery addresses
* Support for **multiple payment methods** including **Razorpay, Stripe, PayPal, Wallet and Cash on Delivery (COD)**
* Transparent **tax and final price calculation**
* Robust **payment failure handling with modals and retry mechanisms**
* **Automated wallet refunds** during failures while placing the order
* Immediate **order confirmation with redirection to order summary page showing estimated delivery date**

............................................................................................................................

### 📦 Order Lifecycle & Return Management

* Complete **order lifecycle tracking**
* **Address management with dynamic address selection**
* **Order-level and product-level cancellations**
* **Return requests with image verification**
* **Interactive Fitlab feedback collection** on different services of Fitlab for delivered orders
* Prompt users to **review delivered products**
* Option to **reorder previously purchased products**
* Manage orders using **filtering, sorting and status controls**
* Downloadable **invoice PDFs**

............................................................................................................................

### ⭐ Reviews, Ratings & Testimonials

* **Verified purchase reviews**
* Star-based **rating system**
* **Helpful vote system** for reviews
* Dedicated **testimonial submissions**

............................................................................................................................

### 💬 Real-Time Customer Support

* **Live text chat** with support agents
* **Typing indicators and real-time messaging** using Socket.io
* Persistent **chat history**

............................................................................................................................

### 🎥 Live Video Support

* Queue-based **video consultation sessions**
* **Scheduled support appointments**
* In-call messaging for real-time assistance

............................................................................................................................

### 🔔 Real-Time Notification System

* Socket-powered **instant notifications**
* **Read/unread status tracking**
* Updates for **orders, payments, support and system alerts**
* Also receives notification for wallet balance, health reminders, admin one-way messaging support

Notifications can be:

* marked read
* marked all read

............................................................................................................................

### 🖼 Built-in Media Editing Tools

* Browser-based **image editing studio** built using Canvas api and postMessage api
* **Cropping** and **resizing**
* **Color adjustments** (for adjusting brightness, contrast and saturation)
* **Filters** (for grayscale, sepia, blur & opacity)
* **Color correction** (for RGB channels, temperature, tint & hue rotate)
* **Rotation** and **flipping**
* **Image compression and optimization**
* Each panel has a **reset button** too
* **Real-time preview** before upload

............................................................................................................................

### 🔐 Authentication & Account Security

* Secure **JWT authentication with refresh tokens**
* **Google Sign-In integration**
* **OTP email verification system**
* **Forgot password and secure password reset**
* Role-based account security
* **AuthPrompt system** restricting guest access to sensitive pages with contextual sign-in prompts
* **AuthModal integration** that can be triggered directly when protected features are accessed

............................................................................................................................

## 👤 Profile & Account Personalization

* Update profile picture using **selfie modal** with support for **camera capture or local image upload** after previewing
* Used by both **users and admins for profile customization**
* Allows users to update personal information and main address along with their **fitness goal and weight**

............................................................................................................................

### ⚡ System Experience & UX Enhancements

* Dedicated **error UI components**
* **Custom error pages (401 / 403 / 404)**
* Real-time **toast notifications**
* **Skeleton loaders and React-spinners and custom spinners**
* Graceful failure handling and validation helpers
* Reusable **custom pagination component** used across products, workouts, orders, wishlist, admin tables, etc
* **Confirmation modals for destructive actions** such as deletions to prevent accidental data loss **or during an important action**
* **Strict form validations** across all forms with shared validation helpers and contextual inline validation logic with error messages
* Modular **reusable UI component architecture** ensuring consistent design patterns across user and admin interfaces

............................................................................................................................

### 📄 Informational & Legal Pages

The platform includes professionally designed informational and compliance pages to ensure transparency and user trust.

* **Privacy Policy** and **Terms & Conditions** pages outlining platform policies and user agreements
* **Consent enforcement system** using a custom hook that ensures users acknowledge Terms & Conditions before performing sensitive actions (Checkout, Wallet operations, Payments, Fitness Tracker, and Training modules)
* **Contact Us page** with embedded Google Maps location and user inquiry options with user's mail acknowledgement after enquiry
* **About Us page** describing the platform features, credentials, testimonies, journey, vision, mission and ecosystem

............................................................................................................................

### 👤 User Interface Navigation

* Compact **user sidebar** provides quick access to key account pages such as orders, wallet, wishlist, coupons, checkout, etc
* **User profile dropdown menu** in the header displays account information and quick navigation links
* Profile section includes **profile image editing with camera or file upload support**

---

## 🧑‍💼 Admin Panel Features

### 👥 Customer Management & Moderation

Admins can monitor and manage the entire user base through:

* **Advanced customer search filtering and sorting**
* View **detailed customer profiles**
* Monitor **online/offline user activity status**
* **Block or unblock accounts**
* Flag and track **fraudulent users**
* Send **one-way administrative notifications**
* View **last order details**
* Access **customer spending patterns and activity summaries**
* View **customer statistics** such as- total orders, returns, refunds, wallet balance and more

............................................................................................................................

### 📦 Product & Catalog Management

Admins can fully control the product catalog:

* Add products with **multiple variants** (weight, Hp, size and color)
* Manage **product images,** **thumbnail**
* Edit product images with **Fitlab Image editor**
* Apply **product-level discounts**
* Monitor **stock levels and inventory**
* Edit product specifications and metadata
* Assign categories and sub-categories
* Assign brand, target muscles, tags, etc

............................................................................................................................

### 📊 Product Catalog Visualization & Data Export

Admins can analyze and export platform data:

* Switch between **grid, list and table catalog views**
* Apply **advanced filtering, sorting and searching**
* Export **product data to CSV and PDF**
* Restock inventory
* Toggle block/unblock product
* Edit product details

............................................................................................................................

### 🗂 Nested Category Architecture

The system supports a flexible category structure:

* Create **deeply nested product categories**
* Manage **category hierarchies**
* Enable **seasonal category activation**
* Apply **category-level discounts**
* Configure **related categories and parent category**
* Assign **badges and promotional tags**
* Toggle **block/unblock categories**
* **Edit category details**
* **Classify categories** into tabs for cleaner admin interface
* **Search and filter categories**

............................................................................................................................

### 🎟 Coupon Campaign Management

Admins can launch and manage marketing campaigns:

* Create **percentage, fixed-value coupons, buy one get one coupon, free shipping coupons**
* Configure **minimum order values**
* Set **maximum discount limits**
* Restrict coupons to **specific products or categories**
* Restrict coupons to **specific customers**
* Define **usage limits per user or globally**
* Schedule **coupon expiration**
* Enable or disable **coupons dynamically**
* Track **coupon usage analytics**
* Manage coupons with **search, filtering, sorting and status controls**

............................................................................................................................

### 🏷 Offer Campaign System

Promotional campaigns can be managed with advanced controls:

* Launch **product-level promotional offers**
* Attach **campaign thumbnails** editable with the **FitLab Image Editor**
* Configure **recurring promotional schedules**
* Apply **customer segmentation  (vip / returning / new / all users)**
* Monitor **campaign performance**
* Manage campaigns through **searching, filtering and status controls**
* Enable or disable **offers dynamically**
* Track **conversion rates**

............................................................................................................................

### 📑 Order Lifecycle Management

Admins can control and monitor the full order lifecycle:

* View and manage **all platform orders**
* Track and control **order-level and product-level status transitions**
* Process **order-level and product-level cancellations**
* Review, approve or reject **return requests**
* Verify **return images submitted by customers**
* Initiate **refund processing**
* View **order statistics**- total orders, delivered orders, returned orders & cancelled orders
* Manage orders through **advanced filtering, status filtering and sorting**
* Monitor **wallet refund transactions**

............................................................................................................................

### 📊 Business Intelligence Dashboard

The admin dashboard provides real-time **via different types of charts, tables and stats** for business performance analysis:

* Track **sales and revenue analysis**
* Analyze **order fulfillment metrics**
* Monitor **inventory turnover**
* View **product performance statistics**
* Identify **top-selling products**
* Analyze **customer purchasing behavior**

............................................................................................................................

### ⚙ Operations Analytics Dashboard

Operational insights help maintain platform efficiency: **Different types of charts, tables and stats provides the analytics**

* Monitor **inventory levels**
* Analyze **coupon redemption rates**
* Track **offer campaign conversions**
* Evaluate **payment gateway performance**
* Monitor **refund statistics**
* Track **order cancellation rates**

............................................................................................................................

### 🌍 Customer Heatmap Analytics

Visual geographic analytics show platform reach:

* Geographic **customer distribution**
* Identify **top-performing regions**
* Monitor **regional demand patterns**
* Visualize **user density heatmaps**

............................................................................................................................

### 🤖 AI Business Insights Engine

The platform includes AI-powered operational intelligence:

* Analyze **platform-wide data trends**
* Generate **predictive revenue forecasts**
* Provide **strategic recommendations**
* Identify **growth opportunities**
* Detect **business anomalies**

............................................................................................................................

### 💬 Support Communication Console

Admins can assist users directly through integrated support tools:

* Manage **live customer chat conversations**
* Respond to **support requests**
* Access **chat history and context**
* Handle **multiple conversations simultaneously**

............................................................................................................................

### 🎥 Video Support Operations

Admins can manage live support sessions:

* Monitor **video consultation queues**
* Handle **scheduled video sessions**
* Join **live assistance calls**
* Use **real-time messaging during video calls**
* Coordinate real-time support

............................................................................................................................

### 🔔 Administrative Notification System

* Send **platform-wide notifications**
* Deliver **targeted messages to users**
* Notify users about **campaigns or updates**

............................................................................................................................

### 👤 Admin Interface & Navigation

The admin panel is designed as a **structured operations console** for efficient platform management.

* **Persistent sidebar navigation** with main sections and expandable submenus for structured access to all admin modules
* **Top navigation bar** displaying admin identity
* Contextual **back navigation button** allowing admins to return to the previously visited admin page
* If no previous admin page exists, navigation falls back to the **main admin dashboard**
* Subtle **context-aware background patterns** across admin pages to maintain visual consistency without distraction

---

## 📁 Project Structure

The repository follows a modular full-stack structure separating frontend, backend, and supporting resources.

```bash
FitLab
├── Frontend/                 → React application (UI, components, state management, routing)
├── Backend/                  → Node.js API (controllers, services, middleware, cron jobs, sockets)
├── Design/                   → Figma design files, layout planning, and UI flow diagrams
│
├── .github/workflows/        → GitHub Actions workflows
│   └── mirroring.yml         → GitHub Action that mirrors the repository to GitLab for CI/CD execution
│
├── .gitlab-ci.yml            → CI/CD pipeline for automated build and deployment
├── ecosystem.config.js       → PM2 configuration for production process management
│
├── package.json              → Project dependencies and scripts
├── jsconfig.json             → JavaScript project configuration
└── README.md
```

---

## 🧱 Frontend Architecture

The frontend follows a **modular and scalable component architecture** designed for maintainability, separation of concerns, and feature isolation.

Key architectural patterns include:

* **Component-driven design** with reusable UI components
* **Feature-based folder organization** for complex modules
* **Dedicated layout system** separating global layout from page logic
* **Custom hooks layer** for reusable application logic
* **Centralized state management** using Redux Toolkit
* **Route guards and access control layers** for protected pages
* **Socket providers** for real-time communication
* **Utility and helper modules** for shared logic across the application

```bash
src
├── Api/                    # API client and request configuration
├── Assets/                 # Static assets (images, icons, etc.)
│
├── Components/
│   ├── Common/             # Shared reusable components
│   │
│   ├── Features/           # Feature-driven UI modules
│   │   ├── Auth/
│   │   ├── Cart/
│   │   ├── Category/
│   │   ├── Insights/
│   │   ├── Message/
│   │   ├── Offer/
│   │   ├── Order/
│   │   ├── Product/
│   │   ├── Profile/
│   │   ├── Review/
│   │   ├── Testimony/
│   │   ├── Videochat/
│   │   ├── Wallet/
│   │   └── Wishlist/
│   │
│   ├── Forms/              # Form components & validation helpers
│   ├── Layout/             # Reusable layout building blocks
│   ├── Modals/             # Modal infrastructure
│   ├── Notifications/      # Toast & notification system
│
│   ├── Route-guards/       # Access control wrappers
│   │   ├── AdminRoutesWrapper/
│   │   ├── PrivateAdminRoutes/
│   │   ├── UserRoutesWrapper/
│   │   ├── ProtectedUserRoutes/
│   │   ├── PrivateUserRoutes/
│   │   ├── RestrictedEntryRoutes/
│   │   └── RoutesAccessWrapper/
│   │
│   ├── Socket-providers/   # WebSocket providers
│   ├── Tools/              # UI utility tools
│   └── Ui/                 # Low-level UI primitives
│
├── Hooks/                  # Custom React hooks
│
├── Layouts/                # Page layout systems
│   ├── UserPageLayout/
│   └── AdminPageLayout/
│
├── Pages/                  # Route-level pages
│   ├── User/
│   ├── Admin/
│   └── Error/
│
├── Routes/                 # Centralized routing configuration
│   ├── UserRoutes.jsx
│   ├── AdminRoutes.jsx
│   └── ErrorRoutes.jsx
│
├── Slices/                 # Redux Toolkit state slices
├── Store/                  # Global Redux store
├── Data/                   # Static datasets/configs
└── Utils/                  # Utility helpers
```

---

## ⚙ Backend Architecture

The backend follows a **layered service architecture** separating API routing, business logic, AI orchestration, and data access layers to ensure maintainability and scalability.

Key architectural principles:

* **Controller–Service architecture**
* **Modular AI integration layer**
* **Dedicated middleware layer for authentication and request handling**
* **Service layer for business logic**
* **Webhooks and background jobs for asynchronous operations**

#### **📂 Backend Structure**

```bash
backend
├── AI/
│   ├── constants/       # AI configuration constants
│   ├── prompts/         # Prompt templates for AI interactions
│   ├── providers/       # AI model provider integrations
│   ├── aiOrchestrator.js
│
├── controllers/         # Request handlers for routes
├── cronJobs/            # Scheduled background tasks
├── data/                # Static backend datasets
│
├── middlewares/         # Authentication & request middleware
│   └── authentication.js
│
├── models/              # Database schemas
├── public/              # Static public assets
├── routes/              # API route definitions
│
├── services/            # Business logic layer
│   └── aiCoach.service.js
│
├── sockets/             # Socket.io real-time logic
├── utils/               # Helper utilities
├── webhooks/            # Payment gateway webhook handlers
└── index.js             # Server entry point
```

---

## 🔐 Security Features

* JWT authentication
* Refresh tokens
* Input validation layer
* Protected routes
* Secure payment handling
* Error boundary UI
* Custom error pages (401 / 403 / 404)

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/arun-s3/FitLab.git

# Go to project directory
cd FitLab

# Install backend dependencies
cd Backend
npm install

# Start backend server
npm run backend

# Open another terminal
cd Frontend

# Install frontend dependencies
npm install

# Start frontend server
npm run dev
```

---

# 📌 Future Improvements

* Expand admin panel responsiveness beyond desktop environments
* Mobile application
* Social fitness communities
* Trainer marketplace
* Advanced nutrition AI

---

# 📜 License

This project is licensed under the MIT License.
