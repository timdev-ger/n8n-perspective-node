import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { contactDescription } from './resources/contact';
import { metricDescription } from './resources/metric';
import { workspaceDescription } from './resources/workspace';
import { getFunnels } from './listSearch/getFunnels';

export class Perspective implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Perspective',
		name: 'perspective',
		icon: {
			light: 'file:../../icons/perspective.svg',
			dark: 'file:../../icons/perspective.dark.svg',
		},
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Perspective.co (Funnels) REST API',
		defaults: {
			name: 'Perspective',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'perspectiveApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://perspective-api.co',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Metric', value: 'metric' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'contact',
			},
			...contactDescription,
			...metricDescription,
			...workspaceDescription,
		],
	};

	methods = {
		listSearch: {
			getFunnels,
		},
	};
}
