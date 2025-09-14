const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  // Ensure screenshots directory exists
  const screenshotsDir = path.join(process.env.HOME, 'Desktop', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false, // Run in headed mode so you can watch
    slowMo: 1000 // Slow down actions so you can observe
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('🔗 Navigating to http://localhost:5173/');
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Screenshot 1: Initial page
    await page.screenshot({
      path: path.join(screenshotsDir, '01-initial-page.png'),
      fullPage: true
    });
    console.log('📸 Screenshot 1: Initial page saved');

    console.log('🖱️ Looking for Add Task button...');

    // Try different selectors for the add task button
    const addTaskSelectors = [
      'button:has-text("Add task")',
      'button:has-text("+ Add task")',
      '[data-testid="add-task"]',
      '.add-task',
      'button[class*="add"]',
      'text="Add task"',
      'text="+ Add task"'
    ];

    let addTaskButton = null;
    for (const selector of addTaskSelectors) {
      try {
        addTaskButton = await page.locator(selector).first();
        if (await addTaskButton.isVisible()) {
          console.log(`✅ Found add task button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!addTaskButton || !(await addTaskButton.isVisible())) {
      console.log('❌ Add task button not found, taking screenshot of current state');
      await page.screenshot({
        path: path.join(screenshotsDir, '02-no-add-button-found.png'),
        fullPage: true
      });

      // Let's check what's actually on the page
      const bodyText = await page.textContent('body');
      console.log('Page content:', bodyText.substring(0, 500));

      // Try clicking anywhere that might trigger the add task modal
      console.log('🖱️ Trying to click on the page to find add task functionality...');
      await page.click('body');
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(screenshotsDir, '03-after-body-click.png'),
        fullPage: true
      });
    } else {
      console.log('🖱️ Clicking Add Task button...');
      await addTaskButton.click();
      await page.waitForTimeout(1000);

      // Screenshot 2: After clicking add task
      await page.screenshot({
        path: path.join(screenshotsDir, '02-add-task-clicked.png'),
        fullPage: true
      });
      console.log('📸 Screenshot 2: Add task modal opened');

      console.log('🖱️ Looking for Priority button...');

      // Try different selectors for priority
      const prioritySelectors = [
        'button:has-text("Priority")',
        '[data-testid="priority"]',
        '.priority',
        'button[class*="priority"]',
        'text="Priority"',
        '[class*="flag"]',
        'svg[class*="flag"]'
      ];

      let priorityButton = null;
      for (const selector of prioritySelectors) {
        try {
          priorityButton = await page.locator(selector).first();
          if (await priorityButton.isVisible()) {
            console.log(`✅ Found priority button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (priorityButton && await priorityButton.isVisible()) {
        console.log('🖱️ Clicking Priority button...');
        await priorityButton.click();
        await page.waitForTimeout(1000);

        // Screenshot 3: After clicking priority
        await page.screenshot({
          path: path.join(screenshotsDir, '03-priority-clicked.png'),
          fullPage: true
        });
        console.log('📸 Screenshot 3: Priority dropdown opened');
      } else {
        console.log('❌ Priority button not found, taking screenshot of modal');
        await page.screenshot({
          path: path.join(screenshotsDir, '03-no-priority-found.png'),
          fullPage: true
        });
      }
    }

    console.log('✅ Screenshot automation completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

    // Keep browser open for 3 seconds so you can see the final state
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Error during automation:', error);
    await page.screenshot({
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);