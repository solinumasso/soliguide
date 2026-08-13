import { expect, test } from '@playwright/test';

/**
 * The theme is driven by the `x-forwarded-host` header set per Playwright
 * project, so the expectations are keyed by project name.
 */
const THEME_EXPECTATIONS = {
  'soliguide-fr': {
    brandName: 'Soliguide',
    assetsDirectory: 'soliguide_fr',
    documentLanguage: 'fr',
    languageCount: 11,
    organizationName: 'Solinum',
    legalHostname: 'soliguide.fr',
    hasPracticalFiles: true,
    hasBecomeTranslator: true
  },
  'soliguia-es': {
    brandName: 'Soliguia',
    assetsDirectory: 'soliguia_es',
    documentLanguage: 'ca',
    languageCount: 7,
    organizationName: 'Solidigital',
    legalHostname: 'soliguia.cat',
    hasPracticalFiles: false,
    hasBecomeTranslator: false
  },
  'soliguia-ad': {
    brandName: 'Soliguia',
    assetsDirectory: 'soliguia_ad',
    documentLanguage: 'ca',
    languageCount: 7,
    organizationName: 'Solidigital',
    legalHostname: 'soliguia.ad',
    hasPracticalFiles: false,
    hasBecomeTranslator: false
  }
} as const;

type ThemeName = keyof typeof THEME_EXPECTATIONS;

const getExpectations = (projectName: string) => THEME_EXPECTATIONS[projectName as ThemeName];

test.describe('Language selection page', () => {
  test('shows the illustration of its own theme', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await page.goto('/languages');

    const illustration = page.locator('section.page-body img').first();
    await expect(illustration).toHaveAttribute(
      'src',
      `/images/themes/${expectations.assetsDirectory}/illustration-language-selection.svg`
    );
  });

  test('names its own brand', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await page.goto('/languages');

    await expect(page.getByText(expectations.brandName, { exact: false })).toBeVisible();
  });

  test('offers only the languages of its country, default one first', async ({
    page
  }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await page.goto('/languages');

    const languageOptions = page.locator('section.page-body label');
    await expect(languageOptions).toHaveCount(expectations.languageCount);
    await expect(languageOptions.first()).toContainText(
      expectations.documentLanguage === 'fr' ? 'Français' : 'Català'
    );
  });

  test('declares the document language and direction', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await page.goto('/languages');

    await expect(page.locator('html')).toHaveAttribute('lang', expectations.documentLanguage);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});

test.describe('More options page', () => {
  /** The layout sends visitors to /languages until a language has been picked. */
  const selectDefaultLanguage = async (page: import('@playwright/test').Page, language: string) => {
    await page.goto('/languages');
    await page.evaluate((selectedLanguage) => {
      window.localStorage.setItem('lngSet', '1');
      window.localStorage.setItem('i18nextLng', selectedLanguage);
    }, language);
  };

  test('hides the features that are not available in the country', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await selectDefaultLanguage(page, expectations.documentLanguage);
    await page.goto(`/${expectations.documentLanguage}/more-options`);

    const practicalFilesCard = page.getByRole('button', { name: /plus d'infos|més info/iu });
    const becomeTranslatorRow = page.locator('a[href="https://airtable.com/shrZHYio1ZdnPl1Et"]');

    await expect(practicalFilesCard).toHaveCount(expectations.hasPracticalFiles ? 1 : 0);
    await expect(becomeTranslatorRow).toHaveCount(expectations.hasBecomeTranslator ? 1 : 0);
  });

  test('links the legal documents to its own website', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await selectDefaultLanguage(page, expectations.documentLanguage);
    await page.goto(`/${expectations.documentLanguage}/more-options`);

    const legalLinks = page.locator(`a[href*="${expectations.legalHostname}/"]`);
    await expect(legalLinks).toHaveCount(5);
  });

  test('links to the organization operating the country', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await selectDefaultLanguage(page, expectations.documentLanguage);
    await page.goto(`/${expectations.documentLanguage}/more-options`);

    await expect(page.getByText(expectations.organizationName, { exact: false })).toBeVisible();
  });
});

test.describe('Menu', () => {
  test('gives no access to the chat', async ({ page }, testInfo) => {
    const expectations = getExpectations(testInfo.project.name);

    await page.goto('/languages');
    await page.evaluate((selectedLanguage) => {
      window.localStorage.setItem('lngSet', '1');
      window.localStorage.setItem('i18nextLng', selectedLanguage);
    }, expectations.documentLanguage);
    await page.goto(`/${expectations.documentLanguage}`);

    await expect(page.locator('#chat')).toHaveCount(0);
  });
});
