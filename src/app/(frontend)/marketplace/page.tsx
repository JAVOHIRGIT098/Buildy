import { MarketplaceBrowser } from '@/components/MarketplaceBrowser'
import { getProducts, mediaData } from '@/lib/buildy-data'

export const dynamic = 'force-static'

export default async function MarketplacePage() {
  const products = await getProducts()
  return (
    <section className="page-shell py-14 md:py-20">
      <p className="eyebrow">Buildy Marketplace</p>
      <h1 className="section-title mt-3">Qurilish materiallari bozori</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        Materiallarni qidiring, UZS narxlarini solishtiring va yetkazib beruvchiga
        to‘g‘ridan-to‘g‘ri so‘rov yuboring.
      </p>
      <div className="mt-10">
        <MarketplaceBrowser
          products={products.map((p) => ({
            id: String(p.id),
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: p.price,
            unit: p.unit,
            supplierName: p.supplierName,
            location: p.location,
            stockStatus: p.stockStatus,
            isDemo: p.isDemo,
            image: mediaData(p.image),
          }))}
        />
      </div>
    </section>
  )
}
