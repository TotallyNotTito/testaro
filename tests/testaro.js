/*
  testaro
  This test implements the Testaro evaluative ruleset for accessibility.
*/

// CONSTANTS

const evalRules = {
  allHidden: 'page that is entirely or mostly hidden',
  autocomplete: 'name and email inputs without autocomplete attributes',
  bulk: 'large count of visible elements',
  docType: 'document without a doctype property',
  dupAtt: 'elements with duplicate attributes',
  embAc: 'active elements embedded in links or buttons',
  filter: 'filter styles on elements',
  focAll: 'discrepancies between focusable and Tab-focused elements',
  focInd: 'missing and nonstandard focus indicators',
  focOp: 'discrepancies between focusability and operability',
  focVis: 'links that are invisible when focused',
  hover: 'hover-caused content changes',
  labClash: 'labeling inconsistencies',
  linkTo: 'links without destinations',
  linkUl: 'missing underlines on inline links',
  menuNav: 'nonstandard keyboard navigation between focusable menu items',
  miniText: 'text smaller than 11 pixels',
  motion: 'motion without user request',
  nonTable: 'table elements used for layout',
  radioSet: 'radio buttons not grouped into standard field sets',
  role: 'invalid, inadvised, and redundant explicit roles',
  styleDiff: 'style inconsistencies',
  tabNav: 'nonstandard keyboard navigation between elements with the tab role',
  title: 'missing page title',
  titledEl: 'title attributes on inappropriate elements',
  zIndex: 'non-default Z indexes'
};
const etcRules = {
  attVal: 'elements with attributes having illicit values',
  elements: 'data on specified elements',
  textNodes: 'data on specified text nodes',
  title: 'page title',
};

// FUNCTIONS

// Conducts and reports a Testaro test.
exports.reporter = async (
  page, withItems, rules = ['y', ... Object.keys(evalRules)], args = null
) => {
  // Initialize the data.
  const data = {
    rules: {}
  };
  // For each rule invoked:
  const argRules = args && Object.keys(args);
  const realRules = rules[0] === 'y'
    ? rules.slice(1)
    : Object.keys(evalRules).filter(ruleName => ! rules.slice(1).includes(ruleName));
  for (const rule of realRules) {
    // Initialize an argument array.
    const ruleArgs = [page, withItems];
    // If the rule has extra arguments:
    if (argRules && argRules.includes(rule)) {
      // Add them to the argument array.
      ruleArgs.push(... args[rule]);
    }
    // Test the page.
    console.log(`About to run reporter of ${rule}`);
    data.rules[rule] = await require(`../testaro/${rule}`).reporter(... ruleArgs);
    const what = evalRules[rule] || etcRules[rule];
    data.rules[rule].what = what;
    console.log(`>>>>>> ${rule} (${what})`);
  }
  return {result: data};
};
