/*
  allCaps
  This test reports leaf elements whose text contents are at least 8 characters long and are
  entirely upper-case. Blocks of upper-case text are difficult to read.
*/
// Runs the test and returns the results.
exports.reporter = async (page, withItems) => {
  // Identify the elements with upper-case text longer than 7 characters.
  const data = await page.$$eval('body *', (elements, withItems) => {
    // Returns a space-minimized copy of a string.
    const compact = string => string
    .replace(/[\t\n]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 100);
    // Get the leaf elements.
    const leafElements = elements.filter(element => ! element.children.length);
    // Get those with text contents longer than 7 characters.
    const textElements = leafElements.filter(element => compact(element.textContent).length > 7);
    // Get those with all-cap text.
    const allCapElements = textElements.filter(element => {
      const elementText = compact(element.textContent);
      if (elementText === elementText.toUpperCase()) {
        return true;
      }
      else {
        const styleDec = window.getComputedStyle(element);
        return styleDec['text-transform'] === 'uppercase';
      }
    });
    // Initialize the result.
    const data = {
      total: allCapElements.length
    };
    // If itemization is required:
    if (withItems) {
      // Add an itemization to the result.
      data.items = [];
      allCapElements.forEach(allCapElement => {
        data.items.push({
          tagName: allCapElement.tagName,
          id: allCapElement.id || '',
          text: compact(allCapElement.textContent)
        });
      });
    }
    return data;
  }, withItems);
  // Get the totals.
  const totals = [data.total, 0, 0, 0];
  // Get the required standard instances.
  const standardInstances = [];
  if (data.items) {
    data.items.forEach(item => {
      standardInstances.push({
        ruleID: 'allCaps',
        what: `${item.tagName} element has entirely upper-case text`,
        ordinalSeverity: 0,
        tagName: item.tagName.toUpperCase(),
        id: item.id,
        location: {
          doc: '',
          type: '',
          spec: ''
        },
        excerpt: item.text
      });
    });
  }
  else {
    standardInstances.push({
      ruleID: 'allCaps',
      what: 'Elements have entirely upper-case texts',
      ordinalSeverity: 0,
      count: data.total,
      tagName: '',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
  }
  return {
    data,
    totals,
    standardInstances
  };
};