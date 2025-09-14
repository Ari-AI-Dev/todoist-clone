const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testUpdatedFlags() {
  const screenshotsDir = path.join(process.env.HOME, 'Desktop', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('🔗 Testing updated priority flags...');
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Click Add Task
    console.log('🖱️ Clicking Add Task...');
    await page.click('button:has-text("Add task")');
    await page.waitForTimeout(1000);

    // Screenshot: Modal opened
    await page.screenshot({
      path: path.join(screenshotsDir, '04-updated-modal.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Updated modal');

    // Click Priority to open dropdown
    console.log('🖱️ Opening Priority dropdown...');
    await page.click('button:has-text("Priority")');
    await page.waitForTimeout(1000);

    // Screenshot: Priority dropdown with updated flags
    await page.screenshot({
      path: path.join(screenshotsDir, '05-updated-priority-flags.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: Updated priority flags');

    // Click High Priority to test selection
    console.log('🖱️ Selecting High Priority...');
    await page.click('button:has-text("High Priority")');
    await page.waitForTimeout(1000);

    // Screenshot: High priority selected
    await page.screenshot({
      path: path.join(screenshotsDir, '06-high-priority-selected.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: High priority selected');

    // Open priority dropdown again to test all flags
    console.log('🖱️ Reopening Priority dropdown to show all flags...');
    await page.click('button:has-text("Priority")');
    await page.waitForTimeout(1000);

    // Screenshot: All priority flags visible
    await page.screenshot({
      path: path.join(screenshotsDir, '07-all-priority-flags.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: All priority flags visible');

    console.log('✅ Priority flag testing completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({
      path: path.join(screenshotsDir, 'test-error.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

testUpdatedFlags().catch(console.error);