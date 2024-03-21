// Graphlit.test.ts
import Graphlit from '../src/index';

describe('Graphlit', () => {
  it('should create an instance without throwing', () => {
    expect(() => {
      new Graphlit('env_id', 'org_id', 'secret');
    }).not.toThrow();
  });

  // Add more tests here
});
