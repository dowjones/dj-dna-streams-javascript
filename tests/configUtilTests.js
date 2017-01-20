/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const configUtil = require('../config/configUtil');

describe('configUtil', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the correct project name if one is provided.', () => {
    configUtil.credentials.dj_dna_streaming.project_name = undefined;
    sandbox.stub(configUtil.credentials.dj_dna_streaming, 'project_name', 'foo');

    expect(configUtil.credentials.dj_dna_streaming.project_name).toBe('foo');
    expect(configUtil.getProjectName()).toBe('foo');
  });

  it('should get the correct project if no project name is provided.', () => {
    expect(configUtil.getProjectName()).toBe('djsyndicationhub-prod');
  });
});
