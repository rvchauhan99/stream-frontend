import { Check } from "lucide-react";

const subscriptionPlans = [
  {
    name: "Basic",
    price: "9.99",
    features: [
      "HD Quality Streaming",
      "Watch on 1 Device",
      "Ad-Free Experience",
      "Download Videos",
      "7-Day Free Trial",
    ],
    popular: false,
    buttonVariant: "outline",
  },
  {
    name: "Premium",
    price: "19.99",
    features: [
      "4K Ultra HD Streaming",
      "Watch on 4 Devices",
      "Ad-Free Experience",
      "Download Videos",
      "30-Day Free Trial",
      "Exclusive Content Access",
      "Priority Support",
    ],
    popular: true,
    buttonVariant: "default",
  },
  {
    name: "Pro",
    price: "29.99",
    features: [
      "8K Ultra HD Streaming",
      "Watch on Unlimited Devices",
      "Ad-Free Experience",
      "Download Videos",
      "45-Day Free Trial",
      "Exclusive Content Access",
      "24/7 Priority Support",
      "Early Access to New Features",
      "Custom Profile Themes",
    ],
    popular: false,
    buttonVariant: "outline",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-[#0f1216] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get unlimited access to our premium content with our flexible
            subscription plans. Cancel anytime.
          </p>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-[#1a1f25] p-8 ${
                plan.popular
                  ? "border-2 border-purple-500 shadow-lg shadow-purple-500/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit px-4 py-1 bg-purple-500 rounded-full text-white text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-[#2a2f35] text-white hover:bg-[#3a3f45]"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Need help? Check out our{" "}
            <a href="/faq" className="text-purple-500 hover:text-purple-400">
              FAQ page
            </a>{" "}
            or{" "}
            <a href="/contact" className="text-purple-500 hover:text-purple-400">
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
