import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['metric'], operation: ['getChart'] };

export const metricGetChartDescription: INodeProperties[] = [
	{
		displayName: 'Chart',
		name: 'subtype',
		type: 'options',
		default: 'chart_contacts_over_time',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: 'Activity by Daytime', value: 'chart_activity_by_daytime' },
			{ name: 'Button Clicks', value: 'chart_button_clicks' },
			{ name: 'Contacts Over Time', value: 'chart_contacts_over_time' },
			{ name: 'Page-to-Page Conversion Rate', value: 'chart_page_to_page_conversion_rate' },
			{ name: 'Time on Page', value: 'chart_time_on_page' },
			{ name: 'Top UTM Sources', value: 'chart_top_utm_sources' },
			{ name: 'Visitor Devices', value: 'chart_visitor_devices' },
		],
	},
	{
		displayName: 'A/B Test Filter',
		name: 'abTest',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: { ...showOnly, subtype: ['chart_page_to_page_conversion_rate'] },
		},
		description:
			'A/B test filter — only supported for the Page-to-Page Conversion Rate chart',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Original', value: 'original' },
			{ name: 'Variant', value: 'variant' },
		],
		routing: {
			send: {
				type: 'query',
				property: 'abTest',
				value: '={{$value || undefined}}',
			},
		},
	},
];
