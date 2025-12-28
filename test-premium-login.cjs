const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  console.log('=== Testing Premium Login Page ===\n');

  // Test Desktop View
  console.log('1. Desktop View (1440x900)...');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') console.log('   ERROR:', msg.text().substring(0, 100));
  });

  await desktopPage.goto('http://localhost:3000/#/login', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: '/tmp/premium-login-desktop.png', fullPage: true });
  console.log('   Screenshot: /tmp/premium-login-desktop.png');

  const desktopContent = await desktopPage.evaluate(() => document.body.innerText.substring(0, 800));
  console.log('   Content preview:', desktopContent.substring(0, 300));

  // Test Mobile View
  console.log('\n2. Mobile View (390x844)...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000/#/login', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: '/tmp/premium-login-mobile.png', fullPage: true });
  console.log('   Screenshot: /tmp/premium-login-mobile.png');

  // Test hover states on desktop
  console.log('\n3. Testing hover states...');
  const googleBtn = await desktopPage.$('button:has-text("Google")');
  if (googleBtn) {
    await googleBtn.hover();
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({ path: '/tmp/premium-login-hover.png' });
    console.log('   Hover screenshot: /tmp/premium-login-hover.png');
  }

  // Test login flow
  console.log('\n4. Testing login flow...');
  const emailInput = await mobilePage.$('input[type="email"]');
  if (emailInput) {
    await emailInput.fill('test@safestep.com');
    await mobilePage.waitForTimeout(500);

    const passwordInput = await mobilePage.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.fill('password123');
      await mobilePage.waitForTimeout(500);
    }

    await mobilePage.screenshot({ path: '/tmp/premium-login-filled.png', fullPage: true });
    console.log('   Filled form screenshot: /tmp/premium-login-filled.png');

    // Submit
    const submitBtn = await mobilePage.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await mobilePage.waitForTimeout(2000);
      console.log('   Redirected to:', mobilePage.url());
    }
  }

  await browser.close();
  console.log('\n=== Premium Login Test Complete ===');
})();
