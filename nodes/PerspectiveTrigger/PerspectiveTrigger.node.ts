import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

export class PerspectiveTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Perspective Trigger',
		name: 'perspectiveTrigger',
		icon: {
			light: 'file:../../icons/perspective.svg',
			dark: 'file:../../icons/perspective.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receive webhooks from a Perspective.co funnel (new leads, funnel completed)',
		defaults: {
			name: 'Perspective Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'newLead',
				description:
					'Documentation only — Perspective decides which event(s) hit this URL based on what you configure in the funnel\'s Webhooks settings. Use this field to label the workflow.',
				options: [
					{
						name: 'Any',
						value: 'any',
						description: 'This trigger should receive both event types from Perspective',
					},
					{
						name: 'Funnel Completed',
						value: 'funnelCompleted',
						description: 'Fires when a visitor reaches the final or any result page',
					},
					{
						name: 'New Lead',
						value: 'newLead',
						description: 'Fires when a visitor submits a funnel with completed email or phone',
					},
				],
			},
			{
				displayName:
					'In Perspective: open the funnel → <b>Settings → Webhooks</b>, add the production webhook URL above and choose the matching event. The trigger does not require a credential — keep the URL secret.',
				name: 'setupNotice',
				type: 'notice',
				default: '',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray([body])],
		};
	}
}
