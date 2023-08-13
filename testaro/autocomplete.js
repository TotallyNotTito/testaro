/*
  autocomplete
  This test reports failures to equip name and email inputs with correct autocomplete attributes.
*/

// ########## IMPORTS

// Module to perform common operations.
const {init, report} = require('../procs/testaro');
// Module to get locator data.
const {getLocatorData} = require('../procs/getLocatorData');

// ########## FUNCTIONS

// Runs the test and returns the result.
exports.reporter = async (
  page,
  withItems,
  givenLabels = ['first name', 'forename', 'given name'],
  familyLabels = ['last name', 'surname', 'family name'],
  emailLabels = ['email']
) => {
  // Initialize the locators and result.
  const all = await init(page, 'input[type=text], input[type=email], input:not([type])');
  // For each locator:
  const autoValues = {
    'given-name': givenLabels,
    'family-name': familyLabels,
    'email': emailLabels
  };
  for (const loc of all.allLocs) {
    // Get which autocomplete value, if any, its element needs.
    const data = await getLocatorData(loc);
    const lcText = data.excerpt.toLowerCase();
    const neededAutos = Object.keys(autoValues)
    .filter(autoValue => autoValues[autoValue].some(typeLabel => lcText.includes(typeLabel)));
    let neededAuto;
    if (neededAutos.length === 1) {
      neededAuto = neededAutos[0];
    }
    else if (! neededAutos.length && await loc.getAttribute('type') === 'email') {
      neededAuto = 'email';
    }
    // If it needs one:
    if (neededAuto) {
      // Get whether it has the one it needs.
      const actualAuto = await loc.getAttribute('autocomplete');
      const isBad = actualAuto !== neededAuto;
      if (isBad) {
        // Add the locator to the array of violators.
        all.locs.push(loc);
      }
    }
  }
  // Populate and return the result.
  const whats = ['Itemized description', 'Summary description'];
  return await report(withItems, all, 'ruleID', whats, 0);
};

// Runs the test and returns the results.
exports.reporter = async (
  page,
  withItems,
  givenLabels = ['first name', 'forename', 'given name'],
  familyLabels = ['last name', 'surname', 'family name'],
  emailLabels = ['email']
) => {
  const autoValues = {
    'given-name': givenLabels,
    'family-name': familyLabels,
    'email': emailLabels
  };
  // Get locators for all input elements of type text or email.
  const locAll = page.locator('input[type=text], input[type=email], input:not([type])');
  const locsAll = await locAll.all();
  // Initialize the result.
  const data = {};
  const totals = [0, 0, 0, 0];
  const standardInstances = [];
  // For each of the inputs:
  for (const loc of locsAll) {
    // If it requires an autocomplete attribute but does not have it:
    const data = await getLocatorData(loc);
    const lcText = data.excerpt.toLowerCase();
    const neededAutos = Object.keys(autoValues)
    .filter(autoValue => autoValues[autoValue].some(typeLabel => lcText.includes(typeLabel)));
    let neededAuto;
    if (neededAutos.length === 1) {
      neededAuto = neededAutos[0];
    }
    else if (! neededAutos.length && await loc.getAttribute('type') === 'email') {
      neededAuto = 'email';
    }
    if (neededAuto) {
      const actualAuto = await loc.getAttribute('autocomplete');
      if (actualAuto !== neededAuto) {
        // Add to the totals.
        totals[2]++;
        // If itemization is required:
        if (withItems) {
          // Add a standard instance.
          standardInstances.push({
            ruleID: 'autocomplete',
            what: `Input is missing an autocomplete attribute with value ${neededAuto}`,
            ordinalSeverity: 2,
            tagName: 'INPUT',
            id: data.id,
            location: data.location,
            excerpt: data.excerpt
          });
        }
      }
    }
  }
  // If itemization is not required and there are any instances:
  if (! withItems && totals[2]) {
    // Add a summary standard instance.
    standardInstances.push({
      ruleID: 'autocomplete',
      what: 'Inputs are missing applicable autocomplete attributes',
      ordinalSeverity: 2,
      count: totals[2],
      tagName: 'INPUT',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
  }
  // Return the data.
  return {
    data,
    totals,
    standardInstances
  };
};
