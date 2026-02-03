import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type {
	CreateResumeRequest,
	CreateCoverLetterRequest,
	CreateTailoredResumeRequest,
	CreateTailoredCoverLetterRequest,
	ParseRequest,
	ApiResponse,
	ParseResumeJsonResponse,
	ParseResumeMarkdownResponse,
	ParseCoverLetterJsonResponse,
	ParseCoverLetterMarkdownResponse,
	RunStatusResponse,
} from './types';

const BASE_URL = 'https://useresume.ai/api/v3';

// Timeout settings (in milliseconds)
const TIMEOUTS = {
	create: 60000,
	parse: 90000,
	tailored: 180000,
	runStatus: 20000,
};

export class UseResumeApiError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public details?: string,
	) {
		super(message);
		this.name = 'UseResumeApiError';
	}
}

function getErrorMessage(statusCode: number, errorBody: IDataObject): string {
	const errorMessage = (errorBody.error as string) || 'Unknown error';
	const details = errorBody.details as string | undefined;

	switch (statusCode) {
		case 400:
			return `Invalid request: ${errorMessage}${details ? ` - ${details}` : ''}`;
		case 401:
			return 'Authentication failed: Invalid API key. Get your key at https://useresume.ai/resume-generation-api';
		case 402:
			return 'Insufficient credits. Please top up at https://useresume.ai/resume-generation-api';
		case 429:
			return 'Rate limit exceeded. Please wait before retrying (limit: 10 requests/second)';
		case 500:
			return `Server error: ${errorMessage}. Please try again or contact support`;
		default:
			return `API error (${statusCode}): ${errorMessage}`;
	}
}

async function makeRequest<T>(
	context: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	timeout?: number,
): Promise<T> {
	const options: IHttpRequestOptions = {
		method,
		url: `${BASE_URL}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		timeout: timeout || 60000,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	const response = await context.helpers.httpRequestWithAuthentication.call(
		context,
		'useResumeApi',
		options,
	);

	const statusCode = response.statusCode as number;
	const responseBody = response.body as IDataObject;

	if (statusCode >= 400) {
		const errorMessage = getErrorMessage(statusCode, responseBody);
		throw new NodeApiError(context.getNode(), responseBody as JsonObject, {
			message: errorMessage,
			httpCode: String(statusCode),
		});
	}

	return responseBody as T;
}

// ============================================
// Resume Operations
// ============================================

export async function createResume(
	context: IExecuteFunctions,
	request: CreateResumeRequest,
): Promise<ApiResponse> {
	return makeRequest<ApiResponse>(
		context,
		'POST',
		'/resume/create',
		request as unknown as IDataObject,
		TIMEOUTS.create,
	);
}

export async function createTailoredResume(
	context: IExecuteFunctions,
	request: CreateTailoredResumeRequest,
): Promise<ApiResponse> {
	return makeRequest<ApiResponse>(
		context,
		'POST',
		'/resume/create-tailored',
		request as unknown as IDataObject,
		TIMEOUTS.tailored,
	);
}

export async function parseResume(
	context: IExecuteFunctions,
	request: ParseRequest,
): Promise<ParseResumeJsonResponse | ParseResumeMarkdownResponse> {
	return makeRequest<ParseResumeJsonResponse | ParseResumeMarkdownResponse>(
		context,
		'POST',
		'/resume/parse',
		request as unknown as IDataObject,
		TIMEOUTS.parse,
	);
}

// ============================================
// Cover Letter Operations
// ============================================

export async function createCoverLetter(
	context: IExecuteFunctions,
	request: CreateCoverLetterRequest,
): Promise<ApiResponse> {
	return makeRequest<ApiResponse>(
		context,
		'POST',
		'/cover-letter/create',
		request as unknown as IDataObject,
		TIMEOUTS.create,
	);
}

export async function createTailoredCoverLetter(
	context: IExecuteFunctions,
	request: CreateTailoredCoverLetterRequest,
): Promise<ApiResponse> {
	return makeRequest<ApiResponse>(
		context,
		'POST',
		'/cover-letter/create-tailored',
		request as unknown as IDataObject,
		TIMEOUTS.tailored,
	);
}

export async function parseCoverLetter(
	context: IExecuteFunctions,
	request: ParseRequest,
): Promise<ParseCoverLetterJsonResponse | ParseCoverLetterMarkdownResponse> {
	return makeRequest<ParseCoverLetterJsonResponse | ParseCoverLetterMarkdownResponse>(
		context,
		'POST',
		'/cover-letter/parse',
		request as unknown as IDataObject,
		TIMEOUTS.parse,
	);
}

// ============================================
// Run Status Operations
// ============================================

export async function getRunStatus(
	context: IExecuteFunctions,
	runId: string,
): Promise<RunStatusResponse> {
	return makeRequest<RunStatusResponse>(
		context,
		'GET',
		`/run/get/${encodeURIComponent(runId)}`,
		undefined,
		TIMEOUTS.runStatus,
	);
}

// ============================================
// File Download Helper
// ============================================

export async function downloadFile(
	context: IExecuteFunctions,
	fileUrl: string,
): Promise<Buffer> {
	const response = await context.helpers.httpRequest({
		method: 'GET',
		url: fileUrl,
		encoding: 'arraybuffer',
		returnFullResponse: true,
	});

	return Buffer.from(response.body as ArrayBuffer);
}
