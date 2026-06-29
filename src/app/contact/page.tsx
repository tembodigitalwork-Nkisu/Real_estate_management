import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { ContactForm } from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about a property or a general enquiry.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const property = Array.isArray(sp.property) ? sp.property[0] : sp.property;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Have a question about a property or want to list yours with us? Send a
          message and our team will respond promptly.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            {[
              { icon: MapPin, label: 'Office', value: 'Lusaka, Zambia' },
              { icon: Mail, label: 'Email', value: 'hello@acaciaproperties.zm' },
              { icon: Phone, label: 'Phone', value: '+260 000 000 000' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="rounded-lg bg-brand-50 p-2">
                  <Icon className="h-5 w-5 text-brand-600" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 p-6 shadow-sm">
            <ContactForm property={property} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
