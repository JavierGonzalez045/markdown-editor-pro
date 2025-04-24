import { useEffect, useState } from "react";

const ADS_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdSense({ slot, format = "auto", responsive = true }) {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Check for consent before loading ads
    const consentData = localStorage.getItem("gdpr_consent");
    if (consentData) {
      setConsent(JSON.parse(consentData));
    }

    // Listen for consent changes
    const handleStorageChange = (e) => {
      if (e.key === "gdpr_consent") {
        setConsent(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (consent !== null) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("Error loading AdSense:", err);
      }
    }
  }, [consent]);

  // Don't render ads if consent hasn't been given
  if (!consent || !consent.advertising) {
    return null;
  }

  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
