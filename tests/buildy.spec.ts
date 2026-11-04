import { test, expect, type Page } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import {
  boundedText,
  calculateEstimate,
  normalizePhone,
  validPassword,
} from '../src/lib/buildy-validation'

test('validation rejects truncated credentials and invalid estimator inputs', () => {
  expect(validPassword('x'.repeat(129))).toBe(false)
  expect(validPassword(' valid password ')).toBe(true)
  expect(boundedText('x'.repeat(101), 2, 100)).toBeNull()
  expect(normalizePhone('+998 90 123 45 67')).toBe('+998901234567')
  expect(normalizePhone('not-a-phone')).toBeNull()
  for (const invalid of [0, -1, NaN, Infinity, 2001]) {
    expect(calculateEstimate(invalid, 1, 'standard')).toBeNull()
  }
  expect(calculateEstimate(120, 1, 'standard')?.cost).toBe(504_000_000)
  expect(calculateEstimate(120, 2, 'standard')?.cost).toBe(1_008_000_000)
  expect(calculateEstimate(120, 1, 'premium')?.cost).toBe(680_400_000)
})

test('public routes and listing images render without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const routes = [
    '/',
    '/about',
    '/ai-assistant',
    '/contact',
    '/faq',
    '/login',
    '/register',
    '/jobs',
    '/marketplace',
    '/professionals',
  ]
  for (const list of ['/marketplace', '/professionals', '/jobs']) {
    await page.goto(list)
    const links = await page
      .locator('main a[href]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href') || ''))
    routes.push(...links.filter((link) => /^\/(products|professionals|jobs)\/[^/]+$/.test(link)))
  }
  for (const route of [...new Set(routes)]) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('main h1')).toBeVisible()
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded()
      await expect
        .poll(() => img.evaluate((node: HTMLImageElement) => node.naturalWidth))
        .toBeGreaterThan(0)
    }
  }
  expect(errors).toEqual([])
})

test('search, filters, empty states and mobile navigation work', async ({ page }) => {
  await page.goto('/marketplace?q=sement')
  await expect(page.getByLabel('Mahsulot qidirish')).toHaveValue('sement')
  await expect(page.locator('main a[href^="/products/"]')).toHaveCount(1)
  await page.getByLabel('Mahsulot qidirish').fill('')
  await page.getByLabel('Mahsulot kategoriyasi').selectOption('steel')
  await expect(page.locator('main a[href^="/products/"]')).toHaveCount(1)
  await page.getByLabel('Mahsulot hududi').selectOption('Samarqand')
  await expect(page.getByText('Mos mahsulot topilmadi')).toBeVisible()
  await page.goto('/professionals')
  await page.getByLabel('Mutaxassis qidirish').fill('non-existent-profession')
  await expect(page.getByText('Mos mutaxassis topilmadi')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/', '/marketplace', '/ai-assistant', '/login']) {
    await page.goto(route)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      route,
    ).toBe(true)
  }
  const menu = page.getByRole('button', { name: 'Menyuni ochish' })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page
    .getByRole('navigation', { name: 'Mobil navigatsiya' })
    .getByRole('link', { name: 'Ishlar', exact: true })
    .click()
  await expect(page).toHaveURL(/\/jobs$/)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('estimator hides results for invalid input and applies the selected parameters', async ({
  page,
}) => {
  await page.goto('/ai-assistant')
  const area = page.getByLabel('Har bir qavat maydoni')
  await expect(page.getByRole('heading', { name: /504/ })).toBeVisible()
  await area.fill('2001')
  await expect(page.locator('main').getByRole('alert')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'To‘g‘ri maydon kiriting' })).toBeVisible()
  await area.fill('')
  await expect(page.locator('main').getByRole('alert')).toBeVisible()
  await area.fill('120')
  await page.getByLabel('Qavatlar soni').selectOption('2')
  await expect(page.getByRole('heading', { name: /1.*008.*000.*000/ })).toBeVisible()
})

test('anonymous users cannot read private data or submit authenticated requests', async ({
  page,
  request,
}) => {
  for (const slug of ['users', 'requests', 'contact-messages']) {
    const response = await request.get(`/api/${slug}`)
    expect([401, 403]).toContain(response.status())
  }
  const response = await request.post('/api/requests', {
    data: {
      type: 'product-inquiry',
      subject: 'Unauthorized test',
      message: 'Unauthorized test request',
    },
  })
  expect([401, 403]).toContain(response.status())
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)
  const missing = await request.get('/products/not-a-real-product')
  expect(missing.status()).toBe(404)
})

async function registerAndLogin(page: Page, name: string) {
  const email = `buildy-qa-${randomUUID()}@example.com`
  const password = ` QA-${randomUUID()} `
  await page.goto('/register')
  await page.getByLabel('To‘liq ism').fill(name)
  await page.getByLabel('Telefon').fill('+998901234567')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Parol', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Hisob yaratish', exact: true }).click()
  await expect(page).toHaveURL(/\/login$/, { timeout: 30_000 })
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Parol', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Tizimga kirish', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
  await expect(page.getByRole('heading', { name: `Xush kelibsiz, ${name}` })).toBeVisible()
}

