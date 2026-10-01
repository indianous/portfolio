import { GitHubSection } from '@/components/github/GitHubSection'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { LatestPosts } from '@/components/home/LatestPosts'
import { getContactHref } from '@/config/site'
import { getPosts, getProfile, getProjects } from '@/content/loaders'
import { getGitHubProfile } from '@/lib/github/client'

export default async function Home() {
  const [profile, projects, posts, github] = await Promise.all([
    getProfile(),
    getProjects(),
    getPosts(),
    getGitHubProfile(),
  ])

  return (
    <>
      <Hero headline={profile.headline} photo={profile.photo} contactHref={getContactHref()} />
      <FeaturedProjects projects={projects} />
      <GitHubSection profile={github} />
      <LatestPosts posts={posts} />
    </>
  )
}
