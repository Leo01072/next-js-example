import Link from "next/link"
import Layout from "../../components/layout"
import { getSortedPostsData, getPostDataById } from "../../lib/posts"
export default function FirstPost({ title, content, date }) {
  return (
    <Layout>
      <div>
        <h1>{title}</h1>
        <div>{date}</div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} style={{ whiteSpace: "pre-wrap" }}></div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { id } = params
  const data = await getPostDataById(id)
  const { title = "", content = "", date = "", desc = "" } = data
  return {
    props: {
      title, content, date, desc
    },
  }
}
export async function getStaticPaths() {
  const _paths = await getSortedPostsData()
  const paths = _paths.map((post) => {
    return {
      params: {
        id: post.id
      }
    }
  })
  return {
    paths,
    fallback: false
  }
}