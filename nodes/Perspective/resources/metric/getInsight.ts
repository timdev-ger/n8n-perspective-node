import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['metric'], operation: ['getInsight'] };

export const metricGetInsightDescription: INodeProperties[] = [
	{
		displayName: 'Insight ID',
		name: 'insightId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'The Insight or Tracking ID to retrieve metrics for',
	},
];
