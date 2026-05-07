import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['metric'], operation: ['getKpi'] };

export const metricGetKpiDescription: INodeProperties[] = [
	{
		displayName: 'KPI',
		name: 'subtype',
		type: 'options',
		default: 'kpi_conversion_rate',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: 'Average Time on Page', value: 'kpi_average_time_on_page' },
			{ name: 'Completion Rate', value: 'kpi_completion_rate' },
			{ name: 'Conversion Rate', value: 'kpi_conversion_rate' },
			{ name: 'Messages Delivery Rate', value: 'kpi_messages_delivery_rate' },
			{ name: 'Messages Open Rate', value: 'kpi_messages_open_rate' },
			{ name: 'Messages Sent', value: 'kpi_messages_sent' },
			{ name: 'New Contacts', value: 'kpi_new_contacts' },
			{ name: 'Time to Completion', value: 'kpi_time_to_completion' },
			{ name: 'Total Sessions', value: 'kpi_total_sessions' },
		],
	},
];
