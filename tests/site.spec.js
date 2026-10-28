import { test, expect } from "@playwright/test";

test("assets, responsive layout and console", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toContainText("LA ACTITUD");
  await expect(page.locator("main section")).toHaveCount(6);
  await expect(page.locator(".service")).toHaveCount(4);
  await expect(page.locator(".gallery-photo")).toHaveCount(6);
  expect(
    await page
      .locator(".gallery-photo img")
      .evaluateAll((images) => new Set(images.map((i) => i.src)).size),
  ).toBe(6);
  expect(
    await page
      .locator(".gallery-photo img")
      .evaluateAll((images) => images.every((i) => !i.src.includes("/hero."))),
  ).toBe(true);
  for (const image of await page.locator(".gallery-photo img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((i) => i.complete && i.naturalWidth > 0))
      .toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(await page.locator("iframe").count()).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: `review/after/${testInfo.project.name}-hero.png`,
  });
  await page.screenshot({
    path: `review/after/${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("primary buttons are useful without WhatsApp and services show details", async ({
  page,
}) => {
  const popups = [];
  page.on("popup", (popup) => popups.push(popup.url()));
  await page.goto("/");
  await page.locator(".hero .book").click();
  await expect(page).toHaveURL(/#servicios$/);
  await page.locator(".service").first().click();
  await expect(page.locator("#dialog-title")).toHaveText("Corte clásico");
  await expect(page.locator("#dialog-copy")).toContainText("referencial");
  await page.locator("#dialog-gallery").click();
  await expect(page.locator("#info-dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#galeria$/);
  await page.locator("#reservas .book").click();
  await expect(page).toHaveURL(/#galeria$/);
  await page.locator(".floating").click();
  await expect(page.locator("#dialog-copy")).toContainText(
    "no recibe reservas",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#info-dialog")).not.toBeVisible();
  await expect(page.locator(".floating")).toBeFocused();
  await page.locator("#contact-info").click();
  await expect(page.locator("#dialog-copy")).toContainText("propietario");
  await page.keyboard.press("Escape");
  expect(popups).toEqual([]);
});

test("all six gallery images, wrapping, keyboard and focus return", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.locator('[data-photo="0"]');
  await opener.click();
  await expect(page.locator("#lightbox")).toBeVisible();
  for (let i = 1; i <= 6; i++) {
    await expect(page.locator("#photo-caption")).toContainText(`${i} / 6`);
    await expect
      .poll(() =>
        page
          .locator("#lightbox img")
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      )
      .toBe(true);
    await page.locator("#next").click();
  }
  await expect(page.locator("#photo-caption")).toContainText("1 / 6");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#photo-caption")).toContainText("6 / 6");
  await page.keyboard.press("Escape");
  await expect(page.locator("#lightbox")).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("navigation, mobile dismissal and reduced motion", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mobile = testInfo.project.name.includes("mobile");
  if (mobile) {
    await page.locator(".menu").click();
    await expect(page.locator(".menu")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(page.locator(".menu")).toBeFocused();
    await page.locator(".menu").click();
  }
  await page.locator('nav a[href="#servicios"]').click();
  await expect(page).toHaveURL(/#servicios$/);
  if (mobile)
    await expect(page.locator(".menu")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  expect(
    await page
      .locator(".service")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});

async function mockConfiguration(page, overrides) {
  await page.route("**/src/site.config.js*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: `${await response.text()}\n${overrides}`,
    });
  });
}

test("configuration requires validation before enabling contact", async ({
  page,
}) => {
  await mockConfiguration(
    page,
    `
    config.whatsapp.number = '56900000000'; config.whatsapp.verified = false;
    config.location.address = 'DIRECCIÓN DE PRUEBA'; config.location.verified = false;
    config.location.mapsEmbedUrl = 'https://www.google.com/maps/embed?pb=test';
    config.instagram.url = 'https://www.instagram.com/example'; config.instagram.verified = false;
  `,
  );
  await page.goto("/");
  await expect(page.locator(".hero .book")).toHaveAttribute(
    "href",
    "#servicios",
  );
  await expect(page.locator("#social")).toHaveCount(0);
  await expect(page.locator(".map-load")).toHaveCount(0);
  await expect(page.locator("#contact-details")).not.toContainText(
    "DIRECCIÓN DE PRUEBA",
  );
});

test("confirmed configuration enables safe links and opt-in map", async ({
  page,
}) => {
  let mapRequests = 0;
  await page.route("https://www.google.com/maps/embed**", (route) => {
    mapRequests++;
    return route.fulfill({
      body: "<html><body>Test map only</body></html>",
      contentType: "text/html",
    });
  });
  await mockConfiguration(
    page,
    `
    config.whatsapp.number = '56900000000'; config.whatsapp.verified = true;
    config.location.address = 'DIRECCIÓN DE PRUEBA'; config.location.verified = true;
    config.location.mapsEmbedUrl = 'https://www.google.com/maps/embed?pb=test';
    config.location.mapsUrl = 'https://www.google.com/maps?q=test';
    config.contact.verified = true; config.contact.hours = ['HORARIO DE PRUEBA'];
    config.instagram.url = 'https://www.instagram.com/example'; config.instagram.verified = true;
  `,
  );
  await page.goto("/");
  await expect(page.locator(".hero .book")).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/56900000000\?text=/,
  );
  await expect(page.locator("#social")).toHaveAttribute(
    "href",
    "https://www.instagram.com/example",
  );
  await expect(page.locator("#contact-details")).toContainText(
    "DIRECCIÓN DE PRUEBA",
  );
  await expect(page.locator("#contact-details")).toContainText(
    "HORARIO DE PRUEBA",
  );
  expect(mapRequests).toBe(0);
  await page.locator(".map-load").click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.google.com/maps/embed?pb=test",
  );
  await expect.poll(() => mapRequests).toBe(1);
});
