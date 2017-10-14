import { SearchPage } from './app.po';

describe('search App', () => {
  let page: SearchPage;

  beforeEach(() => {
    page = new SearchPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
