describe('SortablePane', () => {
  const { storyUrl } = require('../../fixtures/story');

  beforeEach(() => {
    cy.visit(storyUrl);
  });

  context('Uncontrolled horizontal', () => {
    it('should sort horizontal pane', () => {
      selectStory('horizontal');
      cy.get('#storybook-preview-iframe').then($iframe => {
        const doc = $iframe.contents();
        iget(doc, '.pane0').trigger('mousedown', { which: 1 });
        iget($iframe.contents(), 'body').trigger('mousemove', { clientX: 200, clientY: 0 });
        iget(doc, '.pane0').trigger('mouseup', { force: true });
        iget(doc, '.panes div')
          .eq(0)
          .and('have.css', 'transform')
          .and('match', /matrix\(1, 0, 0, 1, 140, 0\)/);
        cy.screenshot('horizontal');
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
