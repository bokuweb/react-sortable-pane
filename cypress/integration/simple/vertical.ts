describe('SortablePane', () => {
  const { storyUrl } = require('../../fixtures/story');

  beforeEach(() => {
    cy.visit(storyUrl);
  });

  context('Uncontrolled vertical', () => {
    it('should sort vertical pane', () => {
      selectStory('vertical');
      cy.get('#storybook-preview-iframe').then($iframe => {
        const doc = $iframe.contents();
        iget(doc, '.pane0').trigger('mousedown', { which: 1 });
        iget($iframe.contents(), 'body').trigger('mousemove', { clientX: 0, clientY: 200 });
        iget(doc, '.pane0').trigger('mouseup', { force: true });
        iget(doc, '.panes div')
          .eq(0)
          .and('have.css', 'transform')
          .and('match', /matrix\(1, 0, 0, 1, 0, 140\)/);
        cy.screenshot('vertical');
      });
    });
  });
});

function iget(doc: JQuery<HTMLElement | Text | Comment>, selector: string) {
  return cy.wrap(doc.find(selector));
}

function selectStory(name: string) {
  cy.get(`a[data-name="${name}"]`).click();
}
