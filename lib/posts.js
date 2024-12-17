import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')
export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = []
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    const file = await remark()
      .use(html)
      .process(matterResult.content || null)
    // Combine the data with the id
    allPostsData.push({
      id,
      ...matterResult.data,
      content: file.toString()
    })
  }
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}


export async function getPostDataById(id) {
  const posts = await getSortedPostsData()
  return posts.find(post => post.id === id)
}