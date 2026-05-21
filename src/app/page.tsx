import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, Compass, FileText, Globe2, Image as ImageIcon, LayoutGrid, MapPin, ShieldCheck, Tag, User } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { getHomeEditorialMockPosts, mergeEditorialPostsForHome } from '@/lib/home-editorial-mock'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: Globe2,
  pdf: FileText,
  org: Building2,
  comment: FileText,
  mediaDistribution: Globe2,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (
    value === 'listing' ||
    value === 'classified' ||
    value === 'article' ||
    value === 'image' ||
    value === 'profile' ||
    value === 'sbm' ||
    value === 'mediaDistribution'
  )
    return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

function getDirectoryTone(brandPack: string) {
  if (brandPack === 'market-utility') {
    return {
      shell: 'bg-[#f5f7f1] text-[#1f2617]',
      hero: 'bg-[linear-gradient(180deg,#eef4e4_0%,#f8faf4_100%)]',
      panel: 'border border-[#d5ddc8] bg-white shadow-[0_24px_64px_rgba(64,76,34,0.08)]',
      soft: 'border border-[#d5ddc8] bg-[#eff3e7]',
      muted: 'text-[#5b664c]',
      title: 'text-[#1f2617]',
      badge: 'bg-[#1f2617] text-[#edf5dc]',
      action: 'bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
      actionAlt: 'border border-[#d5ddc8] bg-white text-[#1f2617] hover:bg-[#eef3e7]',
    }
  }
  return {
    shell: 'bg-[#f8fbff] text-slate-950',
    hero: 'bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)]',
    panel: 'border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.08)]',
    soft: 'border border-slate-200 bg-slate-50',
    muted: 'text-slate-600',
    title: 'text-slate-950',
    badge: 'bg-slate-950 text-white',
    action: 'bg-slate-950 text-white hover:bg-slate-800',
    actionAlt: 'border border-slate-200 bg-white text-slate-950 hover:bg-slate-100',
  }
}

function getEditorialTone() {
  return {
    shell: 'bg-[#fbf6ee] text-[#241711]',
    panel: 'border border-[#dcc8b7] bg-[#fffdfa] shadow-[0_24px_60px_rgba(77,47,27,0.08)]',
    soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
    muted: 'text-[#6e5547]',
    title: 'text-[#241711]',
    badge: 'bg-[#241711] text-[#fff1e2]',
    action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
    actionAlt: 'border border-[#dcc8b7] bg-transparent text-[#241711] hover:bg-[#f5e7d7]',
  }
}

function getVisualTone() {
  return {
    shell: 'bg-[#07101f] text-white',
    panel: 'border border-white/10 bg-[rgba(11,18,31,0.78)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]',
    soft: 'border border-white/10 bg-white/6',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    actionAlt: 'border border-white/10 bg-white/6 text-white hover:bg-white/10',
  }
}

