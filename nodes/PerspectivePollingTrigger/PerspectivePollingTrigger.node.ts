import {
	NodeConnectionTypes,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IPollFunctions,
} from 'n8n-workflow';
import { funnelLocator } from '../Perspective/shared/descriptions';
import { perspectiveApiRequest } from '../Perspective/shared/transport';
import { getFunnels } from '../Perspective/listSearch/getFunnels';

type ContactMeta = {
	ps_converted_at?: string;
	ps_first_seen_at?: string;
};

type Contact = IDataObject & {
	id?: string;
	meta?: ContactMeta;
};

type ContactsListResponse = {
	data?: Contact[];
};

export class PerspectivePollingTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Perspective Polling Trigger',
		name: 'perspectivePollingTrigger',
		icon: {
			light: 'file:../../icons/perspective.svg',
			dark: 'file:../../icons/perspective.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Poll a Perspective funnel for new contacts on a schedule',
		defaults: { name: 'Perspective Polling Trigger' },
		polling: true,
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'perspectiveApi',
				required: true,
			},
		],
		properties: [
			{
				...funnelLocator,
				description: 'The Perspective funnel to poll for new contacts',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'newConvertedLead',
				description: 'Which timestamp to watermark against',
				options: [
					{
						name: 'New Contact',
						value: 'newContact',
						description:
							'Emit any contact whose first-seen timestamp is newer than the last poll',
					},
					{
						name: 'New Converted Lead',
						value: 'newConvertedLead',
						description:
							'Emit only contacts that newly submitted email/phone (ps_converted_at watermark)',
					},
				],
			},
			{
				displayName:
					'Polling triggers fetch the latest 100 contacts on each schedule tick and emit any with a watermark newer than the last run. The first poll establishes the baseline and emits nothing — subsequent polls emit only new items. Configure the polling schedule in the section below.',
				name: 'pollingNotice',
				type: 'notice',
				default: '',
			},
		],
	};

	methods = {
		listSearch: {
			getFunnels,
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const funnelId = this.getNodeParameter('funnelId', '', { extractValue: true }) as string;
		const event = this.getNodeParameter('event') as 'newConvertedLead' | 'newContact';
		const watermarkField = event === 'newContact' ? 'ps_first_seen_at' : 'ps_converted_at';

		const staticData = this.getWorkflowStaticData('node') as { lastSeen?: string };

		const response = (await perspectiveApiRequest.call(
			this,
			'GET',
			`/v1/funnels/${encodeURIComponent(funnelId)}/contacts`,
			{
				sortField: 'ps_converted_at',
				sortOrder: -1,
				limit: 100,
				page: 0,
			},
		)) as ContactsListResponse;

		const contacts = response.data ?? [];

		const timestamp = (c: Contact): number => {
			const t = c.meta?.[watermarkField];
			return t ? new Date(t).getTime() : 0;
		};

		const sorted = [...contacts]
			.filter((c) => timestamp(c) > 0)
			.sort((a, b) => timestamp(b) - timestamp(a));

		if (sorted.length === 0) {
			return null;
		}

		const newestTs = sorted[0].meta?.[watermarkField];

		if (!staticData.lastSeen) {
			staticData.lastSeen = newestTs;
			return null;
		}

		const lastSeenMs = new Date(staticData.lastSeen).getTime();
		const fresh = sorted.filter((c) => timestamp(c) > lastSeenMs);

		if (fresh.length === 0) {
			return null;
		}

		staticData.lastSeen = newestTs;

		return [this.helpers.returnJsonArray(fresh)];
	}
}
