import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeExecutionWithMetadata } from 'n8n-workflow';
import { OptionsWithUri } from 'request';

export class ImageGen implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Image Generate',
		name: 'imageGen',
		icon: 'file:imagegen.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Generate an image based on text input',
		defaults: {
			name: 'Image Generate',
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
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'An apple tree',
				description: 'Input image description text',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const text = this.getNodeParameter('text', 0);
		let responseData = []
		const options_sendText: OptionsWithUri = {
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    method: 'POST',
		    body: {
		        "text": text
		    },
		    uri: `http://prompthub-backend-int.eastus.azurecontainer.io/api/text_to_image`,
		    json: true,
				timeout: 1000*60*30
		};
		responseData.push(await this.helpers.request.call(this, options_sendText));
		return [this.helpers.returnJsonArray(responseData)];
	}
}
