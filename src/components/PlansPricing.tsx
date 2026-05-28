import React, { useState, useEffect } from "react";
import { Check, Sparkles, Star, Rocket, Landmark, ShieldCheck, Heart } from "lucide-react";

export default function PlansPricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [activePlan, setActivePlan] = useState<string>("Free Standard");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: string; price: number } | null>(null);
  
  const [checkoutCardName, setCheckoutCardName] = useState("");
  const [checkoutCardNum, setCheckoutCardNum] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Sync loaded plan level from localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem("masidy_active_tier");
    if (savedPlan) {
      setActivePlan(savedPlan);
    }
  }, []);

  // Listen for tier updates from other components
  useEffect(() => {
    const handleTierUpdate = (e: any) => {
      setActivePlan(e.detail);
    };
    window.addEventListener("masidy_tier_updated", handleTierUpdate);
    return () => window.removeEventListener("masidy_tier_updated", handleTierUpdate);
  }, []);

  const handleOpenCheckout = (name: string, price: number) => {
    setCheckoutPlan({ name, price });
    setShowCheckout(true);
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutCardName.trim() || !checkoutCardNum.trim()) {
      alert("Please specify card validation coordinates.");
      return;
    }

    setCheckoutSuccess(true);
    
    try {
      if (checkoutPlan) {
        const resp = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            tierName: checkoutPlan.name,
            successUrl: window.location.origin + "/?stripe_checkout_success=true&session_id={CHECKOUT_SESSION_ID}",
            cancelUrl: window.location.origin + "/"
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.stripeSessionUrl) {
            // Real Stripe session found, redirect to secure checkout!
            window.location.href = data.stripeSessionUrl;
            return;
          }

          setActivePlan(data.tier);
          localStorage.setItem("masidy_active_tier", data.tier);
          
          // Dispatch global custom event to signal other components to reload tier data if needed
          window.dispatchEvent(new CustomEvent("masidy_tier_updated", { detail: data.tier }));
        }
      }
    } catch (err) {
      console.error("Payment sync failed:", err);
    }

    setTimeout(() => {
      setCheckoutSuccess(false);
      setShowCheckout(false);
      setCheckoutPlan(null);
      setCheckoutCardName("");
      setCheckoutCardNum("");
    }, 1800);
  };

  const plans = [
    {
      name: "FREE",
      description: "Perfect for trying Masidy with core AI capabilities.",
      price: 0,
      features: [
        "8 requests per minute",
        "1 AI model included",
        "Basic research capabilities",
        "Community support",
        "Local conversation history"
      ],
      icon: Heart,
      color: "border-neutral-200 text-neutral-800",
      buttonText: "Currently Active"
    },
    {
      name: "STARTER",
      description: "$5/month - Unlock research and analysis power.",
      price: billingPeriod === "monthly" ? 5 : 4,
      features: [
        "15 requests per minute",
        "2 AI models included",
        "Advanced research tools",
        "Priority support",
        "Extended history (100 conversations)"
      ],
      icon: Star,
      color: "border-blue-200 text-blue-900",
      buttonText: "Upgrade to Starter"
    },
    {
      name: "BASE",
      description: "$20/month - Professional-grade AI for all tasks.",
      price: billingPeriod === "monthly" ? 20 : 16,
      features: [
        "25 requests per minute",
        "3 AI models included",
        "Expert coding assistance",
        "Priority queue access",
        "Unlimited conversation history"
      ],
      icon: Rocket,
      color: "border-indigo-200 text-indigo-900 border-2 shadow-sm bg-indigo-50/10",
      bonus: true,
      buttonText: "Upgrade to Base"
    },
    {
      name: "PRO",
      description: "$50/month - Elite AI with maximum capability.",
      price: billingPeriod === "monthly" ? 50 : 40,
      features: [
        "50 requests per minute",
        "4 AI models included",
        "Creative AI specialist",
        "Dedicated priority support",
        "Advanced analytics dashboard"
      ],
      icon: Rocket,
      color: "border-purple-200 text-purple-900 border-2",
      buttonText: "Upgrade to Pro"
    },
    {
      name: "MAX",
      description: "$100/month - Ultimate power with maximum capability.",
      price: billingPeriod === "monthly" ? 100 : 80,
      features: [
        "999 requests per minute (unlimited)",
        "All 5 AI models included",
        "Expert general + research + code + creative",
        "24/7 VIP support",
        "Custom model configurations",
        "Reserved capacity guarantee"
      ],
      icon: Landmark,
      color: "border-amber-200 text-amber-900 border-2",
      buttonText: "Upgrade to Max"
    }
  ];

  return (
    <div id="plans-pricing-layout" className="flex-1 bg-neutral-50/40 dark:bg-[#0c0c0e] p-6 md:p-12 overflow-y-auto font-sans transition-colors duration-150">
      <div className="max-w-5xl mx-auto space-y-10 text-center select-none">
        
        {/* Title and billing buttons */}
        <div className="space-y-4">
          <span className="inline-flex items-center space-x-1 py-1 px-3 bg-indigo-500/10 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 dark:border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>EXPRESS GATEWAY SUBSCRIPTIONS</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0d0d0d] dark:text-zinc-100">
             Masidy Workspace Subscription Plans
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
             Unlock dedicated cloud resources, long-form automated scrape crawls, and custom secrets parameter overlays safely.
          </p>

          {/* Billing Switch Button */}
          <div className="inline-flex p-1 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-full pt-1 max-w-xs mx-auto">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingPeriod === "monthly"
                  ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-zinc-200"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingPeriod === "annually"
                  ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-zinc-200"
              }`}
            >
              Billed Annually <span className="text-emerald-500 text-[9px] font-bold">(-20%)</span>
            </button>
          </div>
        </div>

        {/* Current status tier alert */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 max-w-md mx-auto text-xs font-medium flex items-center justify-center space-x-2">
           <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
           <span>Active Space Authorization Grade: <strong className="uppercase">{activePlan}</strong></span>
        </div>

        {/* Cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 max-w-5xl mx-auto w-full pt-4">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const isCurrentlySelected = activePlan === plan.name;
            
            return (
              <div
                key={plan.name}
                className={`flex flex-col justify-between p-6 bg-white dark:bg-zinc-900/60 rounded-3xl border transition-all relative ${
                  isCurrentlySelected 
                    ? "ring-2 ring-indigo-500 border-indigo-500 dark:border-indigo-400" 
                    : "border-neutral-200 dark:border-zinc-800"
                }`}
              >
                {/* Visual indicator badge */}
                {plan.bonus && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 py-1 px-3 bg-indigo-600 dark:bg-indigo-505 text-white font-semibold text-[10px] tracking-wider rounded-full uppercase z-10">
                     Most Popular Choice
                  </span>
                )}

                <div className="text-left space-y-4">
                  
                  {/* Icon Spheroid */}
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-700 dark:text-zinc-350">
                    <PlanIcon className="w-5 h-5" />
                  </div>

                  {/* Pricing and detail titles */}
                  <div>
                    <h3 className="text-base font-bold text-neutral-850 dark:text-zinc-100 font-sans">{plan.name}</h3>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal font-sans tracking-tight">{plan.description}</p>
                  </div>

                  {/* Pricing indicator */}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-sans">${plan.price}</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">/ per user/mo</span>
                  </div>



                  {/* Feature lists */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-zinc-800 space-y-2.5">
                    {plan.features.map((feat, index) => (
                      <div key={index} className="flex items-start space-x-2 text-xs">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-neutral-600 dark:text-zinc-300 leading-tight font-sans font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Submit action button */}
                <div className="pt-6">
                  {isCurrentlySelected ? (
                    <div className="w-full py-2.5 bg-neutral-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorized Active</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout(plan.name, plan.price)}
                      className={`w-full py-2.5 font-bold text-xs rounded-xl cursor-pointer transition-colors text-center ${
                        plan.price === 0
                          ? "bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-705 text-neutral-850 dark:text-zinc-300"
                          : "bg-black hover:bg-neutral-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black"
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Checkout Simulation Drawer Overlay */}
      {showCheckout && checkoutPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left font-sans select-none">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c0c0e] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 shadow-2xl overflow-hidden space-y-4">
            
            <div className="border-b border-neutral-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100">Secure Masidy Subscription Bridge</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-455">Upgrade to {checkoutPlan.name} instantly</p>
            </div>

            <form onSubmit={handleConfirmCheckout} className="space-y-4">
              
              {/* Info matrix */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs font-medium space-y-1">
                 <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-zinc-400">Plan level Selected:</span>
                    <span className="text-neutral-900 dark:text-zinc-100 font-bold uppercase">{checkoutPlan.name}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-zinc-400">Billing frequency:</span>
                    <span className="text-neutral-900 dark:text-zinc-100 font-bold uppercase">{billingPeriod}</span>
                 </div>
                 <div className="flex justify-between pt-1 border-t border-neutral-200 dark:border-zinc-800 font-bold text-neutral-900 dark:text-white mt-1">
                    <span>Target total due:</span>
                    <span>${checkoutPlan.price}.00 / mo</span>
                 </div>
              </div>

              {/* Input Card name */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase block tracking-wider">
                   Owner Name
                </label>
                <input
                  type="text"
                  required
                  value={checkoutCardName}
                  onChange={(e) => setCheckoutCardName(e.target.value)}
                  placeholder="e.g. Admiral Masidy"
                  className="w-full bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus:border-neutral-400 dark:focus:border-zinc-650 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Input Card credit number */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-550 dark:text-zinc-400 font-bold uppercase block tracking-wider">
                   Credit Card Number
                </label>
                <input
                  type="text"
                  maxLength={19}
                  required
                  value={checkoutCardNum}
                  onChange={(e) => setCheckoutCardNum(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  className="w-full bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 focus:border-neutral-400 dark:focus:border-zinc-655 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Prompt controllers */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-205 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg cursor-pointer text-center"
                >
                  Cancel
                </button>

                {checkoutSuccess ? (
                  <button
                    disabled
                    className="flex-1 py-2 bg-emerald-600 dark:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
                  >
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                     <span>Syncing...</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-750 text-white font-bold text-xs rounded-lg cursor-pointer text-center"
                  >
                    Confirm Access
                  </button>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
