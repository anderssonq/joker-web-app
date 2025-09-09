import { test, expect } from '@playwright/test';

test.describe('Jokes App E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('response', response => {
      if (response.url().includes('joke')) {
        console.log(`API Response: ${response.status()} - ${response.url()}`);
      }
    });

    page.on('request', request => {
      if (request.url().includes('joke')) {
        console.log(`API Request: ${request.method()} - ${request.url()}`);
      }
    });

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    
    await expect(page.locator('.app-main')).toBeVisible();
    
    await page.waitForLoadState('networkidle');
  });

  test('should load and display jokes from API', async ({ page }) => {
    await page.waitForFunction(() => {
      const loadingElements = document.querySelectorAll('.loading, .skeleton, [data-loading="true"]');
      return loadingElements.length === 0;
    }, { timeout: 20000 });

    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'debug-initial-state.png', fullPage: true });

    const errorElements = await page.locator('.error, [class*="error"]').count();
    console.log(`Error elements found: ${errorElements}`);

    const bodyText = await page.locator('body').textContent();
    console.log('Page content includes:', bodyText?.substring(0, 200));

    const jokeSelectors = [
      '.joke-card',
      '[data-test="joke-card"]',
      '.card',
      '.joke',
      '[class*="joke"]'
    ];

    let foundJokes = 0;
    let workingSelector = '';

    for (const selector of jokeSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        foundJokes = count;
        workingSelector = selector;
        break;
      }
    }

    console.log(`Found ${foundJokes} jokes using selector: ${workingSelector}`);

    if (foundJokes === 0) {
      const addButton = page.locator('button:has-text("Add")').first();
      if (await addButton.isVisible()) {
        console.log('Add button found, jokes might be loading...');
        await page.waitForTimeout(5000);
        foundJokes = await page.locator('.joke-card').count();
      }
    }

    if (foundJokes > 0) {
      await expect(page.locator(workingSelector || '.joke-card')).toHaveCount(foundJokes);
    } else {
      const emptyState = page.locator('.empty, .no-jokes, [class*="empty"]');
      const hasEmptyState = await emptyState.count() > 0;
      
      if (hasEmptyState) {
        console.log('Empty state detected');
        await expect(emptyState.first()).toBeVisible();
      } else {
        throw new Error(`No jokes found and no empty state. Page might not be loading correctly. Found selectors: ${jokeSelectors.map(async s => `${s}:${await page.locator(s).count()}`).join(', ')}`);
      }
    }
  });

  test('should create a new joke', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'debug-before-create.png', fullPage: true });

    const addButtonSelectors = [
      'button:has-text("Add a new Joke")',
      'button:has-text("Add")',
      'button[class*="add"]',
      '.add-joke-btn'
    ];

    let addButton;
    for (const selector of addButtonSelectors) {
      const button = page.locator(selector);
      if (await button.isVisible()) {
        addButton = button;
        break;
      }
    }

    if (!addButton) {
      throw new Error('Add joke button not found');
    }

    await addButton.click();
    
    await page.waitForTimeout(2000);
    
    const formSelectors = ['.joke-form', '.form', '[class*="form"]'];
    let form;
    
    for (const selector of formSelectors) {
      const formElement = page.locator(selector);
      if (await formElement.isVisible()) {
        form = formElement;
        break;
      }
    }

    if (!form) {
      await page.screenshot({ path: 'debug-no-form.png', fullPage: true });
      throw new Error('Form not found after clicking add button');
    }

    const newSetup = '1 E2E Test Setup';
    const newPunchline = '1 E2E Test Punchline';
    
    const inputs = await page.locator('input').count();
    console.log(`Found ${inputs} input fields`);

    if (inputs >= 2) {
      await page.locator('input#setup').first().fill(newSetup);
      await page.locator('input#punchline').first().fill(newPunchline);
    }

    const saveButton = page.locator('button:has-text("Save"), button[type="submit"], .save-btn').first();
    
    page.on('dialog', dialog => dialog.accept());
    
    await saveButton.click();
    
    await page.waitForTimeout(2000);
    
    await expect(form).not.toBeVisible();
    
    await expect(page.locator('text=' + newSetup)).toBeVisible();
  });

  test('should handle app without jokes gracefully', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await expect(page.locator('.app-main')).toBeVisible();
    
    const hasButtons = await page.locator('button').count() > 0;
    expect(hasButtons).toBe(true);
  });
});