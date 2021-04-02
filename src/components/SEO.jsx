import React from "react"
import { Helmet } from "react-helmet"

import { siteMetadata } from "../config/sitemetadata"

const SEO = ({ title = ``, description = ``, pathname = ``, image = ``, children = null }) => {
  const { siteTitle, siteTitleAlt: defaultTitle, siteUrl, siteDescription: defaultDescription, siteLanguage, siteImage: defaultImage, author } = siteMetadata

  // console.log(defaultDescription);
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
    image: `${image || siteUrl + defaultImage}`,
  }
  return (
    <Helmet title={title} defaultTitle={defaultTitle} titleTemplate={`%s | ${siteTitle}`}>
      {/* <html lang={siteLanguage} /> */}
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:type" content="website" />
      <meta property="og:image:alt" content={seo.description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.description} />
      <meta name="twitter:creator" content={author} />

      {children}
    </Helmet>
  )
}

export default SEO
