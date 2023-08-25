import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import {OptionsWithUri} from 'request';

export class InterviewQuestionGen implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: '生成面试问题(OpenAI)',
		name: 'interviewQuestGen',
		icon: 'file:interview.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '基于面试者的经历和职位信息，生成面试问题。',
		defaults: {
			name: '生成面试问题(OpenAI)',
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
				displayName: 'Candidate info',
				name: 'candidate_info',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'xxx是一位有9年前端工作经验和3年管理经验的前端开发人员。他是Apache成员，曾在京东、白鲸开源、创业慧康和唯康科技等公司工作。在白鲸开源期间，他独立完成了DolphinScheduler项目官网，并参与了商业化产品业务功能开发和社区维护工作。在创业慧康期间，他创建了一个10人的前端团队，并主导了UI组件和业务组件库的开发。他还参与了HIS项目开发和微前端整合工作。在京东期间，他管理了一个12人的前端团队，并主导了七鲜小程序、H5页面和App混合项目的开发。他还参与了POP运营平台公用组件库的开发，并在两年内涨薪三次。他还在唯康科技担任前端开发人员，负责开发静态页面和使用jQuery进行页面逻辑处理。他还在康福美实业担任驻外代表，并在华东交通大学获得了管理学学士学位。此外，他还有Web3开发经验，参与了类pancake项目、类Twitter项目和类TronWeb的公链工具开发。',
				description: 'Candidate info text',
			},
			{
				displayName: 'Position info',
				name: 'position_info',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'laplacelab 是一家初创企业，主要的领域是 AI 的应用层，目前需要熟练的前端程序员, 需要擅长 VUE的开发人员，最好自己可以有自己的 UI 风格',
				description: 'Position info text',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const position_info = this.getNodeParameter('position_info', 0);
		const candidate_info = this.getNodeParameter('candidate_info', 0);
		let responseData = [];
		const options_sendText: OptionsWithUri = {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: {
				"position_info": position_info,
				"candidate_info": candidate_info
			},
			uri: `http://prompthub-backend-int.eastus.azurecontainer.io/api/plugin/generate_interview_questions`,
			json: true,
			timeout: 1000 * 60 * 30
		};
		responseData.push(await this.helpers.request.call(this, options_sendText));
		return [this.helpers.returnJsonArray(responseData)];
	}
}
