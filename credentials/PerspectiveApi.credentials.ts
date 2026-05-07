import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PerspectiveApi implements ICredentialType {
	name = 'perspectiveApi';

	displayName = 'Perspective API';

	icon: Icon = {
		light: 'file:../icons/perspective.svg',
		dark: 'file:../icons/perspective.dark.svg',
	};

	documentationUrl = 'https://perspective-api.co/api-docs/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'API key from Perspective (Account Settings → API). Requires Scale Plan or legacy Volume Plan. Only admins can create keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-perspective-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://perspective-api.co',
			url: '/v1/workspaces',
			method: 'GET',
		},
	};
}
