/*
  visChange
  This procedure reports a change in the visible content of a page between two times.
  WARNING: This test uses the Playwright page.screenshot method, which produces incorrect results
  when the browser type is chromium and is not implemented for the firefox browser type. The only
  browser type usable with this test is webkit.
*/

// IMPORTS

const pixelmatch = require('pixelmatch');
const {PNG} = require('pngjs');

// FUNCTIONS

// Creates and returns a screenshot.
const shoot = async (page, exclusion = null) => {
  // Make a screenshot as a buffer.
  const options = {
    fullPage: false,
    omitBackground: true,
    timeout: 2000
  };
  if (exclusion) {
    options.mask = [exclusion];
  }
  return await page.screenshot({
  })
  .catch(error => {
    console.log(`ERROR: Screenshot failed (${error.message})`);
    return '';
  });
};
exports.visChange = async (page, options = {}) => {
  const {delayBefore, delayBetween, exclusion} = options;
  // Wait, if required.
  if (delayBefore) {
    await page.waitForTimeout(delayBefore);
  }
  // Make a screenshot.
  const shot0 = await shoot(page, exclusion);
  // If it succeeded:
  if (shot0.length) {
    // Wait as specified, or 3 seconds.
    await page.waitForTimeout(delayBetween || 3000);
    // Make another screenshot.
    const shot1 = await shoot(page, exclusion);
    // If it succeeded:
    if (shot1.length) {
      // Get the shots as PNG images.
      const pngs = [shot0, shot1].map(shot => PNG.sync.read(shot));
      // Get their dimensions.
      const {width, height} = pngs[0];
      // Get the count of differing pixels between the shots.
      const pixelChanges = pixelmatch(pngs[0].data, pngs[1].data, null, width, height);
      // Get the ratio of differing to all pixels as a percentage.
      const changePercent = Math.round(100 * pixelChanges / (width * height));
      // Return this.
      return {
        success: true,
        width,
        height,
        changePercent
      };
    }
    // Otherwise, i.e. if the second screenshot failed:
    else {
      // Return this.
      return {
        success: false
      };
    }
  }
  // Otherwise, i.e. if the screenshot failed:
  else {
    // Return this.
    return {
      success: false
    };
  }
};
