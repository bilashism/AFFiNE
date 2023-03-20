/**
 * @vitest-environment happy-dom
 */
import 'fake-indexeddb/auto';

import { __unstableSchemas, AffineSchemas } from '@blocksuite/blocks/models';
import type { Page } from '@blocksuite/store';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { BlockSuiteWorkspace } from '../../shared';
import { useBlockSuiteWorkspaceHelper } from '../use-blocksuite-workspace-helper';
import { usePageMeta } from '../use-page-meta';

let blockSuiteWorkspace: BlockSuiteWorkspace;

beforeEach(() => {
  blockSuiteWorkspace = new BlockSuiteWorkspace({
    id: 'test',
  })
    .register(AffineSchemas)
    .register(__unstableSchemas);
  blockSuiteWorkspace.slots.pageAdded.on(pageId => {
    const page = blockSuiteWorkspace.getPage(pageId) as Page;
    const pageBlockId = page.addBlock('affine:page', { title: '' });
    const frameId = page.addBlock('affine:frame', {}, pageBlockId);
    page.addBlock('affine:paragraph', {}, frameId);
  });
  blockSuiteWorkspace.createPage('page0');
  blockSuiteWorkspace.createPage('page1');
  blockSuiteWorkspace.createPage('page2');
});

describe('useBlockSuiteWorkspaceHelper', () => {
  test('should create page', () => {
    expect(blockSuiteWorkspace.meta.pageMetas.length).toBe(3);
    const helperHook = renderHook(() =>
      useBlockSuiteWorkspaceHelper(blockSuiteWorkspace)
    );
    const pageMetaHook = renderHook(() => usePageMeta(blockSuiteWorkspace));
    expect(pageMetaHook.result.current.length).toBe(3);
    expect(blockSuiteWorkspace.meta.pageMetas.length).toBe(3);
    const callback = vi.fn(id => {
      expect(id).toBe('page4');
    });
    helperHook.result.current.createPage('page4').then(callback);
    expect(blockSuiteWorkspace.meta.pageMetas.length).toBe(4);
    pageMetaHook.rerender();
    expect(pageMetaHook.result.current.length).toBe(4);
  });
});
