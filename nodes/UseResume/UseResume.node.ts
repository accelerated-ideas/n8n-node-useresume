import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import {
	createResume,
	createTailoredResume,
	parseResume,
	createCoverLetter,
	createTailoredCoverLetter,
	parseCoverLetter,
	getRunStatus,
	downloadFile,
} from './api';

import type {
	CreateResumeRequest,
	CreateCoverLetterRequest,
	CreateTailoredResumeRequest,
	CreateTailoredCoverLetterRequest,
	ParseRequest,
} from './types';

function parseJson<T>(value: string, fieldName: string): T {
	try {
		return JSON.parse(value) as T;
	} catch {
		throw new Error(
			`Invalid JSON in "${fieldName}" field. Please ensure the value is valid JSON. ` +
				`Check for missing quotes, trailing commas, or other syntax errors.`,
		);
	}
}

export class UseResume implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UseResume',
		name: 'useResume',
		icon: 'file:useresume.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate professional resumes and cover letters with AI-powered tailoring',
		defaults: {
			name: 'UseResume',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'useResumeApi',
				required: true,
			},
		],
		properties: [
			// Operation Selection
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Resume',
						value: 'createResume',
						description: 'Generate a PDF resume from structured JSON content (1 credit)',
						action: 'Create a resume',
					},
					{
						name: 'Create Tailored Resume',
						value: 'createTailoredResume',
						description: 'Generate an AI-tailored resume for a specific job (5 credits)',
						action: 'Create a tailored resume',
					},
					{
						name: 'Parse Resume',
						value: 'parseResume',
						description: 'Extract structured data from a resume file (4 credits)',
						action: 'Parse a resume',
					},
					{
						name: 'Create Cover Letter',
						value: 'createCoverLetter',
						description: 'Generate a PDF cover letter from structured JSON content (1 credit)',
						action: 'Create a cover letter',
					},
					{
						name: 'Create Tailored Cover Letter',
						value: 'createTailoredCoverLetter',
						description: 'Generate an AI-tailored cover letter for a specific job (5 credits)',
						action: 'Create a tailored cover letter',
					},
					{
						name: 'Parse Cover Letter',
						value: 'parseCoverLetter',
						description: 'Extract structured data from a cover letter file (4 credits)',
						action: 'Parse a cover letter',
					},
					{
						name: 'Get Run Status',
						value: 'getRunStatus',
						description: 'Retrieve status and new signed URL for a previous run (0 credits)',
						action: 'Get run status',
					},
				],
				default: 'createResume',
			},

			// ============================================
			// Create Resume Fields
			// ============================================
			{
				displayName: 'Content',
				name: 'content',
				type: 'json',
				default: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "phone": "+1 234 567 8900",\n  "role": "Software Engineer",\n  "summary": "Experienced software engineer...",\n  "employment": [],\n  "education": [],\n  "skills": []\n}',
				required: true,
				description: 'Resume content as JSON. See <a href="https://useresume.ai/resume-generation-api/docs">API docs</a> for full schema.',
				displayOptions: {
					show: {
						operation: ['createResume'],
					},
				},
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'json',
				default: '{\n  "template": "default",\n  "template_color": "blue"\n}',
				required: true,
				description: 'Styling options. Templates: default, clean, classic, executive, modern-pro, etc. Colors: blue, black, emerald, purple, etc.',
				displayOptions: {
					show: {
						operation: ['createResume'],
					},
				},
			},

			// ============================================
			// Create Tailored Resume Fields
			// ============================================
			{
				displayName: 'Resume Content',
				name: 'resumeContent',
				type: 'json',
				default: '{\n  "content": {\n    "name": "John Doe",\n    "email": "john@example.com"\n  },\n  "style": {\n    "template": "default",\n    "template_color": "blue"\n  }\n}',
				required: true,
				description: 'Resume content and style as JSON object with "content" and "style" keys',
				displayOptions: {
					show: {
						operation: ['createTailoredResume'],
					},
				},
			},
			{
				displayName: 'Job Title',
				name: 'jobTitle',
				type: 'string',
				default: '',
				required: true,
				description: 'Target job title (max 250 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredResume'],
					},
				},
			},
			{
				displayName: 'Job Description',
				name: 'jobDescription',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				description: 'Target job description (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredResume'],
					},
				},
			},
			{
				displayName: 'Tailoring Instructions',
				name: 'tailoringInstructions',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Optional custom instructions for AI tailoring (max 2,000 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredResume'],
					},
				},
			},

			// ============================================
			// Parse Resume/Cover Letter Fields
			// ============================================
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Publicly accessible URL to the file',
					},
					{
						name: 'Binary Data',
						value: 'binary',
						description: 'Binary data from a previous node',
					},
				],
				default: 'url',
				displayOptions: {
					show: {
						operation: ['parseResume', 'parseCoverLetter'],
					},
				},
			},
			{
				displayName: 'File URL',
				name: 'fileUrl',
				type: 'string',
				default: '',
				required: true,
				description: 'Publicly accessible URL to the file (max 20MB)',
				displayOptions: {
					show: {
						operation: ['parseResume', 'parseCoverLetter'],
						inputType: ['url'],
					},
				},
			},
			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				description: 'Name of the binary property containing the file (max 4MB)',
				displayOptions: {
					show: {
						operation: ['parseResume', 'parseCoverLetter'],
						inputType: ['binary'],
					},
				},
			},
			{
				displayName: 'Parse To',
				name: 'parseTo',
				type: 'options',
				options: [
					{
						name: 'JSON',
						value: 'json',
						description: 'Structured JSON with all extracted fields',
					},
					{
						name: 'Markdown',
						value: 'markdown',
						description: 'Formatted markdown text',
					},
				],
				default: 'json',
				displayOptions: {
					show: {
						operation: ['parseResume', 'parseCoverLetter'],
					},
				},
			},

			// ============================================
			// Create Cover Letter Fields
			// ============================================
			{
				displayName: 'Content',
				name: 'coverLetterContent',
				type: 'json',
				default: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "text": "Dear Hiring Manager,\\n\\nI am writing to express my interest..."\n}',
				required: true,
				description: 'Cover letter content as JSON. See <a href="https://useresume.ai/resume-generation-api/docs">API docs</a> for full schema.',
				displayOptions: {
					show: {
						operation: ['createCoverLetter'],
					},
				},
			},
			{
				displayName: 'Style',
				name: 'coverLetterStyle',
				type: 'json',
				default: '{\n  "template": "default",\n  "template_color": "blue"\n}',
				required: true,
				description: 'Styling options. Templates: atlas, classic, clean, default, executive, etc.',
				displayOptions: {
					show: {
						operation: ['createCoverLetter'],
					},
				},
			},

			// ============================================
			// Create Tailored Cover Letter Fields
			// ============================================
			{
				displayName: 'Cover Letter Content',
				name: 'tailoredCoverLetterContent',
				type: 'json',
				default: '{\n  "content": {\n    "name": "John Doe",\n    "email": "john@example.com",\n    "text": "Base cover letter text..."\n  },\n  "style": {\n    "template": "default",\n    "template_color": "blue"\n  }\n}',
				required: true,
				description: 'Cover letter content and style as JSON object with "content" and "style" keys',
				displayOptions: {
					show: {
						operation: ['createTailoredCoverLetter'],
					},
				},
			},
			{
				displayName: 'Job Title',
				name: 'coverLetterJobTitle',
				type: 'string',
				default: '',
				required: true,
				description: 'Target job title (max 250 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredCoverLetter'],
					},
				},
			},
			{
				displayName: 'Job Description',
				name: 'coverLetterJobDescription',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				description: 'Target job description (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredCoverLetter'],
					},
				},
			},
			{
				displayName: 'Tailoring Instructions',
				name: 'coverLetterTailoringInstructions',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Optional custom instructions for AI tailoring (max 2,000 characters)',
				displayOptions: {
					show: {
						operation: ['createTailoredCoverLetter'],
					},
				},
			},

			// ============================================
			// Get Run Status Fields
			// ============================================
			{
				displayName: 'Run ID',
				name: 'runId',
				type: 'string',
				default: '',
				required: true,
				description: 'The run ID returned from a previous create or parse operation',
				displayOptions: {
					show: {
						operation: ['getRunStatus'],
					},
				},
			},

			// ============================================
			// Download File Option (for create operations)
			// ============================================
			{
				displayName: 'Download File',
				name: 'downloadFile',
				type: 'boolean',
				default: false,
				description: 'Whether to download the generated PDF and return as binary data',
				displayOptions: {
					show: {
						operation: ['createResume', 'createTailoredResume', 'createCoverLetter', 'createTailoredCoverLetter'],
					},
				},
			},
			{
				displayName: 'Output Binary Field',
				name: 'outputBinaryPropertyName',
				type: 'string',
				default: 'data',
				description: 'Name of the binary property to store the downloaded file',
				displayOptions: {
					show: {
						operation: ['createResume', 'createTailoredResume', 'createCoverLetter', 'createTailoredCoverLetter'],
						downloadFile: [true],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let result: IDataObject;

				switch (operation) {
					case 'createResume': {
						const content = this.getNodeParameter('content', i) as string;
						const style = this.getNodeParameter('style', i) as string;
						const downloadFileOption = this.getNodeParameter('downloadFile', i) as boolean;

						const request: CreateResumeRequest = {
							content: parseJson(content, 'Content'),
							style: parseJson(style, 'Style'),
						};

						const response = await createResume(this, request);
						result = response as unknown as IDataObject;

						if (downloadFileOption && response.data.file_url) {
							const binaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
							const fileBuffer = await downloadFile(this, response.data.file_url);

							const binaryData = await this.helpers.prepareBinaryData(
								fileBuffer,
								'resume.pdf',
								'application/pdf',
							);

							returnData.push({
								json: result,
								binary: {
									[binaryPropertyName]: binaryData,
								},
							});
							continue;
						}
						break;
					}

					case 'createTailoredResume': {
						const resumeContent = this.getNodeParameter('resumeContent', i) as string;
						const jobTitle = this.getNodeParameter('jobTitle', i) as string;
						const jobDescription = this.getNodeParameter('jobDescription', i) as string;
						const tailoringInstructions = this.getNodeParameter('tailoringInstructions', i, '') as string;
						const downloadFileOption = this.getNodeParameter('downloadFile', i) as boolean;

						const parsedResumeContent = parseJson<CreateResumeRequest>(resumeContent, 'Resume Content');
						const request: CreateTailoredResumeRequest = {
							resume_content: parsedResumeContent,
							target_job: {
								job_title: jobTitle,
								job_description: jobDescription,
							},
						};

						if (tailoringInstructions) {
							request.tailoring_instructions = tailoringInstructions;
						}

						const response = await createTailoredResume(this, request);
						result = response as unknown as IDataObject;

						if (downloadFileOption && response.data.file_url) {
							const binaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
							const fileBuffer = await downloadFile(this, response.data.file_url);

							const binaryData = await this.helpers.prepareBinaryData(
								fileBuffer,
								'resume.pdf',
								'application/pdf',
							);

							returnData.push({
								json: result,
								binary: {
									[binaryPropertyName]: binaryData,
								},
							});
							continue;
						}
						break;
					}

					case 'parseResume': {
						const inputType = this.getNodeParameter('inputType', i) as string;
						const parseTo = this.getNodeParameter('parseTo', i) as 'json' | 'markdown';

						const request: ParseRequest = {
							parse_to: parseTo,
						};

						if (inputType === 'url') {
							request.file_url = this.getNodeParameter('fileUrl', i) as string;
						} else {
							const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							this.helpers.assertBinaryData(i, binaryPropertyName);
							const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							request.file = buffer.toString('base64');
						}

						const response = await parseResume(this, request);
						result = response as unknown as IDataObject;
						break;
					}

					case 'createCoverLetter': {
						const content = this.getNodeParameter('coverLetterContent', i) as string;
						const style = this.getNodeParameter('coverLetterStyle', i) as string;
						const downloadFileOption = this.getNodeParameter('downloadFile', i) as boolean;

						const request: CreateCoverLetterRequest = {
							content: parseJson(content, 'Content'),
							style: parseJson(style, 'Style'),
						};

						const response = await createCoverLetter(this, request);
						result = response as unknown as IDataObject;

						if (downloadFileOption && response.data.file_url) {
							const binaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
							const fileBuffer = await downloadFile(this, response.data.file_url);

							const binaryData = await this.helpers.prepareBinaryData(
								fileBuffer,
								'cover-letter.pdf',
								'application/pdf',
							);

							returnData.push({
								json: result,
								binary: {
									[binaryPropertyName]: binaryData,
								},
							});
							continue;
						}
						break;
					}

					case 'createTailoredCoverLetter': {
						const coverLetterContent = this.getNodeParameter('tailoredCoverLetterContent', i) as string;
						const jobTitle = this.getNodeParameter('coverLetterJobTitle', i) as string;
						const jobDescription = this.getNodeParameter('coverLetterJobDescription', i) as string;
						const tailoringInstructions = this.getNodeParameter('coverLetterTailoringInstructions', i, '') as string;
						const downloadFileOption = this.getNodeParameter('downloadFile', i) as boolean;

						const parsedCoverLetterContent = parseJson<CreateCoverLetterRequest>(coverLetterContent, 'Cover Letter Content');
						const request: CreateTailoredCoverLetterRequest = {
							cover_letter_content: parsedCoverLetterContent,
							target_job: {
								job_title: jobTitle,
								job_description: jobDescription,
							},
						};

						if (tailoringInstructions) {
							request.tailoring_instructions = tailoringInstructions;
						}

						const response = await createTailoredCoverLetter(this, request);
						result = response as unknown as IDataObject;

						if (downloadFileOption && response.data.file_url) {
							const binaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', i) as string;
							const fileBuffer = await downloadFile(this, response.data.file_url);

							const binaryData = await this.helpers.prepareBinaryData(
								fileBuffer,
								'cover-letter.pdf',
								'application/pdf',
							);

							returnData.push({
								json: result,
								binary: {
									[binaryPropertyName]: binaryData,
								},
							});
							continue;
						}
						break;
					}

					case 'parseCoverLetter': {
						const inputType = this.getNodeParameter('inputType', i) as string;
						const parseTo = this.getNodeParameter('parseTo', i) as 'json' | 'markdown';

						const request: ParseRequest = {
							parse_to: parseTo,
						};

						if (inputType === 'url') {
							request.file_url = this.getNodeParameter('fileUrl', i) as string;
						} else {
							const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							this.helpers.assertBinaryData(i, binaryPropertyName);
							const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							request.file = buffer.toString('base64');
						}

						const response = await parseCoverLetter(this, request);
						result = response as unknown as IDataObject;
						break;
					}

					case 'getRunStatus': {
						const runId = this.getNodeParameter('runId', i) as string;
						const response = await getRunStatus(this, runId);
						result = response as unknown as IDataObject;
						break;
					}

					default:
						throw new Error(`Unknown operation: ${operation}`);
				}

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