test('signup, session, requests, access isolation and native logout work end to end', async ({
  page,
  browser,
  request,
}) => {
  await registerAndLogin(page, 'Buildy QA Customer')
  await expect(page.locator('header').getByRole('link', { name: 'Shaxsiy kabinet' })).toBeVisible()
  const session = (await page.context().cookies()).find((cookie) => cookie.name === 'app-session')!
  expect(session.httpOnly).toBe(true)
  const headers = { Authorization: `JWT ${session.value}` }
  const meResponse = await request.get('/api/users/me', { headers })
  expect(meResponse.status()).toBe(200)
  const { user } = await meResponse.json()
  const escalation = await request.patch(`/api/users/${user.id}`, {
    headers,
    data: { role: 'employer', verificationStatus: 'verified' },
  })
  expect(escalation.status()).toBe(200)
  const after = await (await request.get('/api/users/me', { headers })).json()
  expect(after.user.role).toBe('customer')
  expect(after.user.verificationStatus).not.toBe('verified')
  const contacts = await request.get('/api/contact-messages', { headers })
  expect([401, 403]).toContain(contacts.status())
  await page.goto('/products/portland-sement-m400')
  await page.getByLabel('So‘rov izohi').fill('Buildy QA: sinov uchun material haqida so‘rov.')
  await page.getByRole('button', { name: 'Xarid so‘rovini yuborish', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('So‘rovingiz saqlandi')
  await page.getByRole('link', { name: 'So‘rovlarimni ko‘rish' }).click()
  await expect(
    page.locator('main').getByText('Portland sement M400', { exact: true }),
  ).toBeVisible()
  const own = await (await request.get('/api/requests?depth=0', { headers })).json()
  expect(own.docs).toHaveLength(1)
  expect(own.docs[0].owner).toBe(user.id)
  expect(own.docs[0].status).toBe('new')
  const id = own.docs[0].id
  const patch = await request.patch(`/api/requests/${id}`, {
    headers,
    data: { status: 'accepted' },
  })
  expect([401, 403]).toContain(patch.status())
  await page.goto('/products/portland-sement-m400')
  await page.getByLabel('So‘rov izohi').fill('Buildy QA: takror yuborishni tekshirish.')
  await page.getByRole('button', { name: 'Xarid so‘rovini yuborish', exact: true }).click()
  await expect(page.locator('main').getByRole('status')).toContainText('so‘rov yuborilgan')
  for (const [route, label] of [
    ['/professionals/aziz-r-elektrik', 'Xizmat so‘rovini yuborish'],
    ['/jobs/qurilish-uchastkasi-ustasi', 'Vakansiyaga ariza yuborish'],
  ]) {
    await page.goto(route)
    await page.getByLabel('So‘rov izohi').fill('Buildy QA: xizmat yoki ish arizasi sinovi.')
    await page.getByRole('button', { name: label, exact: true }).click()
    await expect(page.locator('main').getByRole('status')).toContainText('So‘rovingiz saqlandi')
  }
  const allOwn = await (await request.get('/api/requests?depth=0', { headers })).json()
  expect(allOwn.docs).toHaveLength(3)
  const forged = await request.post('/api/requests', {
    headers,
    data: {
      type: 'product-inquiry',
      subject: 'Buildy QA invalid target',
      message: 'Buildy QA: mismatched target test.',
      target: { relationTo: 'professionals', value: 'not-a-product' },
    },
  })
  expect(forged.status()).toBe(400)
  const other = await browser.newContext()
  const otherPage = await other.newPage()
  await registerAndLogin(otherPage, 'Buildy QA Other Customer')
  const otherSession = (await other.cookies()).find((cookie) => cookie.name === 'app-session')!
  const stolen = await request.get(`/api/requests/${id}`, {
    headers: { Authorization: `JWT ${otherSession.value}` },
  })
  expect([401, 403, 404]).toContain(stolen.status())
  const privateList = await (
    await request.get('/api/requests', { headers: { Authorization: `JWT ${otherSession.value}` } })
  ).json()
  expect(privateList.docs).toEqual([])
  const stolenProfile = await request.get(`/api/users/${user.id}`, {
    headers: { Authorization: `JWT ${otherSession.value}` },
  })
  expect([401, 403, 404]).toContain(stolenProfile.status())
  await otherPage.getByRole('button', { name: 'Chiqish', exact: true }).click()
  await expect(otherPage).toHaveURL(/\/$/)
  await other.close()
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Chiqish', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.locator('header').getByRole('link', { name: 'Kirish', exact: true }),
  ).toBeVisible()
  expect((await page.context().cookies()).some((cookie) => cookie.name === 'app-session')).toBe(
    false,
  )
  const revoked = await (await request.get('/api/users/me', { headers })).json()
  expect(revoked.user).toBeNull()
})

test('an invalid app session cannot open a protected dashboard', async ({ page }) => {
  await page
    .context()
    .addCookies([{ name: 'app-session', value: 'invalid-session', url: 'http://localhost:3000' }])
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)
})

test('contact form persists a private message and displays honest confirmation', async ({
  page,
}) => {
  await page.goto('/contact')
  await page.getByLabel('Ism', { exact: true }).fill('Buildy QA Contact')
  await page.getByLabel('Email', { exact: true }).fill('buildy-qa@example.com')
  await page.getByLabel('Xabar', { exact: true }).fill('Buildy QA: contact form regression test.')
  await page.getByRole('button', { name: 'Xabar yuborish' }).click()
  await expect(page.getByRole('status')).toContainText('Xabaringiz qabul qilindi')
  await expect(page.getByRole('button', { name: 'Xabar qabul qilindi' })).toBeDisabled()
})
