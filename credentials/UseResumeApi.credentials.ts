import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UseResumeApi implements ICredentialType {
	name = 'useResumeApi';
	displayName = 'UseResume API';
	documentationUrl = 'https://useresume.ai/resume-generation-api/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your UseResume API key. Get it at https://useresume.ai/resume-generation-api',
			placeholder: 'ur_...',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://useresume.ai/api/v3',
			url: '/credentials/test',
			method: 'GET',
		},
	};
}
