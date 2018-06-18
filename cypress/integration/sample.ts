describe('SortablePane', () => {
  beforeEach(() => {
    cy.visit('http://localhost:6096');
  });
  // Let's build some tests around the DateRangePicker
  context('Uncontrolled horizontal', () => {
    it('should visit the default story in this collection', async () => {
      const doc = await selectStory('horizontal');
      iget(doc, '#root').click();
      // });
    });
  });
});

function iget(doc: JQuery<HTMLElement | Text | Comment>, selector: string) {
  return cy.wrap(doc.find(selector));
}

function selectStory(name: string) {
  cy.get('a[data-name="horizontal"]').click();
  return cy.get('#storybook-preview-iframe').then(i => i.contents());
}
