export function formatUZS(value: number) {
  if (!Number.isFinite(value)) return '—'
  // Uzbek ICU data differs between Node and Chromium. Keep SSR/client output identical.
  const [whole, fraction] = value.toFixed(2).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const decimals = fraction.replace(/0+$/, '')
  return `${grouped}${decimals ? `,${decimals}` : ''} so‘m`
}
