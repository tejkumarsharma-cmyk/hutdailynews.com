import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Filter, FileText, Globe2, Search } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import type { SitePost } from '@/lib/site-connector'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/updates',
    title: `Latest Press Releases - ${SITE_CONFIG.name}`,
    description: `Browse the latest press releases and media updates from ${SITE_CONFIG.name}. Stay informed with breaking news and announcements.`,
    keywords: ['press releases', 'news', 'media updates', 'announcements'],
  })
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage =
    typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
      ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
      : null
  const logo =
    typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
      ? (post.content as any).logo
      : null
  return mediaUrl || contentImage || logo || '/api/placeholder/900/1400?text=Press+Release'
}

function getPostCategoryLabel(post: SitePost): string {
  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const cat = content.category
  if (typeof cat === 'string' && cat.trim()) return cat.trim()
  const tag = post.tags?.find((t) => typeof t === 'string' && t !== 'mediaDistribution' && t !== 'article')
  if (typeof tag === 'string') return tag
  return 'Press Release'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string }
}) {
  const posts = await fetchTaskPosts('mediaDistribution', 30)
  const normalizedCategory = searchParams?.category ? normalizeCategory(searchParams.category) : 'all'
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')

  const filteredPosts = posts.filter((post) => {
    if (normalizedCategory === 'all') return true
    const meta = getPostMeta(post)
    return meta.category.toLowerCase() === normalizedCategory.toLowerCase()
  })

  const schemaItems = filteredPosts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}/updates/${post.slug}`,
    name: post.title,
  }))

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavbarShell />

      <main>
        {/* Page header */}
        <section className="border-b border-neutral-200 bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                <FileText className="h-3.5 w-3.5" />
                Press Releases
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Latest Press Releases
              </h1>
              <p className="mt-3 max-w-2xl text-base text-neutral-500">
                Stay updated with the latest news, announcements, and media updates from {SITE_CONFIG.name}.
              </p>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search press releases..."
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <form className="flex items-center gap-2">
                <select
                  name="category"
                  defaultValue={normalizedCategory}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a1f36] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d3452]"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Results bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                <span className="font-semibold text-neutral-900">{filteredPosts.length}</span>{' '}
                press release{filteredPosts.length !== 1 ? 's' : ''}{' '}
                {normalizedCategory !== 'all' && (
                  <>
                    in{' '}
                    <span className="font-semibold text-neutral-900">
                      {CATEGORY_OPTIONS.find((c) => c.slug === normalizedCategory)?.name || normalizedCategory}
                    </span>
                  </>
                )}
              </p>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                <Calendar className="h-3.5 w-3.5" />
                Latest First
              </button>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/updates/${post.slug}`} className="group">
                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-md">
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden bg-neutral-100">
                        <img
                          src={getPostImage(post)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#1a1f36] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                          {getPostCategoryLabel(post)}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-5">
                        <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900 group-hover:text-[#1a1f36] transition-colors">
                          {post.title}
                        </h2>
                        {post.summary && (
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">
                            {post.summary}
                          </p>
                        )}

                        {/* Footer meta */}
                        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Press Release
                          </div>
                          <div className="flex items-center gap-3">
                            {post.authorName && (
                              <span className="flex items-center gap-1">
                                <Globe2 className="h-3.5 w-3.5" />
                                {post.authorName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                  <FileText className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">No press releases found</h3>
                <p className="mt-1 text-sm text-neutral-500">Try adjusting your filters or search terms.</p>
                <Link
                  href="/updates"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a1f36] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d3452] transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Clear Filters
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="border-t border-neutral-200 bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Stay Updated</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Get the latest press releases delivered directly to your inbox.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
              <button className="rounded-lg bg-[#1a1f36] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d3452]">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <SchemaJsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `Latest Press Releases | ${SITE_CONFIG.name}`,
            url: `${baseUrl}/updates`,
            hasPart: schemaItems,
          },
        ]}
      />
    </div>
  )
}
