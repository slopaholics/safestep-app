const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  console.log('='.repeat(60));
  console.log('SAFESTEP VERSION COMPARISON ANALYSIS');
  console.log('='.repeat(60));

  // ============================================
  // ANALYZE MANUS (ORIGINAL) VERSION
  // ============================================
  console.log('\n📱 ANALYZING MANUS VERSION (Original)...\n');

  const manusPage = await browser.newPage({ viewport: { width: 390, height: 844 } });

  manusPage.on('console', msg => {
    if (msg.type() === 'error') console.log('  [Manus Error]:', msg.text().substring(0, 100));
  });

  try {
    await manusPage.goto('https://safestepband.manus.space/mobile', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for React to render
    await manusPage.waitForTimeout(3000);

    await manusPage.screenshot({ path: '/tmp/manus-original.png', fullPage: true });
    console.log('  Screenshot saved: /tmp/manus-original.png');

    // Extract page content and structure
    const manusAnalysis = await manusPage.evaluate(() => {
      const getTextContent = () => document.body.innerText;
      const getButtons = () => Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        classes: b.className
      }));
      const getInputs = () => Array.from(document.querySelectorAll('input')).map(i => ({
        type: i.type,
        placeholder: i.placeholder,
        classes: i.className
      }));
      const getImages = () => Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.src,
        alt: i.alt
      }));
      const getColors = () => {
        const computed = getComputedStyle(document.body);
        return {
          background: computed.backgroundColor,
          color: computed.color
        };
      };
      const getHeadings = () => Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim()
      }));
      const getLinks = () => Array.from(document.querySelectorAll('a')).map(a => a.innerText.trim()).filter(t => t);

      return {
        title: document.title,
        textContent: getTextContent(),
        buttons: getButtons(),
        inputs: getInputs(),
        images: getImages(),
        headings: getHeadings(),
        links: getLinks(),
        bodyClasses: document.body.className,
        rootHTML: document.getElementById('root')?.innerHTML?.substring(0, 500) || 'No root element'
      };
    });

    console.log('  Title:', manusAnalysis.title);
    console.log('\n  --- PAGE CONTENT ---');
    console.log(manusAnalysis.textContent.substring(0, 1500));
    console.log('\n  --- BUTTONS ---');
    manusAnalysis.buttons.forEach(b => console.log('    •', b.text || '[no text]'));
    console.log('\n  --- INPUTS ---');
    manusAnalysis.inputs.forEach(i => console.log('    •', i.type, '-', i.placeholder || '[no placeholder]'));
    console.log('\n  --- HEADINGS ---');
    manusAnalysis.headings.forEach(h => console.log('    •', h.tag + ':', h.text));
    console.log('\n  --- LINKS ---');
    manusAnalysis.links.slice(0, 10).forEach(l => console.log('    •', l));
    console.log('\n  --- IMAGES ---');
    manusAnalysis.images.forEach(i => console.log('    •', i.alt || i.src.substring(0, 50)));

  } catch (err) {
    console.log('  Error loading Manus version:', err.message);
  }

  // ============================================
  // ANALYZE OUR VERSION
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('📱 ANALYZING OUR VERSION (Current Build)...\n');

  const ourPage = await browser.newPage({ viewport: { width: 390, height: 844 } });

  ourPage.on('console', msg => {
    if (msg.type() === 'error') console.log('  [Our Error]:', msg.text().substring(0, 100));
  });

  try {
    await ourPage.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    await ourPage.waitForTimeout(2000);

    await ourPage.screenshot({ path: '/tmp/our-version.png', fullPage: true });
    console.log('  Screenshot saved: /tmp/our-version.png');

    const ourAnalysis = await ourPage.evaluate(() => {
      const getTextContent = () => document.body.innerText;
      const getButtons = () => Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        classes: b.className
      }));
      const getInputs = () => Array.from(document.querySelectorAll('input')).map(i => ({
        type: i.type,
        placeholder: i.placeholder
      }));
      const getHeadings = () => Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim()
      }));
      const getLinks = () => Array.from(document.querySelectorAll('a')).map(a => a.innerText.trim()).filter(t => t);

      return {
        title: document.title,
        textContent: getTextContent(),
        buttons: getButtons(),
        inputs: getInputs(),
        headings: getHeadings(),
        links: getLinks()
      };
    });

    console.log('  Title:', ourAnalysis.title);
    console.log('\n  --- PAGE CONTENT ---');
    console.log(ourAnalysis.textContent.substring(0, 1500));
    console.log('\n  --- BUTTONS ---');
    ourAnalysis.buttons.forEach(b => console.log('    •', b.text || '[no text]'));
    console.log('\n  --- INPUTS ---');
    ourAnalysis.inputs.forEach(i => console.log('    •', i.type, '-', i.placeholder || '[no placeholder]'));
    console.log('\n  --- HEADINGS ---');
    ourAnalysis.headings.forEach(h => console.log('    •', h.tag + ':', h.text));
    console.log('\n  --- LINKS ---');
    ourAnalysis.links.forEach(l => console.log('    •', l));

  } catch (err) {
    console.log('  Error loading our version:', err.message);
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('COMPARISON COMPLETE - Check /tmp/*.png for visual comparison');
  console.log('='.repeat(60));
})();
