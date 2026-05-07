import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['getAll'] };

export const contactGetAllDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnly, returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
		routing: {
			send: { type: 'query', property: 'limit' },
			output: { maxResults: '={{$value}}' },
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: { show: { ...showOnly, returnAll: [false] } },
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Page number (0-based) when not returning all results',
		routing: {
			send: { type: 'query', property: 'page' },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: { show: showOnly },
		default: {},
		options: [
			{
				displayName: 'Sort Field',
				name: 'sortField',
				type: 'options',
				default: 'ps_converted_at',
				options: [
					{ name: 'Converted At', value: 'ps_converted_at' },
					{ name: 'Email', value: 'email' },
					{ name: 'First Name', value: 'firstName' },
					{ name: 'Last Name', value: 'lastName' },
				],
				description: 'Field to sort the contacts by',
				routing: { send: { type: 'query', property: 'sortField' } },
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				default: -1,
				options: [
					{ name: 'Ascending', value: 1 },
					{ name: 'Descending', value: -1 },
				],
				description: 'Sort direction: -1 for descending, 1 for ascending',
				routing: { send: { type: 'query', property: 'sortOrder' } },
			},
		],
	},
];
