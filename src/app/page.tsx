import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { LatestPosts } from '@/components/home/LatestPosts'
import { getContactHref } from '@/config/site'
import { getPosts, getProfile, getProjects } from '@/content/loaders'

export default async function Home() {
  const [profile, projects, posts] = await Promise.all([getProfile(), getProjects(), getPosts()])

  return (
    <>
      <Hero headline={profile.headline} photo={profile.photo} contactHref={getContactHref()} />
      <FeaturedProjects projects={projects} />
      <LatestPosts posts={posts} />
    </>
  )
}
