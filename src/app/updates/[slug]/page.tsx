import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Globe2, Mail, Phone, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPostMetadata } from '@/lib/seo'
import type { SitePost } from '@/lib/site-connector'
import { notFound } from 'next/navigation'

export const revalidate = 300

export async function generateStaticParams() {
  const posts = await fetchTaskPosts('mediaDistribution', 50)
  if (!posts.length) return [{ slug: 'placeholder' }]
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = await fetchTaskPostBySlug('mediaDistribution', resolvedParams.slug)
  return post
    ? await buildPostMetadata('mediaDistribution', post)
    : {
        title: `Press Release Not Found - ${SITE_CONFIG.name}`,
        description: 'The requested press release could not be found.',
      }
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

function renderContent(content: any): string {
  if (typeof content === 'string') return content
  if (typeof content === 'object' && content !== null) {
    if (typeof content.body === 'string') return content.body
    if (typeof content.content === 'string') return content.content
    if (typeof content.text === 'string') return content.text
  }
  return ''
}

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await fetchTaskPostBySlug('mediaDistribution', resolvedParams.slug)

  if (!post) notFound()

  const relatedPosts = await fetchTaskPosts('mediaDistribution', 6)
  const filteredRelatedPosts = relatedPosts.filter((p) => p.id !== post.id).slice(0, 3)
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const fullUrl = `${baseUrl}/updates/${post.slug}`

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.summary || post.metaDescription,
    image: getPostImage(post),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: post.authorName || SITE_CONFIG.name,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: baseUrl,
      logo: `${baseUrl}${SITE_CONFIG.defaultOgImage}`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavbarShell />

      <main>
        {/* Breadcrumb */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-6 lg:px-8">
          <nav className="mx-auto flex max-w-4xl items-center gap-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/updates" className="hover:text-neutral-900 transition-colors">Press Releases</Link>
            <span>/</span>
            <span className="truncate text-neutral-700">{post.title}</span>
          </nav>
        </div>

        {/* Article header */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              <FileText className="h-3.5 w-3.5" />
              {getPostCategoryLabel(post)}
            </span>

            <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>

            {post.summary && (
              <p className="mt-4 text-lg leading-relaxed text-neutral-500">{post.summary}</p>
            )}

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-b border-neutral-200 py-4 text-sm text-neutral-500">
              {post.authorName && (
                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {post.authorName}
                </span>
              )}
            </div>

            {/* Share */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1DA1F2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a8cd8] transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0077B5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#005885] transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#166FE5] transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
                Facebook
              </a>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                <Share2 className="h-3.5 w-3.5" />
                Copy Link
              </button>
            </div>
          </div>
        </section>

        {/* Featured image */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <img
                src={getPostImage(post)}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Article body */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {renderContent(post.content) ? (
              <div
                className="prose prose-neutral max-w-none text-neutral-700 [&_h2]:text-neutral-900 [&_h3]:text-neutral-900 [&_a]:text-[#1a1f36] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />
            ) : (
              <div className="py-16 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                <p className="text-neutral-500">Content for this press release will be available soon.</p>
              </div>
            )}

            {/* Media contact box */}
            <div className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <h3 className="text-base font-semibold text-neutral-900">Media Contact</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  media@{SITE_CONFIG.domain}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  +1 (555) 123-4567
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-500">
                For media inquiries, interview requests, or additional information, please contact our media relations team.
              </p>
            </div>

            {/* Back link */}
            <div className="mt-10">
              <Link
                href="/updates"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Press Releases
              </Link>
            </div>
          </div>
        </section>

        {/* Related articles */}
        {filteredRelatedPosts.length > 0 && (
          <section className="border-t border-neutral-200 bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-6 text-xl font-bold text-neutral-900">Related Press Releases</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRelatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/updates/${relatedPost.slug}`} className="group">
                    <article className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm">
                      <span className="inline-flex w-fit items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {getPostCategoryLabel(relatedPost)}
                      </span>
                      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900 group-hover:text-[#1a1f36] transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.summary && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">
                          {relatedPost.summary}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <SchemaJsonLd data={schemaData} />
    </div>
  )
}
