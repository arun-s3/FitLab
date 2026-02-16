import {FileText, Eye, Shield, CreditCard, Activity, Users, Globe, Lock, RefreshCcw, Mail, RotateCcw, Cookie} from "lucide-react"

export const lastUpdated = "28 December 2025" ;

const PrivacyPolicies = [
  {
    id: 1,
    title: "Information We Collect",
    icon: FileText,
    content: `
We collect information you provide directly when you create an account, place orders, use fitness features, or contact support. This includes personal details such as name, email address, phone number, profile information, and preferences.

We also collect fitness-related data you choose to enter, such as workout activity, exercise templates, health metrics, and usage history. Additionally, we automatically collect technical information like IP address, device type, browser, operating system, and pages visited.

Cookies and similar technologies are used to improve site functionality, maintain sessions, and understand user interactions.
    `,
  },

  {
    id: 2,
    title: "How We Use Your Information",
    icon: Eye,
    content: `
Your information is used to operate and improve FitLab’s services. This includes processing orders, managing payments, delivering products, providing customer support, and enabling fitness tracking features.

We use data to personalize your experience, recommend relevant products or workouts, generate insights and dashboards, and improve platform performance. Usage patterns help us optimize features and develop new capabilities.

We do not sell your personal information. Data is only used to deliver services you actively use on FitLab.
    `,
  },

  {
    id: 3,
    title: "Payments & Wallet Information",
    icon: CreditCard,
    content: `
FitLab supports payments through trusted third-party gateways such as Razorpay, Stripe, and PayPal. Payment details are securely processed by these providers and are not stored on FitLab servers.

Wallet transactions, auto-recharge settings, and balance history are stored to enable seamless checkout and financial tracking. Sensitive financial data is encrypted and handled according to industry security standards.
    `,
  },

  {
    id: 4,
    title: "Fitness & Health Data",
    icon: Activity,
    content: `
Fitness and health-related data, including workouts, exercise activity, body measurements, and progress metrics, are collected only to provide tracking, insights, and personalized experiences.

This data remains private to your account and is never shared publicly without your consent. You may edit or remove fitness information at any time from your profile.
    `,
  },

  {
    id: 5,
    title: "Sharing of Information",
    icon: Users,
    content: `
We may share limited information with trusted service providers who assist with payments, order fulfillment, analytics, and customer support. These partners are bound by confidentiality and data protection obligations.

We may disclose information if required by law or to protect the rights, safety, and integrity of FitLab and its users.
    `,
  },

  {
    id: 6,
    title: "Cookies & Tracking Technologies",
    icon: Globe,
    content: `
FitLab uses cookies and similar technologies to maintain login sessions, remember preferences, and analyze platform usage. Cookies help us enhance performance and improve user experience.

You can control cookie preferences through your browser settings, though some features may not function properly if cookies are disabled.
    `,
  },
  {
    id: 7,
    title: "Refund & Cancellation Policy",
    icon: RotateCcw,
    content: `
    At FitLab, we aim to provide a smooth and fair purchase experience.

    • Order Cancellation:
    Orders can be cancelled within 30 days (1 month) from the date of purchase, provided the order has not been marked as non-returnable or fully consumed (such as digital services or subscriptions where applicable).

    • Refund Method:
    All approved refunds are credited exclusively to the user's FitLab Wallet. Refunds are not processed back to the original payment method (credit/debit card, Razorpay, Stripe, PayPal, or Cash on Delivery).

    • Wallet Refunds:
    Refunded wallet balance can be used for future purchases, subscriptions, or services on the FitLab platform. Wallet balances do not expire unless stated otherwise during promotional campaigns.

    • Non-Eligible Items:
    Certain items such as opened supplements, hygiene products, or fully delivered digital services may not be eligible for cancellation or refund. Eligibility details are clearly mentioned on respective product pages.

    • Refund Timeline:
    Once a cancellation or return is approved, wallet refunds are typically processed within 5–7 business days.

    FitLab reserves the right to reject refund requests that violate our policies or show signs of misuse or abuse.
    `,
    },

  {
    id: 8,
    title: "Cookie Policy",
    icon: Cookie,
    content: `
FitLab uses cookies and similar tracking technologies to enhance your browsing experience and improve platform performance.

• What Cookies We Use:
We use essential cookies for login sessions, cart functionality, wallet usage, and secure checkout. We also use analytics cookies to understand user behavior and improve features.

• Why We Use Cookies:
Cookies help us remember your preferences, keep you logged in, analyze traffic patterns, and deliver relevant offers and content.

• Third-Party Cookies:
Some cookies may be set by trusted third-party services such as payment gateways, analytics providers, or customer support tools. These third parties follow their own privacy policies.

• Managing Cookies:
You can control or disable cookies through your browser settings. Please note that disabling certain cookies may affect site functionality, including login, checkout, and personalized features.

By continuing to use FitLab, you consent to our use of cookies as described in this policy.
`,
},

  {
    id: 9,
    title: "Data Security",
    icon: Shield,
    content: `
We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse. This includes encryption, access controls, and secure infrastructure practices.

While we strive to protect your information, no system is completely secure. We continuously monitor and improve our security practices.
    `,
  },

  {
    id: 10,
    title: "Data Retention",
    icon: RefreshCcw,
    content: `
We retain personal and usage data only for as long as necessary to provide services, comply with legal obligations, and resolve disputes.

You may request deletion of your account and associated data, subject to regulatory or operational requirements.
    `,
  },

  {
    id: 11,
    title: "Your Rights & Choices",
    icon: Lock,
    content: `
You have the right to access, update, or correct your personal information. You may manage communication preferences, fitness data visibility, and account settings from your profile.

Where applicable, you may request data export or deletion by contacting our support team.
    `,
  },

  {
    id: 12,
    title: "Contact Us",
    icon: Mail,
    content: `
If you have questions or concerns about this Privacy Policy or how your data is handled, you can reach out to our support team through the Help section or contact us directly via email.

We are committed to transparency and protecting your privacy.
    `,
  },
]

export default PrivacyPolicies
