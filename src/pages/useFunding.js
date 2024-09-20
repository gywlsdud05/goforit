import { supabase } from "../supabase.client";
import * as PortOne from "@portone/browser-sdk/v2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useFunding = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [fundingInProgress, setFundingInProgress] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const verifyPayment = async (orderAmount, payment_id) => {
    try {
      console.log("Verifying payment with data:", { orderAmount, payment_id });
      const { data, error } = await supabase.functions.invoke(
        "verify-payment",
        {
          body: { orderAmount, payment_id },
        }
      );
      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }
      if (!data.verified) {
        throw new Error(data.message || "결제 검증에 실패했습니다.");
      }
      console.log("Verification result:", data);
      return data;
    } catch (error) {
      console.error("Error in verifyPayment:", error);
      if (
        error.message ===
        "FunctionsHttpError: Edge Function returned a non-2xx status code"
      ) {
        console.error("Response details:", error.details);
      }
      throw error;
    }
  };

  const createOrderPayment = async (product, user) => {
    const { data, error } = await supabase
      .from("orderPayment")
      .insert({
        buyer_id: user.user_id,
        good_id: product.product_id,
        amountOfproduct: product.price,
        goodName: product.title,
        payment_status: "pending",
        payment_id: `payment-${crypto.randomUUID()}`,
        payMethod: "CARD",
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create order payment");

    return data;
  };

  const handlePayment = async (orderPayment, user) => {
    console.log("Initiating payment", orderPayment);
    const paymentData = {
      storeId: "store-d0e48c91-3c3f-4a73-80d7-ba3ed035b656",
      channelKey: "channel-key-708650d5-9c0e-4fdc-b2c8-d2da57977f3a",
      paymentId: orderPayment.payment_id,
      totalAmount: orderPayment.amountOfproduct,
      orderName: orderPayment.goodName,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      buyer_name: user.nickname || "Unnamed",
      buyer_email: user.email || "user@example.com",
      buyer_tel: "01012341234",
      buyer_addr: "신사동 661-16",
      buyer_postcode: "06018",
    };
    try {
      console.log("paymentData", paymentData);
      const response = await PortOne.requestPayment(paymentData);

      if (response.code != null) {
        console.error("Payment initiation error:", response.message);
        await updateOrderStatus(orderPayment.payment_id, "failed");
        setError(response.message);
        navigate("/payment-failed", {
          state: {
            errorDetails: {
              orderId: orderPayment.payment_id,
              productName: orderPayment.goodName,
              amount: orderPayment.amountOfproduct,
              errorMessage: response.message,
            },
          },
        });
        return;
      }
      await callback(response, orderPayment);
    } catch (error) {
      console.error("Payment initiation error:", error);
      await updateOrderStatus(orderPayment.payment_id, "failed");
      setError("Payment initiation failed. Please try again.");
      navigate("/payment-failed", {
        state: {
          errorDetails: {
            orderId: orderPayment.payment_id,
            productName: orderPayment.goodName,
            amount: orderPayment.amountOfproduct,
            errorMessage: error.message,
          },
        },
      });
    }
  };

  const callback = async (response, orderPayment) => {
    console.log("Payment response received", response);

    try {
      console.log("Verifying payment");
      const result = await verifyPayment(
        orderPayment.amountOfproduct,
        orderPayment.payment_id
      );
      setVerificationStatus(result.verified ? "success" : "failed");

      if (result.verified) {
        console.log("Payment verified, updating order status");
        setPaymentStatus("completed");
        navigate("/payment-success", {
          state: {
            orderDetails: {
              orderId: orderPayment.payment_id,
              productName: orderPayment.goodName,
              amount: orderPayment.amountOfproduct,
            },
          },
        });
      } else {
        throw new Error(`Payment verification failed: ${result.status}`);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      await updateOrderStatus(orderPayment.payment_id, "failed");
      setError(error.message || "Payment processing failed. Please try again.");
      navigate("/payment-failed", {
        state: {
          errorDetails: {
            orderId: orderPayment.payment_id,
            productName: orderPayment.goodName,
            amount: orderPayment.amountOfproduct,
            errorMessage: response.message,
          },
        },
      });
    }
  };

  const updateOrderStatus = async (payment_id, status) => {
    console.log(`Updating order status: ${payment_id} to ${status}`);
    const { data, error } = await supabase
      .from("orderPayment")
      .update({ payment_status: status })
      .eq("payment_id", payment_id)
      .select();

    if (error) throw error;
    if (data && data.length > 0) {
      console.log("Order status updated successfully:", data[0]);
      return { success: true, data: data[0] };
    } else {
      console.error("No rows were updated");
      return { success: false, error: "No rows were updated" };
    }
  };

  const handleFunding = async (product, user) => {
    console.log("Product:", product);
    console.log("User:", user);
    if (!product || !user) {
      setError("Product or user information not available");
      return;
    }

    console.log("Starting funding process");
    setFundingInProgress(true);
    setError(null);
    setPaymentStatus(null);

    try {
      const orderPayment = await createOrderPayment(product, user);
      console.log("Order payment created:", orderPayment);
      await handlePayment(orderPayment, user);
    } catch (err) {
      console.error("Funding Error:", err);
      setError(err.message);
      setPaymentStatus("failed");
    } finally {
      setFundingInProgress(false);
    }
  };

  return {
    error,
    paymentStatus,
    fundingInProgress,
    verificationStatus,
    handleFunding,
  };
};

export default useFunding;
