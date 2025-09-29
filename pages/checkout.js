"use client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { GET_PAYMENT_GATEWAYS } from "../graphql/queries/checkout";
import { CHECKOUT } from "../graphql/mutations/checkout";

export default function CheckoutPage() {
  const { data, loading: loadingGateways } = useQuery(GET_PAYMENT_GATEWAYS);
  const [checkout, { loading: loadingCheckout }] = useMutation(CHECKOUT);

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "VN",
    city: "",
    address1: "",
    postcode: "",
  });

  const [shipping, setShipping] = useState({
    address1: "",
    city: "",
    country: "VN",
    postcode: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const handleBillingChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });

    // Nếu đang bật sameAsBilling thì update shipping luôn
    if (sameAsBilling) {
      setShipping({
        address1: billing.address1,
        city: billing.city,
        country: billing.country,
        postcode: billing.postcode,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const toggleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setShipping({
        address1: billing.address1,
        city: billing.city,
        country: billing.country,
        postcode: billing.postcode,
      });
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await checkout({
        variables: {
          input: {
            billing: {
              firstName: billing.firstName,
              lastName: billing.lastName,
              email: billing.email,
              phone: billing.phone,
              address1: billing.address1,
              city: billing.city,
              postcode: billing.postcode,
              country: billing.country,
            },
            shipping: sameAsBilling
              ? {
                  firstName: billing.firstName,
                  lastName: billing.lastName,
                  address1: billing.address1,
                  city: billing.city,
                  postcode: billing.postcode,
                  country: billing.country,
                }
              : {
                  firstName: shipping.firstName,
                  lastName: shipping.lastName,
                  address1: shipping.address1,
                  city: shipping.city,
                  postcode: shipping.postcode,
                  country: shipping.country,
                },
            paymentMethod,
            clientMutationId: "next-checkout",
          },
        },
      });
      setOrderResult(data.checkout.order);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (orderResult) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Order Successful!
        </h2>
        <p>
          <strong>Order Number:</strong> {orderResult.orderNumber}
        </p>
        <p>
          <strong>Status:</strong> {orderResult.status}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleCheckout} className="space-y-6">
        {/* Billing */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Billing Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={billing.firstName}
              onChange={handleBillingChange}
              required
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={billing.lastName}
              onChange={handleBillingChange}
              required
              className="border p-3 rounded-lg w-full"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={billing.email}
            onChange={handleBillingChange}
            required
            className="border p-3 rounded-lg w-full mt-3"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={billing.phone}
            onChange={handleBillingChange}
            required
            className="border p-3 rounded-lg w-full mt-3"
          />
          <input
            type="text"
            name="address1"
            placeholder="Street Address"
            value={billing.address1}
            onChange={handleBillingChange}
            required
            className="border p-3 rounded-lg w-full mt-3"
          />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={billing.city}
              onChange={handleBillingChange}
              required
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={billing.postcode}
              onChange={handleBillingChange}
              required
              className="border p-3 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Shipping */}
        <div>
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="sameAsBilling"
              checked={sameAsBilling}
              onChange={(e) => toggleSameAsBilling(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="sameAsBilling" className="font-semibold">
              Shipping same as billing
            </label>
          </div>
          {!sameAsBilling && (
            <>
              <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
              <input
                type="text"
                name="address1"
                placeholder="Street Address"
                value={shipping.address1}
                onChange={handleShippingChange}
                required
                className="border p-3 rounded-lg w-full mb-3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  required
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  name="postcode"
                  placeholder="Postcode"
                  value={shipping.postcode}
                  onChange={handleShippingChange}
                  required
                  className="border p-3 rounded-lg w-full"
                />
              </div>
            </>
          )}
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
          {loadingGateways ? (
            <p>Loading gateways...</p>
          ) : (
            <div className="space-y-2">
              {data?.paymentGateways?.nodes?.map((gateway) => (
                <label
                  key={gateway.id}
                  className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={gateway.id}
                    checked={paymentMethod === gateway.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  />
                  <span>
                    <strong>{gateway.title}</strong> - {gateway.description}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loadingCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loadingCheckout ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
