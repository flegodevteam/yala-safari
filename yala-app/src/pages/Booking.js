import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const location = useLocation();
  const [nameOnCard, setNameOnCard] = useState("");
  const [error, setError] = useState("");
  const total = location.state?.total || "0.00";
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [bankSlip, setBankSlip] = useState(null);
  const [onlineRef, setOnlineRef] = useState("");
  const navigate = useNavigate();

  const validateCardNumber = (num) => /^\d{16}$/.test(num.replace(/\s/g, ""));
  const validateExpiry = (exp) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "online") {
      if (!onlineRef.trim()) {
        setError("Online transfer reference is required.");
        return false;
      }
    }

    if (paymentMethod === "bank") {
      if (!bankSlip) {
        setError("Please upload your bank payment slip.");
        return false;
      }
    }

    if (paymentMethod === "card") {
      if (!nameOnCard.trim()) {
        setError("Name on card is required.");
        return false;
      }
      if (!validateCardNumber(cardNumber)) {
        setError("Card number must be 16 digits.");
        return false;
      }
      if (!validateExpiry(expiryDate)) {
        setError("Expiry date must be in MM/YY format.");
        return false;
      }
      if (!validateCVV(cvv)) {
        setError("CVV must be 3 digits.");
        return false;
      }
    }

    // Prepare booking data
    const bookingData = {
      ...location.state, // All booking details from Packages.js
      paymentMethod,
      total,
      onlineRef,
      nameOnCard,
      cardNumber,
      expiryDate,
      cvv,
      // If you want to send bankSlip, handle file upload separately
    };

    // Backend API call
    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(true);
        setPaymentFailed(false);
        setTimeout(() => {
          navigate("/package");
        }, 1500);
      } else {
        setPaymentFailed(true);
      }
    } catch (err) {
      setPaymentFailed(true);
    }
    return true;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      {paymentSuccess ? (
        <div className="p-6 bg-green-100 text-green-800 rounded-md text-center font-semibold text-lg">
          Payment Successful! Redirecting...
        </div>
      ) : paymentFailed ? (
        <div className="p-6 bg-red-100 text-red-800 rounded-md text-center font-semibold text-lg">
          Payment Unsuccessful. Please try again.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            if (!handlePay(e)) return;
            // Simulate payment processing
            setTimeout(() => {
              const isSuccess = Math.random() > 0.5;
              if (isSuccess) {
                setPaymentSuccess(true);
                setPaymentFailed(false);
                setTimeout(() => {
                  navigate("/package");
                }, 1500);
              } else {
                setPaymentFailed(true);
              }
            }, 1000);
          }}
        >
          {/* Payment Method Toggle */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              className={`pb-2 px-4 ${
                paymentMethod === "cash"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              Cash on Hand
            </button>
            <button
              type="button"
              className={`pb-2 px-4 ${
                paymentMethod === "online"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              Online Transfer
            </button>
            <button
              type="button"
              className={`pb-2 px-4 ${
                paymentMethod === "bank"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              Bank Payment
            </button>
            <button
              type="button"
              className={`pb-2 px-4 ${
                paymentMethod === "card"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              Credit Card
            </button>
          </div>

          {/* Validation error message */}
          {typeof error === "string" && error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          {paymentMethod === "cash" && (
            <div className="py-8 text-center">
              <p className="text-lg font-medium mb-2">
                Pay with cash at the time of service.
              </p>
              <p className="text-sm text-gray-600">
                No advance payment required.
              </p>
            </div>
          )}

          {paymentMethod === "online" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Online Transfer Reference Number
                </label>
                <input
                  type="text"
                  value={onlineRef}
                  onChange={(e) => setOnlineRef(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter reference number"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                Please transfer the total amount to our account and enter the
                reference number above.
              </div>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Bank Payment Slip
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setBankSlip(e.target.files[0])}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                Please upload a clear image or PDF of your bank payment slip.
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="John Doe"
                  required
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
                  required
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
                    required
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
                    required
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
                <label
                  htmlFor="save-card"
                  className="ml-2 text-sm text-gray-700"
                >
                  Save card for future bookings
                </label>
              </div>
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
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-500 text-white rounded-md font-medium"
          >
            Pay ${total}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentPage;
