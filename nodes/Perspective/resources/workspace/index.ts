import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['workspace'] };

export const workspaceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many workspaces',
				description: 'Retrieve many workspaces and their funnels available to the API key',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/workspaces',
					},
				},
			},
		],
		default: 'getAll',
	},
];
