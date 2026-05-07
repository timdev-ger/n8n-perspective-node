import type { INodeProperties } from 'n8n-workflow';
import { funnelLocator } from '../../shared/descriptions';
import { metricGetKpiDescription } from './getKpi';
import { metricGetChartDescription } from './getChart';
import { metricGetInsightDescription } from './getInsight';

const showOnly = { resource: ['metric'] };

export const metricDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: 'Get KPI',
				value: 'getKpi',
				action: 'Get a KPI metric',
				description:
					'Retrieve a single KPI (e.g. conversion rate, total sessions) for a funnel and date range',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/funnels/{{$parameter.funnelId}}/metrics/kpis/{{$parameter.subtype}}',
					},
				},
			},
			{
				name: 'Get Chart',
				value: 'getChart',
				action: 'Get a chart metric',
				description:
					'Retrieve chart data (e.g. contacts over time, devices) for a funnel and date range',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/funnels/{{$parameter.funnelId}}/metrics/charts/{{$parameter.subtype}}',
					},
				},
			},
			{
				name: 'Get Insight',
				value: 'getInsight',
				action: 'Get an insight metric',
				description: 'Retrieve survey responses or feedback for a single insight block',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/funnels/{{$parameter.funnelId}}/metrics/insights/{{$parameter.insightId}}',
					},
				},
			},
		],
		default: 'getKpi',
	},
	{
		...funnelLocator,
		displayOptions: { show: showOnly },
	},
	...metricGetKpiDescription,
	...metricGetChartDescription,
	...metricGetInsightDescription,
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'Start of the time range (inclusive)',
		routing: {
			send: {
				type: 'query',
				property: 'from',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'End of the time range (inclusive)',
		routing: {
			send: {
				type: 'query',
				property: 'to',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
	},
	{
		displayName: 'Timezone Offset (Minutes)',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description:
			'Optional timezone offset in minutes. Set to your timezone to align bucket boundaries (e.g. 120 for CEST).',
		routing: {
			send: {
				type: 'query',
				property: 'offset',
				value: '={{$value === 0 ? undefined : $value}}',
			},
		},
	},
];
