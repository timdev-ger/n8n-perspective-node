import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { perspectiveApiRequest } from '../shared/transport';

type Funnel = {
	id: string;
	name: string;
};

type Workspace = {
	id: string;
	name: string;
	funnels?: Funnel[];
	campaigns?: Funnel[];
};

type WorkspacesResponse = Workspace[] | { workspaces?: Workspace[]; data?: Workspace[] };

export async function getFunnels(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = (await perspectiveApiRequest.call(
		this,
		'GET',
		'/v1/workspaces',
	)) as WorkspacesResponse;

	const workspaces: Workspace[] = Array.isArray(response)
		? response
		: (response.workspaces ?? response.data ?? []);

	const results: INodeListSearchItems[] = [];
	const lowerFilter = filter?.toLowerCase();

	for (const workspace of workspaces) {
		const funnels = workspace.funnels ?? workspace.campaigns ?? [];
		for (const funnel of funnels) {
			if (lowerFilter && !funnel.name.toLowerCase().includes(lowerFilter)) {
				continue;
			}
			results.push({
				name: workspace.name ? `${workspace.name} / ${funnel.name}` : funnel.name,
				value: funnel.id,
			});
		}
	}

	return { results };
}
