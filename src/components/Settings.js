import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

const Settings = () => {
  return (
    <div className="pb-20 px-4 py-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>

      <div className="space-y-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">₹29 — Basic Plan</div>
              <div className="text-sm text-gray-600">1 Month Basic Access</div>
            </div>
            <button className="btn-primary text-sm py-2 px-3">Choose</button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">₹49 — Premium Plan</div>
              <div className="text-sm text-gray-600">1 Month Premium Access</div>
            </div>
            <button className="btn-primary text-sm py-2 px-3">Choose</button>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-primary-500 to-accent-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">₹69 — 6 Months Full Access</div>
              <div className="text-sm opacity-90">Includes Ex Roast Mode</div>
            </div>
            <button className="bg-white text-primary-600 font-medium py-2 px-3 rounded-xl">Go Pro</button>
          </div>
        </div>

        <p className="text-xs text-gray-500">Payment integration coming soon (Razorpay/Stripe). For now, buttons are non-functional.</p>
      </div>
    </div>
  );
};

export default Settings; 