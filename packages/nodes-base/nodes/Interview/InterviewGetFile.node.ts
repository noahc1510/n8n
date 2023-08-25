import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import {OptionsWithUri} from 'request';

export class InterviewGetFile implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: '下载面试文件(OpenAI)',
		name: 'interviewGetFile',
		icon: 'file:interview.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '下载之前已上传的面试文件。',
		defaults: {
			name: '下载面试文件(OpenAI)',
		},
		inputs: ['main'],
		outputs: ['main'],
		requestDefaults: {
			baseURL: 'http://prompthub-backend-int.eastus.azurecontainer.io',
			headers: {
				'Content-Type': 'application/json',
			},
		},

		properties: [
			{
				displayName: '文件路径',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'http://prompthub-backend-int.eastus.azurecontainer.io/somefile.pdf',
				description: '要下载的文件路径',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const file_url = this.getNodeParameter('url', 0);
		let responseData = [];
		const options_sendText: OptionsWithUri = {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: {
				"file_url": file_url,
			},
			uri: `http://prompthub-backend-int.eastus.azurecontainer.io/api/plugin/get_file`,
			json: true,
			timeout: 1000 * 60 * 30
		};
		responseData.push(await this.helpers.request.call(this, options_sendText));
		return [this.helpers.returnJsonArray(responseData)];
	}
}
