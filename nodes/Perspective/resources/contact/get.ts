import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['get'] };

export const contactGetDescription: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'The ID of the contact to retrieve',
	},
];
