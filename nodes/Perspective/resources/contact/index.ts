import type { INodeProperties } from 'n8n-workflow';
import { funnelLocator } from '../../shared/descriptions';
import { contactGetAllDescription } from './getAll';
import { contactGetDescription } from './get';
import { contactCreateDescription } from './create';
import { contactUpdateFieldDescription } from './updateField';

const showOnly = { resource: ['contact'] };

export const contactDescription: INodeProperties[] = [
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
				action: 'Get many contacts in a funnel',
				description: 'Retrieve a paginated list of contacts in a funnel',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/funnels/{{$parameter.funnelId}}/contacts',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a contact',
				description: 'Retrieve a single contact by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/funnels/{{$parameter.funnelId}}/contacts/{{$parameter.contactId}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a contact',
				description: 'Create a new contact in a funnel',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/funnels/{{$parameter.funnelId}}/contacts',
					},
				},
			},
			{
				name: 'Update Field',
				value: 'updateField',
				action: 'Update a single field on a contact',
				description: 'Set a single field value on a contact (one field per request)',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/funnels/{{$parameter.funnelId}}/contacts/{{$parameter.contactId}}/values',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		...funnelLocator,
		displayOptions: { show: showOnly },
	},
	...contactGetAllDescription,
	...contactGetDescription,
	...contactCreateDescription,
	...contactUpdateFieldDescription,
];
