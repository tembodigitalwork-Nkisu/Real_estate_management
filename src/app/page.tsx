import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Home, KeyRound, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { SearchBar } from '@/components/site/SearchBar';
import { PropertyCard } from '@/components/PropertyCard';
import { getFeaturedProperties } from '@/lib/queries';

export default async function HomePage() {
  const featured = await getFeaturedProperties(3);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-20"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Find a place you will love to call home.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">
            Browse verified houses, apartments and land for sale and rent across
            Zambia, all in one place.
          </p>
          <div className="mt-8 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Home, title: 'Quality listings', body: 'Every property is reviewed before it goes live.' },
            { icon: KeyRound, title: 'Buy or rent', body: 'Find homes for sale or short and long-term rentals.' },
            { icon: ShieldCheck, title: 'Managed with care', body: 'Backed by a full tenant and lease management system.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-slate-200 p-6">
              <Icon className="h-8 w-8 text-brand-600" aria-hidden />
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured properties</h2>
          <Link
            href="/listings"
            className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No featured listings yet. Run the seed script or add properties in the
            portal to see them here.
          </p>
        )}
      </section>

      <Footer />
    </>
  );
}
