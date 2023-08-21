import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeExecutionWithMetadata } from 'n8n-workflow';
import { OptionsWithUri } from 'request';

export class RemoveBg implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Remove Background',
		name: 'removeBg',
		icon: 'file:imagegen.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Remove the background of the input image from url',
		defaults: {
			name: 'Remove Background',
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
				displayName: 'Image Url',
				name: 'imurl',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://www.example.com/example.jpg',
				description: 'Input image url',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const imurl = this.getNodeParameter('imurl', 0);
		let responseData = []
		const options: OptionsWithUri = {
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    method: 'POST',
		    body: {
		        "imurl": imurl
		    },
		    uri: `http://prompthub-backend-int.eastus.azurecontainer.io/plugin/removebg`,
		    json: true,
			timeout: 1000*60*30
		};
		responseData.push(await this.helpers.request.call(this, options));
		return [this.helpers.returnJsonArray(responseData)];
	}
}
