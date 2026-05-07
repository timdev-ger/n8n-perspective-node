import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['updateField'] };

export const contactUpdateFieldDescription: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'The ID of the contact to update',
	},
	{
		displayName: 'Field Name',
		name: 'fieldName',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. firstName, email, city, quiz_answer',
		displayOptions: { show: showOnly },
		description:
			'Field to update. Standard fields (firstName, lastName, email, phone, status, website, birthday), address subfields (city, state, country, postalCode/zip, street), or any custom property name.',
		routing: { send: { type: 'body', property: 'fieldName' } },
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnly },
		description: 'New value for the field',
		routing: { send: { type: 'body', property: 'value' } },
	},
	{
		displayName: 'Skip Automation Trigger',
		name: 'skipAutomationTrigger',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description:
			'Whether to bypass funnel automation workflows configured for the contact\'s status. By default automations run on update.',
		routing: { send: { type: 'body', property: 'skipAutomationTrigger' } },
	},
];
