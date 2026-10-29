import React from "react";
import "./PrivacyPolicy.scss";
import Navbar from "../../AboutCard/Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="privacy-policy">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <p>
          Welcome to ZealPlane! This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our
          website. By using our site, you consent to the data practices
          described in this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Personal Information:</strong> Information you voluntarily
            provide, such as your name, email address, or other contact details
            when signing up, commenting, or filling out forms.
          </li>
          <li>
            <strong>Account Credentials:</strong> If you create an account, we
            may store your username and encrypted password.
          </li>
          <li>
            <strong>Usage Data:</strong> Pages you visit, time spent on pages,
            click patterns, IP address, and browser/device details.
          </li>
          <li>
            <strong>Cookies & Tracking:</strong> Cookies, web beacons, tags, and
            similar tracking technologies to enhance user experience.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To operate and maintain the website effectively.</li>
          <li>To personalize your experience and deliver relevant content.</li>
          <li>
            To monitor website traffic and usage trends using analytics tools.
          </li>
          <li>To respond to user inquiries and customer service requests.</li>
          <li>
            To detect and prevent fraudulent activity or abuse of services.
          </li>
          <li>
            To send updates, newsletters, or promotional material (only if you
            opt in).
          </li>
        </ul>

        <h2>3. Google AdSense & Third-Party Advertising Policy</h2>
        <p>
          ZealPlane works with third-party advertising vendors, including Google, to serve advertisements when you visit our website. These third-party vendors adhere to the following standards:
        </p>
        <ul>
          <li>
            <strong>Use of Cookies:</strong> Third-party vendors, including Google, use cookies (including the DoubleClick cookie) to serve advertisements based on your prior visits to our website or other websites across the Internet.
          </li>
          <li>
            <strong>Personalized Advertising:</strong> Google's use of advertising cookies enables it and its partners to serve targeted ads to you based on your visits to ZealPlane and/or other websites on the Internet.
          </li>
          <li>
            <strong>Opting Out of Personalized Ads:</strong> You may opt out of personalized advertising by visiting Google's{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noreferrer"
            >
              My Ad Center / Ads Settings
            </a>
            . Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noreferrer"
            >
              aboutads.info
            </a>
            .
          </li>
          <li>
            <strong>How Google Uses Partner Data:</strong> To learn more about how Google collects, processes, and protects your data when you visit sites running Google advertising services, please visit Google's official privacy and terms documentation:{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noreferrer"
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </li>
        </ul>

        <h2>4. Affiliate Advertising Disclosure</h2>
        <p>
          ZealPlane is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and Amazon.com. As an Amazon Associate, we may earn a small referral commission from qualifying purchases at absolutely no additional cost to you.
        </p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>
          We use first-party and third-party cookies, web beacons, and log analytics to remember your preferences, keep you logged into your account, analyze traffic patterns, and optimize site speed. By browsing our website, you consent to our use of cookies.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you disable cookies, some features and interactive tools on ZealPlane may not function properly.
        </p>

        <h2>6. Data Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. However, we may share information with:
        </p>
        <ul>
          <li>
            Trusted third-party service providers that help us operate the
            website.
          </li>
          <li>
            Legal authorities if required by law, subpoena, or regulation.
          </li>
          <li>Business transfers (e.g., merger, sale, or acquisition).</li>
        </ul>

        <h2>7. Third-Party Links</h2>
        <p>
          Our website may include links to other sites. We are not responsible
          for the content or privacy practices of these external websites.
          Please review their policies separately.
        </p>

        <h2>8. Data Security</h2>
        <p>
          We use encryption, secure socket layer (SSL) technology, and regular
          malware scanning to protect your information. Despite these efforts,
          no method of transmission over the internet is 100% secure.
        </p>

        <h2>9. Children’s Privacy</h2>
        <p>
          Our website is not intended for children under the age of 13. We do
          not knowingly collect personal data from children. If you believe we
          have, please contact us and we will delete the information
          immediately.
        </p>

        <h2>10. Your Rights and Choices</h2>
        <ul>
          <li>
            You have the right to access, update, or delete your personal
            information.
          </li>
          <li>
            You can opt out of newsletters or promotional emails at any time.
          </li>
          <li>
            For EU users, you have additional rights under GDPR (data access,
            correction, erasure, etc.).
          </li>
        </ul>

        <h2>11. Changes to This Policy</h2>
        <p>
          We reserve the right to update or change our privacy policy at any
          time. All changes will be posted on this page. Continued use of our
          website following changes indicates acceptance of the revised policy.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or your personal
          data:
        </p>
        <p>
          <strong>Email:</strong> teamzealplane@gmail.com <br />
          <strong>Contact:</strong>{" "}
          <a
            href="https://www.zealplane.com/contact-us"
            target="_blank"
            rel="noreferrer"
          >
            https://www.zealplane.com/contact-us
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
