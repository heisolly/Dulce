export function initiatePaystackPayment({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onClose,
}: {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  // ──────────────────────────────────────────────────────
  // TODO: Replace this placeholder with the real Paystack
  // Inline JS integration:
  //
  // 1. Add the Paystack popup script in your layout.tsx:
  //    <Script src="https://js.paystack.co/v1/inline.js" />
  //
  // 2. Replace the body of this function with:
  //    const handler = (window as any).PaystackPop.setup({
  //      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  //      email,
  //      amount: amount * 100,  // Paystack uses kobo
  //      currency: 'NGN',
  //      ref: `dulce_${Date.now()}`,
  //      metadata: { name, phone, custom_fields: [] },
  //      callback: (response: { reference: string }) => {
  //        onSuccess(response.reference);
  //      },
  //      onClose,
  //    });
  //    handler.openIframe();
  // ──────────────────────────────────────────────────────

  console.log('[Paystack Placeholder] Payment initiated:', {
    amount,
    email,
    name,
    phone,
    currency: 'NGN',
  });

  // Simulate a successful payment after 1.5 seconds for demo
  setTimeout(() => {
    const mockRef = `dulce_demo_${Date.now()}`;
    console.log('[Paystack Placeholder] Payment success, ref:', mockRef);
    onSuccess(mockRef);
  }, 1500);
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}
