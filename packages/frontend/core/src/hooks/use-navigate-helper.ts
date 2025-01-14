import type { WorkspaceSubPath } from '@affine/core/shared';
import { useCallback, useContext, useMemo } from 'react';
import type { NavigateOptions, To } from 'react-router-dom';

import { NavigateContext, router } from '../router';

export enum RouteLogic {
  REPLACE = 'replace',
  PUSH = 'push',
}

function defaultNavigate(to: To, option?: { replace?: boolean }) {
  console.log(to, option);
  setTimeout(() => {
    router.navigate(to, option).catch(err => {
      console.error('Failed to navigate', err);
    });
  }, 100);
}

// todo: add a name -> path helper in the results
export function useNavigateHelper() {
  const navigate = useContext(NavigateContext) ?? defaultNavigate;

  const jumpToPage = useCallback(
    (
      workspaceId: string,
      pageId: string,
      logic: RouteLogic = RouteLogic.PUSH
    ) => {
      return navigate(`/workspace/${workspaceId}/${pageId}`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToPageBlock = useCallback(
    (
      workspaceId: string,
      pageId: string,
      blockId: string,
      logic: RouteLogic = RouteLogic.PUSH
    ) => {
      return navigate(`/workspace/${workspaceId}/${pageId}#${blockId}`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToCollections = useCallback(
    (workspaceId: string, logic: RouteLogic = RouteLogic.PUSH) => {
      return navigate(`/workspace/${workspaceId}/collection`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToTags = useCallback(
    (workspaceId: string, logic: RouteLogic = RouteLogic.PUSH) => {
      return navigate(`/workspace/${workspaceId}/tag`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToTag = useCallback(
    (
      workspaceId: string,
      tagId: string,
      logic: RouteLogic = RouteLogic.PUSH
    ) => {
      return navigate(`/workspace/${workspaceId}/tag/${tagId}`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToCollection = useCallback(
    (
      workspaceId: string,
      collectionId: string,
      logic: RouteLogic = RouteLogic.PUSH
    ) => {
      return navigate(`/workspace/${workspaceId}/collection/${collectionId}`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToSubPath = useCallback(
    (
      workspaceId: string,
      subPath: WorkspaceSubPath,
      logic: RouteLogic = RouteLogic.PUSH
    ) => {
      return navigate(`/workspace/${workspaceId}/${subPath}`, {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );

  const openPage = useCallback(
    (workspaceId: string, pageId: string) => {
      return jumpToPage(workspaceId, pageId);
    },
    [jumpToPage]
  );

  const jumpToIndex = useCallback(
    (logic: RouteLogic = RouteLogic.PUSH, opt?: { search?: string }) => {
      return navigate(
        { pathname: '/', search: opt?.search },
        {
          replace: logic === RouteLogic.REPLACE,
        }
      );
    },
    [navigate]
  );

  const jumpTo404 = useCallback(
    (logic: RouteLogic = RouteLogic.PUSH) => {
      return navigate('/404', {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToExpired = useCallback(
    (logic: RouteLogic = RouteLogic.PUSH) => {
      return navigate('/expired', {
        replace: logic === RouteLogic.REPLACE,
      });
    },
    [navigate]
  );
  const jumpToSignIn = useCallback(
    (
      redirectUri?: string,
      logic: RouteLogic = RouteLogic.PUSH,
      otherOptions?: Omit<NavigateOptions, 'replace'>
    ) => {
      return navigate(
        '/signIn' +
          (redirectUri
            ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
            : ''),
        {
          replace: logic === RouteLogic.REPLACE,
          ...otherOptions,
        }
      );
    },
    [navigate]
  );

  return useMemo(
    () => ({
      jumpToPage,
      jumpToPageBlock,
      jumpToSubPath,
      jumpToIndex,
      jumpTo404,
      openPage,
      jumpToExpired,
      jumpToSignIn,
      jumpToCollection,
      jumpToCollections,
      jumpToTags,
      jumpToTag,
    }),
    [
      jumpToPage,
      jumpToPageBlock,
      jumpToSubPath,
      jumpToIndex,
      jumpTo404,
      openPage,
      jumpToExpired,
      jumpToSignIn,
      jumpToCollection,
      jumpToCollections,
      jumpToTags,
      jumpToTag,
    ]
  );
}
