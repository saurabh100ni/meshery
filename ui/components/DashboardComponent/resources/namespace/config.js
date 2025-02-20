import React from 'react';
import { timeAgo } from '../../../../utils/k8s-utils';
import {
  getClusterNameFromClusterId,
  getConnectionIdFromClusterId,
} from '../../../../utils/multi-ctx';
import { SINGLE_VIEW } from '../config';

import { Title } from '../../view';

import { ConnectionChip } from '../../../connections/ConnectionChip';
import { ConditionalTooltip } from '../../../../utils/utils';
import useKubernetesHook from '../../../hooks/useKubernetesHook';

export const NamespaceTableConfig = (switchView, meshSyncResources, k8sConfig) => {
  const ping = useKubernetesHook();
  return {
    name: 'Namespace',
    columns: [
      {
        name: 'id',
        label: 'ID',
        options: {
          display: false,
          customBodyRender: (value) => <ConditionalTooltip value={value} maxLength={10} />,
        },
      },
      {
        name: 'metadata.name',
        label: 'Name',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(value, tableMeta) {
            return (
              <Title
                onClick={() => switchView(SINGLE_VIEW, meshSyncResources[tableMeta.rowIndex])}
                data={
                  meshSyncResources[tableMeta.rowIndex]
                    ? meshSyncResources[tableMeta.rowIndex]?.component_metadata?.metadata
                    : {}
                }
                value={value}
              />
            );
          },
        },
      },
      {
        name: 'apiVersion',
        label: 'API version',
        options: {
          sort: false,
        },
      },
      {
        name: 'cluster_id',
        label: 'Cluster',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(val) {
            let clusterName = getClusterNameFromClusterId(val, k8sConfig);
            let connectionId = getConnectionIdFromClusterId(val, k8sConfig);
            return (
              <>
                <ConnectionChip
                  title={clusterName}
                  iconSrc="/static/img/kubernetes.svg"
                  handlePing={() => ping(clusterName, val, connectionId)}
                />
              </>
            );
          },
        },
      },
      {
        name: 'metadata.creationTimestamp',
        label: 'Age',
        options: {
          sort: false,
          sortThirdClickReset: true,
          customBodyRender: function CustomBody(value) {
            let time = timeAgo(value);
            return <>{time}</>;
          },
        },
      },
    ],
  };
};
