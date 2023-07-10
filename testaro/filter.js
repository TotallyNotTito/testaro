/*
  filter
  This test reports elements whose styles include filter. The filter style property is considered
  inherently inaccessible, because it modifies the rendering of content, overriding user settings,
  and requires the user to apply custom styles to neutralize it, which is difficult or impossible
  in some user environments.
*/

// ########## IMPORTS

// Module to get locator data.
const {getLocatorData} = require('../procs/getLocatorData');

// ########## FUNCTIONS

exports.reporter = async (page, withItems) => {
  // Get locators for all elements in the body.
  const locAll = page.locator('body *');
  const locsAll = loc.all();
  // Initialize the standard results.
  const data = {};
  const totals = [0, 0, 0, 0];
  const standardInstances = [];
  // For each locator:
  for (const loc of locsAll) {

  }
  // Identify the elements with filter style properties.
  const data = await page.evaluate(withItems => {
    // Returns a space-minimized copy of a string.
    const compact = string => string
    .replace(/[\t\n]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 100);
    // Get all elements in the body.
    const elements = Array.from(document.body.querySelectorAll('*'));
    // Get those that have filter styles.
    const filterElements = elements.filter(element => {
      const elementStyles = window.getComputedStyle(element);
      return elementStyles.filter !== 'none';
    });
    const filterData = filterElements.map(element => ({
      element,
      impact: element.querySelectorAll('*').length
    }));
    // Initialize the result.
    const data = {
      totals: {
        styledElements: filterElements.length,
        impactedElements: filterData.reduce((total, current) => total + current.impact, 0)
      }
    };
    // If itemization is required:
    if (withItems) {
      // Add it to the result.
      data.items = [];
      filterData.forEach(filterDatum => {
        data.items.push({
          tagName: filterDatum.element.tagName,
          id: filterDatum.element.id,
          text: compact(filterDatum.element.textContent) || compact(filterDatum.element.outerHTML),
          impact: filterDatum.impact
        });
      });
    }
    return data;
  }, withItems);
  const totals = [0, data.totals.impactedElements, data.totals.styledElements, 0];
  const standardInstances = [];
  if (data.items) {
    data.items.forEach(item => {
      standardInstances.push({
        ruleID: 'filter',
        what: `Element has a filter style; impacted element count: ${item.impact}`,
        ordinalSeverity: 2,
        tagName: item.tagName.toUpperCase(),
        id: item.id,
        location: {
          doc: '',
          type: '',
          spec: ''
        },
        excerpt: item.text.slice(0, 200)
      });
    });
  }
  else if (data.totals.styledElements) {
    standardInstances.push({
      ruleID: 'filter',
      what: 'Elements have filter styles impacting other elements',
      ordinalSeverity: 2,
      count: totals[2],
      tagName: '',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
    standardInstances.push({
      ruleID: 'filter',
      what: 'Elements are impacted by elements with filter styles',
      ordinalSeverity: 1,
      count: totals[1],
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
