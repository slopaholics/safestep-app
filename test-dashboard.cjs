const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERROR:', msg.text().substring(0, 200));
  });

  console.log('=== Testing SafeStep Guardian Dashboard ===\n');

  // Test Login Page
  console.log('1. Testing Login Page...');
  await page.goto('http://localhost:3000/#/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/safestep-new-1-login.png', fullPage: true });

  const loginContent = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('   Login page content:', loginContent.substring(0, 200));

  // Login and go to dashboard
  console.log('\n2. Logging in...');
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    await emailInput.fill('test@safestep.com');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  // Test Dashboard
  console.log('\n3. Testing New Guardian Dashboard...');
  await page.goto('http://localhost:3000/#/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/safestep-new-2-dashboard.png', fullPage: true });

  const dashboardContent = await page.evaluate(() => document.body.innerText);
  console.log('   Dashboard content preview:');
  console.log(dashboardContent.substring(0, 1000));

  // Check for key components
  console.log('\n4. Checking components...');
  const components = {
    'Proximity Radar': await page.$('[class*="radar"], [class*="Radar"]') !== null || dashboardContent.includes('128m'),
    'AI Mood': await page.$('[class*="mood"], [class*="Mood"]') !== null || dashboardContent.includes('Happy') || dashboardContent.includes('Mood'),
    'Vitals Panel': dashboardContent.includes('BPM') || dashboardContent.includes('Steps'),
    'Quick Actions': dashboardContent.includes('Call') && dashboardContent.includes('Message'),
    'Bottom Nav': dashboardContent.includes('Home') && dashboardContent.includes('Activity'),
    'SOS Button': dashboardContent.includes('SOS')
  };

  Object.entries(components).forEach(([name, found]) => {
    console.log(`   ${found ? '✅' : '❌'} ${name}`);
  });

  // Take scrolled screenshots
  console.log('\n5. Taking full page screenshots...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/safestep-new-3-dashboard-mid.png' });

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/safestep-new-4-dashboard-bottom.png' });

  await browser.close();

  console.log('\n=== Screenshots saved to /tmp/safestep-new-*.png ===');
})();
