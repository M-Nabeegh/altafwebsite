import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name = "Prof. Dr. Javed Altaf", type = "website", image = "/favicon.png", url = "https://www.javedaltaf.com" }) => {

  // Ensure image is an absolute URL for social sharing and Google Schema
  const absoluteImageUrl = image.startsWith('http') ? image : `https://www.javedaltaf.com${image.startsWith('/') ? '' : '/'}${image}`;

  // Structured Data (JSON-LD) for Google to explicitly understand this page is about a Physician and his photo
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": name,
    "url": url,
    "image": absoluteImageUrl,
    "description": description,
    "medicalSpecialty": "Urology",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressCountry": "PK"
    }
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name="author" content={name} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  );
};

export default SEO;
