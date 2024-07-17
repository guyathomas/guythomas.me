import glob from 'fast-glob'

interface Article {
  title: string
  description: string
  author: string
  date: string
  published?: boolean
}

export interface ArticleWithSlug extends Article {
  slug: string
}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(`../app/articles/${articleFilename}`)) as {
    default: React.ComponentType
    article: Article
  }
  console.log('articleFilename', articleFilename)
  return {
    slug: articleFilename.replace('.mdx', ''),
    ...article,
  }
}

function shouldDisplayArticle(article: ArticleWithSlug) {
  return article.published === true
}

export async function getAllArticles() {
  let articleFilenames = await glob('**/*.mdx', {
    cwd: './src/app/articles',
  })

  let articles = (
    await Promise.all(articleFilenames.map(importArticle))
  ).filter(shouldDisplayArticle)

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
