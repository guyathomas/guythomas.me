// eslint-disable-next-line
const path = require("path")

module.exports = {
  siteMetadata: {
    title: `Guy Thomas`,
    author: `Guy Thomas`,
    description: `See what I'm up to now, and what I've been up to`,
    siteUrl: `https://guythomas.me/`,
    social: {
      linkedin: `https://www.linkedin.com/in/guyathomas/`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        fileName: `./src/types/gatsby-graphql.ts`,
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-root-import",
      options: {
        "~components": path.join(__dirname, "src/components"),
        "~templates": path.join(__dirname, "src/templates"),
        "~styles": path.join(__dirname, "src/styles"),
        "~types": path.join(__dirname, "src/types"),
      },
    },
    `gatsby-source-instance-name-for-remark`, // will atatch gatsby-source-filesystem `name` field to node
    `gatsby-plugin-page-transitions`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/notes`,
        name: `notes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: "header-anchor",
              isIconAfterHeader: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },

    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Guy Thomas`,
        short_name: `Guy`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#F8BB10`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography/index.js`,
      },
    },
    `gatsby-plugin-emotion`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /(components|templates)\/.*svg$/,
        },
      },
    },
  ],
}
