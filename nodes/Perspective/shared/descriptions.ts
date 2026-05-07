import type { INodeProperties } from 'n8n-workflow';

export const funnelLocator: INodeProperties = {
	displayName: 'Funnel',
	name: 'funnelId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	description: 'The Perspective funnel to operate on',
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a funnel...',
			typeOptions: {
				searchListMethod: 'getFunnels',
				searchable: true,
				searchFilterRequired: false,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 1234abcd-...',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[a-zA-Z0-9-]+$',
						errorMessage: 'Funnel ID must contain only letters, digits and dashes',
					},
				},
			],
		},
	],
};
