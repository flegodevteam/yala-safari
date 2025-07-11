import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const location = useLocation();
  const total = location.state?.total || "0.00";
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      {paymentSuccess ? (
      <div className="p-6 bg-green-100 text-green-800 rounded-md text-center font-semibold text-lg">
        Payment Successful!
      </div>
    ) : (
      <form onSubmit={handlePay}>

      {/* Payment Method Toggle */}
      <div className="flex mb-6 border-b">
        <button
          className={`pb-2 px-4 ${
            paymentMethod === "credit-card"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setPaymentMethod("credit-card")}
        >
          Credit Card
        </button>
        <button
          className={`pb-2 px-4 ${
            paymentMethod === "paypal"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setPaymentMethod("paypal")}
        >
          PayPal
        </button>
      </div>

      {paymentMethod === "credit-card" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="1234 5678 9012 3456"
              maxLength="16"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="save-card"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="h-4 w-4 text-blue-500 rounded"
            />
            <label htmlFor="save-card" className="ml-2 text-sm text-gray-700">
              Save card for future bookings
            </label>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="py-8 text-center">
          <p>You will be redirected to PayPal to complete your payment</p>
        </div>
      )}

      {/* Cancellation Policy */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Cancellation Policy</h3>
        <ul className="text-sm space-y-1">
          <li>• 50% refund if cancelled 24+ hours before</li>
          <li>• No refund for last-minute cancellations</li>
        </ul>
      </div>
      {/* Pay Button */}
      <button type="submit" className="w-full mt-6 py-3 bg-blue-500 text-white rounded-md font-medium">
        Pay ${total}
      </button>
      </form>
  )}
    </div>
  );
};


export default PaymentPage;