function getCurationTone() {
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4] shadow-[0_24px_60px_rgba(91,56,37,0.08)]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    title: 'text-[#261811]',
    badge: 'bg-[#5b2b3b] text-[#fff0f5]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    actionAlt: 'border border-[#ddcdbd] bg-transparent text-[#261811] hover:bg-[#efe3d6]',
  }
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const quickRoutes = enabledTasks.slice(0, 4)

  return (
    <main>
      <section className={tone.hero}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
                <Compass className="h-3.5 w-3.5" />
                Local discovery product
              </span>
              <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
                Search businesses, compare options, and act fast without digging through generic feeds.
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>

              <div className={`mt-8 grid gap-3 rounded-[2rem] p-4 ${tone.panel} md:grid-cols-[1.25fr_0.8fr_auto]`}>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">What do you need today?</div>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">Choose area or city</div>
                <Link href={primaryTask?.route || '/listings'} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Browse now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Verified businesses', `${featuredListings.length || 3}+ highlighted surfaces`],
                  ['Fast scan rhythm', 'More utility, less filler'],
                  ['Action first', 'Call, visit, shortlist, compare'],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-[1.4rem] p-4 ${tone.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{label}</p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className={`rounded-[2rem] p-6 ${tone.panel}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Primary lane</p>
                    <h2 className="mt-2 text-3xl font-semibold">{primaryTask?.label || 'Listings'}</h2>
                  </div>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>{primaryTask?.description || 'Structured discovery for services, offers, and business surfaces.'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickRoutes.map((task) => {
                  const Icon = taskIcons[task.key as TaskKey] || LayoutGrid
                  return (
                    <Link key={task.key} href={task.route} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                      <Icon className="h-5 w-5" />
                      <h3 className="mt-4 text-lg font-semibold">{task.label}</h3>
                      <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Featured businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Strong listings with clearer trust cues.</h2>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-primary hover:opacity-80">Open listings</Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">What makes this different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Built like a business directory, not a recolored content site.</h2>
            <ul className={`mt-6 space-y-3 text-sm leading-7 ${tone.muted}`}>
              <li>Search-first hero instead of a magazine headline.</li>
              <li>Action-oriented listing cards with trust metadata.</li>
              <li>Support lanes for offers, businesses, and profiles.</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(profilePosts.length ? profilePosts : classifiedPosts).slice(0, 4).map((post) => {
              const meta = getPostMeta(post)
              const taskKey = resolveTaskKey('classified', profilePosts.length ? 'profile' : 'classified')
              return (
                <Link key={post.id} href={getTaskHref(taskKey, post.slug)} className={`overflow-hidden rounded-[1.8rem] ${tone.panel}`}>
                  <div className="relative h-44 overflow-hidden">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{meta.category || 'Profile'}</p>
                    <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Quick access to local information and related surfaces.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function splitIntoTwoParagraphs(text: string) {
  const t = text.trim()
  if (!t) return ['', '']
  const splitAt = t.search(/\.\s+[A-Z]/)
  if (splitAt > 80) {
    return [t.slice(0, splitAt + 1).trim(), t.slice(splitAt + 1).trim()]
  }
  const half = Math.floor(t.length / 2)
  const space = t.lastIndexOf(' ', half + 40)
  if (space > 40) return [t.slice(0, space).trim(), t.slice(space).trim()]
  return [t, '']
}

function getPostCategoryLabel(post: SitePost): string {
  const content =
    post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const cat = content.category
  if (typeof cat === 'string' && cat.trim()) return cat.trim()
  const tag = post.tags?.find((t) => typeof t === 'string' && t !== 'mediaDistribution' && t !== 'article')
  if (typeof tag === 'string') return tag
  return 'Update'
}

function EditorialHome({
  primaryTask,
  posts,
  supportTasks,
}: {
  primaryTask?: EnabledTask
  posts: SitePost[]
  supportTasks: EnabledTask[]
}) {
  const defaultEditorialTask: TaskKey =
    primaryTask?.key === 'mediaDistribution' || primaryTask?.key === 'article'
      ? primaryTask.key
      : 'mediaDistribution'

  const postHref = (post: SitePost) =>
    getTaskHref(defaultEditorialTask, post.slug)

  const lead = posts[0]
  const spotlightPosts = posts.slice(1, 7)
  const deckPosts = posts.slice(7, 13)
  const featuredSecondary = posts[1]

  const headline = lead?.title || "Latest Press Releases & Media Updates"
  const summarySource = lead?.summary || SITE_CONFIG.description
  const [bodyA, bodyB] = splitIntoTwoParagraphs(summarySource)
  const secondParagraph = bodyB || SITE_CONFIG.tagline

  return (
    <main className="bg-white text-[#1a1a1a]">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
                Your Trusted <span className="text-blue-600">Partner</span> for
                <br />
                Press Release Distribution
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We help businesses and organizations share their news with the world. 
                Get your press releases distributed to thousands of media outlets and journalists.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
                  Get Started
                </a>
                <a href="/about" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>



        {/* Services Overview */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600">Comprehensive press release distribution and media solutions</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Press Release Distribution</h3>
                <p className="text-gray-600 leading-relaxed">Reach thousands of media outlets with our targeted distribution network. Get your story covered by journalists and publications.</p>
                <a href="/about" className="inline-flex items-center text-blue-600 font-semibold mt-4 hover:text-blue-700">
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Media Relations</h3>
                <p className="text-gray-600 leading-relaxed">Build lasting relationships with media professionals. Our team helps you connect with the right journalists for your industry.</p>
                <a href="/about" className="inline-flex items-center text-blue-600 font-semibold mt-4 hover:text-blue-700">
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics & Reporting</h3>
                <p className="text-gray-600 leading-relaxed">Track your press release performance with detailed analytics. Monitor pickups, engagement, and media coverage in real-time.</p>
                <a href="/about" className="inline-flex items-center text-blue-600 font-semibold mt-4 hover:text-blue-700">
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        
        {/* Testimonials Section */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600">Trusted by leading companies and media professionals worldwide</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">JD</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Jennifer Davis</h4>
                    <p className="text-sm text-gray-600">PR Director, TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"HutdailyNews has transformed our press release strategy. The distribution network is exceptional and the analytics help us track every story's impact."</p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">MR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Michael Roberts</h4>
                    <p className="text-sm text-gray-600">Marketing Manager, StartupHub</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"The media relations support is outstanding. Our stories get picked up by major outlets consistently. Highly recommend their services."</p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">SC</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                    <p className="text-sm text-gray-600">Communications Lead, InnovateCo</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"The platform is intuitive and the results speak for themselves. We've seen a 300% increase in media coverage since partnering with HutdailyNews."</p>
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases Grid */}
        <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Latest Press Releases</h2>
              <Link href="/updates" className="flex items-center gap-1 text-sm font-semibold text-[#1a1f36] hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spotlightPosts.map((post) => {
                const cat = getPostCategoryLabel(post)
                const media = Array.isArray(post.media) ? post.media : []
                const imgUrl = media.find((m: any) => typeof m?.url === 'string' && m.url)?.url
                  || (typeof post.content === 'object' && post.content && Array.isArray((post.content as any).images) ? (post.content as any).images[0] : null)
                  || (typeof post.content === 'object' && post.content && typeof (post.content as any).logo === 'string' ? (post.content as any).logo : null)
                  || null
                return (
                  <Link key={post.id} href={postHref(post)} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-md">
                    <div className="relative h-44 overflow-hidden bg-neutral-100">
                      {imgUrl ? (
                        <img src={imgUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-neutral-100" />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-[#1a1f36] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {cat}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900 group-hover:text-[#1a1f36] transition-colors">
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">{post.summary}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          Press Release
                        </span>
                        <span className="flex items-center gap-2">
                          {post.authorName && <span>{post.authorName}</span>}
                          {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-blue-600 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">Stay Informed</h2>
            <p className="text-xl mb-8 text-blue-100">Get the latest press releases and media insights delivered to your inbox</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-blue-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
            
            <p className="mt-4 text-sm text-blue-100">Join 10,000+ media professionals. No spam, unsubscribe anytime.</p>
          </div>
        </section>

      </div>
    </main>
  )
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 5) : articlePosts.slice(0, 5)
  const creators = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <ImageIcon className="h-3.5 w-3.5" />
              Visual publishing system
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Image-led discovery with creator profiles and a more gallery-like browsing rhythm.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/images'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Meet creators
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={getTaskHref('image', post.slug)}
                className={index === 0 ? `col-span-2 row-span-2 overflow-hidden rounded-[2.4rem] ${tone.panel}` : `overflow-hidden rounded-[1.8rem] ${tone.soft}`}
              >
                <div className={index === 0 ? 'relative h-[360px]' : 'relative h-[170px]'}>
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Visual notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Larger media surfaces, fewer boxes, stronger pacing.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>This product avoids business-directory density and publication framing. The homepage behaves more like a visual board, with profile surfaces and imagery leading the experience.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Creator profile and visual identity surface.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref('sbm', post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 6, { allowMockFallback: false, fresh: false, revalidate: 120 }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const mediaDistributionPosts =
    taskFeed.find(({ task }) => task.key === 'mediaDistribution')?.posts || []
  const editorialRaw = articlePosts.length ? articlePosts : mediaDistributionPosts
  const editorialPosts =
    editorialRaw.length > 0
      ? editorialRaw.slice(0, 16)
      : mergeEditorialPostsForHome(editorialRaw, getHomeEditorialMockPosts(), 16)
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} posts={editorialPosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
