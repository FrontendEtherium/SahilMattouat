import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

export default function HelmetMetaData(props) {
  let location = useLocation();

  let currentUrl = "https://www.all-cures.com" + location.pathname;

  let quote = props.quote !== undefined ? props.quote : "";
  let publishedDate = props.publishedDate;

  let title =
    props.title !== undefined
      ? props.title
      : "All-Cures - Around health and about it | All-Cures";

  let image =
    props.image !== undefined
      ? props.image
      : "https://www.all-cures.com/static/media/Banner2.6d179203.jpg";

  let description =
    props.description !== undefined
      ? props.description
      : "Now a centralized, user powered platform for bringing information on Alternate Systems of medicine from across the world. Covering Ayurveda, Unani, Persian & other systems of medicine, it focuses on your health and well being";

  let hashtag = props.hashtag !== undefined ? props.hashtag : "#allcures";

  // Add canonical URL with fallback to current URL
  let canonicalUrl = props.canonicalUrl || currentUrl;

  let keywords = props.keywords
    ? props.keywords +
      "," +
      " All Cures, all cures, all-cures, cures, treatment, find doctors, Cures From Around The World, Getting You Closer To Cures "
    : "All Cures, all cures, all-cures, cures, treatment, find doctors, Cures From Around The World, Getting You Closer To Cures, ";

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="csrf_token" content="" />
      <meta property="type" content="website" />
      <meta property="url" content={canonicalUrl} />
      <meta name="keywords" content={keywords} />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="_token" content="" />
      <meta property="title" content={title} />
      <meta property="quote" content={quote} />
      <meta name="description" content={description} />
      <meta property="image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:quote" content={quote} />
      <meta property="og:hashtag" content={hashtag} />
      <meta property="og:image" content={image} />
      <meta content="image/*" property="og:image:type" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="AllCures" />
      <meta property="og:description" content={description} />
      <script type="application/ld+json">
        {`
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${description}",
      "image": "${image}",
      "author": {
        "@type": "Organization",
        "name": "All Cures",
        "url": "https://www.all-cures.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "All Cures",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ik.imagekit.io/hg4fpytvry/product-images/tr:w-300,f-webp/assets/img/heart.png"
        }
      },
      "datePublished": "${publishedDate}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      }
    }
    `}
      </script>
    </Helmet>
  );
}
