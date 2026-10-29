import React, { useEffect } from "react";
import Navbar from "../../AboutCard/Navbar";
import Footer from "./Footer";
import "./style.scss";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="policyContainer" style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
        <div className="policyContent">
          <h1 style={{ marginBottom: '20px' }}>Refund & Cancellation Policy</h1>
          
          <p>Last Updated: 10/28/2026</p>

          <h3 style={{ marginTop: '30px' }}>1. 100% Free Core Platform & Voluntary Micro-Tipping</h3>
          <p>
            ZealPlane is a 100% free digital reading platform for indie comics, manga analysis, and creator tools. We do not charge subscriptions, paywalls, or digital reading fees. Any monetary contributions made via our platform are strictly voluntary patron micro-tips (₹1/₹10) to support indie artists and creators. If you experience an accidental duplicate tip or payment error, please contact <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8" }}>teamzealplane@gmail.com</a> within 7 days for an immediate refund.
          </p>

          <h3 style={{ marginTop: '30px' }}>2. Dispute Resolution & Voluntary Patronage Cancellation</h3>
          <p>
            If you support a creator through any voluntary micro-patronage or recurring tipping, you may cancel at any time through your account settings or by contacting our support desk. Your cancellation will take effect immediately, and you will not be billed in subsequent cycles. Unrestricted reading access to all public content remains 100% free regardless of patronage status.
          </p>

          <h3 style={{ marginTop: '30px' }}>3. Accidental Charges, Duplicate Billings & Error Resolution</h3>
          <p>
            If technical lag, network interruption, or payment gateway timeout causes an accidental duplicate tip or transaction error, please email your payment receipt or Transaction ID to <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8" }}>teamzealplane@gmail.com</a> within 7 days. Upon prompt verification, duplicate or erroneous amounts are refunded immediately to your original payment method within 5 to 7 business days.
          </p>

          <h3 style={{ marginTop: '30px' }}>4. Changes to This Policy</h3>
          <p>
            We reserve the right to modify this Refund & Cancellation Policy at any time. Any changes will be effective immediately upon posting on this page.
          </p>

          <h3 style={{ marginTop: '30px' }}>5. Contact Us</h3>
          <p>
            For any billing inquiries, transaction verifications, or refund assistance, contact our dedicated support desk at: <br />
            <strong>Email:</strong> <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8" }}>teamzealplane@gmail.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
