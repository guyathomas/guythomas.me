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
      // TODO: This config is shared in storybook config. Can I share this config?
      options: {
        "~templates": path.join(__dirname, "src/templates"),
      },
    },
    {
      resolve: "gatsby-transformer-yaml-full",
      options: {
        plugins: [
          "gatsby-yaml-full-markdown", // Enable !markdown tags
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, '../', 'content/src/blog'),
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, '../', 'content/src/notes'),
        name: `notes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, '../', 'content/src/the-frontend-interview'),
        name: `the-frontend-interview`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, '../', 'content/src/assets'),
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, '../', 'content/src/resume'),
        name: `resume`,
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
          {
            resolve: "@guyathomas/gatsby-remark-embedded-codesandbox",
            options: {
              directory: path.resolve(__dirname, '../', 'content/src/the-frontend-interview/codesandbox/'),
            },
          },
        ],
      },
    },

    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
