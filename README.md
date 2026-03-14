# n8n-nodes-useresume

This is an n8n community node for [UseResume](https://useresume.ai/resume-generation-api) - an AI-powered resume and cover letter generation platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install @useresume/n8n-nodes-useresume
```

## Operations

This node supports the following operations:

| Operation                        | Description                                              | Credits |
| -------------------------------- | -------------------------------------------------------- | ------- |
| **Create Resume**                | Generate a PDF resume from structured JSON content       | 1       |
| **Create Tailored Resume**       | Generate an AI-tailored resume for a specific job        | 5       |
| **Parse Resume**                 | Extract structured data from a resume file (PDF, DOCX)   | 4       |
| **Create Cover Letter**          | Generate a PDF cover letter from structured JSON content | 1       |
| **Create Tailored Cover Letter** | Generate an AI-tailored cover letter for a specific job  | 5       |
| **Parse Cover Letter**           | Extract structured data from a cover letter file         | 4       |
| **Get Run Status**               | Retrieve status and new signed URL for a previous run    | 0       |

## Credentials

To use this node, you need a UseResume API key:

1. Go to [UseResume API Platform](https://useresume.ai/resume-generation-api)
2. Sign up or log in to your account
3. Generate an API key (starts with `ur_`)
4. In n8n, create new credentials of type "UseResume API"
5. Paste your API key

## Usage

### Create Resume

Generate a professional PDF resume from structured content:

```json
{
	"content": {
		"name": "John Doe",
		"email": "john@example.com",
		"phone": "+1 234 567 8900",
		"role": "Software Engineer",
		"summary": "Experienced software engineer with 5+ years...",
		"employment": [
			{
				"title": "Senior Developer",
				"company": "Tech Corp",
				"start_date": "2020-01-01",
				"present": true,
				"responsibilities": [{ "text": "Led development of microservices architecture" }]
			}
		],
		"skills": [
			{ "name": "TypeScript", "proficiency": "Expert" },
			{ "name": "React", "proficiency": "Advanced" }
		]
	},
	"style": {
		"template": "modern-pro",
		"template_color": "blue",
		"font": "inter"
	}
}
```

### Create Tailored Resume

Generate an AI-optimized resume for a specific job posting:

1. Provide your base resume content and style as JSON
2. Enter the target job title
3. Paste the job description
4. Optionally add tailoring instructions

The AI will optimize your resume content to highlight relevant experience and skills.

### Parse Resume

Extract structured data from an existing resume:

- **URL Input**: Provide a publicly accessible URL to the resume file
- **Binary Input**: Use binary data from a previous node (e.g., Read Binary File)
- **Output**: JSON (structured data) or Markdown (formatted text)

### Download File Option

For create operations, enable "Download File" to automatically download the generated PDF and attach it as binary data to the output. This is useful for:

- Sending resumes via email
- Uploading to cloud storage
- Further processing in the workflow

## Templates

### Resume Templates (29)

`default`, `clean`, `classic`, `executive`, `modern-pro`, `meridian`, `horizon`, `atlas`, `prism`, `nova`, `zenith`, `vantage`, `summit`, `quantum`, `vertex`, `harvard`, `lattice`, `strata`, `cascade`, `pulse`, `folio`, `ridge`, `verso`, `ledger`, `tableau`, `apex`, `herald`, `beacon`, `onyx`

### Cover Letter Templates (11)

`atlas`, `classic`, `clean`, `default`, `executive`, `horizon`, `meridian`, `modern-pro`, `nova`, `prism`, `zenith`

### Colors (32)

`blue`, `black`, `emerald`, `purple`, `rose`, `amber`, `slate`, `indigo`, `teal`, `burgundy`, `forest`, `navy`, `charcoal`, `plum`, `olive`, `maroon`, `steel`, `sapphire`, `pine`, `violet`, `mahogany`, `sienna`, `moss`, `midnight`, `copper`, `cobalt`, `crimson`, `sage`, `aqua`, `coral`, `graphite`, `turquoise`

### Fonts (9)

`geist`, `inter`, `merryweather`, `roboto`, `playfair`, `lora`, `jost`, `manrope`, `ibm-plex-sans`

## Example Workflows

### Bulk Resume Generation from Spreadsheet

1. **Google Sheets** node: Read candidate data
2. **UseResume** node: Create Resume for each row
3. **Google Drive** node: Upload generated PDFs

### Job Application Automation

1. **Webhook** node: Receive job posting URL
2. **HTTP Request** node: Scrape job description
3. **UseResume** node: Create Tailored Resume
4. **UseResume** node: Create Tailored Cover Letter
5. **Gmail** node: Send application email with attachments

### Resume Parsing and Database Storage

1. **Webhook** node: Receive resume file upload
2. **UseResume** node: Parse Resume to JSON
3. **Postgres** node: Store candidate data

## Resources

- [UseResume Website](https://useresume.ai/resume-generation-api)
- [API Documentation](https://useresume.ai/resume-generation-api/docs)
- [Get API Key](https://useresume.ai/account/api-platform/api-keys)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
