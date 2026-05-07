import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['create'] };

export const contactCreateDescription: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@example.com',
		default: '',
		displayOptions: { show: showOnly },
		description: 'Contact email. At least email or phone must be provided.',
		routing: {
			send: {
				type: 'body',
				property: 'email',
				value: '={{$value || undefined}}',
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: 'Contact phone number. At least email or phone must be provided.',
		routing: {
			send: {
				type: 'body',
				property: 'phone',
				value: '={{$value || undefined}}',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnly },
		default: {},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'fixedCollection',
				default: {},
				typeOptions: { multipleValues: false },
				options: [
					{
						displayName: 'Address Fields',
						name: 'fields',
						values: [
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
								routing: { send: { type: 'body', property: 'address.city' } },
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
								routing: { send: { type: 'body', property: 'address.country' } },
							},
							{
								displayName: 'Postal Code',
								name: 'postalCode',
								type: 'string',
								default: '',
								routing: { send: { type: 'body', property: 'address.postalCode' } },
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
								routing: { send: { type: 'body', property: 'address.state' } },
							},
							{
								displayName: 'Street',
								name: 'street',
								type: 'string',
								default: '',
								routing: { send: { type: 'body', property: 'address.street' } },
							},
						],
					},
				],
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				default: '',
				placeholder: 'e.g. 1990-04-21',
				routing: { send: { type: 'body', property: 'birthday' } },
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'firstName' } },
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'lastName' } },
			},
			{
				displayName: 'Skip Automation Trigger',
				name: 'skipAutomationTrigger',
				type: 'boolean',
				default: false,
				description:
					'Whether to bypass funnel automation workflows configured for the contact\'s initial status. By default automations run on creation.',
				routing: { send: { type: 'body', property: 'skipAutomationTrigger' } },
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'website' } },
			},
		],
	},
];
