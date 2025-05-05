'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../store/hooks';
import {
  selectCurrentUser,
  setCredentials,
} from '../../../store/slices/authSlice';

import {
  useGetAllPlansQuery,
  useGetPlanByIdQuery,
} from '../../../store/api/planApi';
import {
  useSubscribeToPlanMutation,
  useGetSubscriptionQuery,
} from '../../../store/api/subscriptionApi';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SubscriptionsPage() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [subscribeToPlan] = useSubscribeToPlanMutation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const {
    data: subscriptionData,
    isLoading: loadingSubscription,
  } = useGetSubscriptionQuery();

  const subscriptionPlanId = useMemo(() => {
    return subscriptionData?.planId || null;
  }, [subscriptionData?.planId]);

  const {
    data: activePlan,
    isLoading: loadingPlan,
  } = useGetPlanByIdQuery(subscriptionPlanId!, {
    skip: !subscriptionPlanId,
  });

  const {
    data: allPlans,
    isLoading: loadingAll,
  } = useGetAllPlansQuery(undefined, {
    skip: !!subscriptionPlanId,
  });

  const handleConfirmSubscribe = async () => {
    try {
      const transactionId = `txn_${Date.now()}`;
      const response = await subscribeToPlan({
        planId: selectedPlan._id,
        amountPaid: selectedPlan.price,
        transactionId,
        paymentMethod: 'card',
      }).unwrap();

      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...localUser, subscriptionId: response.planId };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(setCredentials({ user: updatedUser, token: localStorage.getItem('token') || '' }));

      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Subscription failed');
    } finally {
      setShowConfirm(false);
    }
  };

  const isLoading = loadingAll || loadingPlan || loadingSubscription;
  const plans = subscriptionPlanId ? [activePlan] : allPlans;

  return (
    <div className="min-h-screen bg-[#0f1216] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            {subscriptionPlanId ? 'Your Current Plan' : 'Choose Your Perfect Plan'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {subscriptionPlanId
              ? 'Here are the benefits of your current subscription plan.'
              : 'Get unlimited access to our premium content with our flexible subscription plans. Cancel anytime.'}
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans?.map((plan: any) => (
              <div
                key={plan._id}
                className={`relative rounded-2xl bg-[#1a1f25] p-8 ${
                  plan.name === 'Premium'
                    ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                    : ''
                }`}
              >
                {plan.name === 'Premium' && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-fit px-4 py-1 bg-purple-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {!subscriptionPlanId && (
                  <Button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowConfirm(true);
                    }}
                    className={`w-full ${
                      plan.name === 'Premium'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-[#2a2f35] hover:bg-[#3a3f45]'
                    } text-white`}
                  >
                    Get Started
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!subscriptionPlanId && (
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">
              Need help? Check out our{' '}
              <a href="/faq" className="text-purple-500 hover:text-purple-400">FAQ page</a> or{' '}
              <a href="/contact" className="text-purple-500 hover:text-purple-400">contact support</a>.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-[#1a1f25] rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Subscription</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to subscribe to the <strong>{selectedPlan?.name}</strong> plan for <strong>${selectedPlan?.price}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleConfirmSubscribe}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
