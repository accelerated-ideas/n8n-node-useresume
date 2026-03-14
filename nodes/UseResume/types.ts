// ============================================
// Common Types
// ============================================

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type LanguageProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent';
export type ParseTo = 'json' | 'markdown';
export type RunStatus = 'success' | 'error' | 'in_progress';

// Template types
export type ResumeTemplate =
	| 'default'
	| 'clean'
	| 'classic'
	| 'executive'
	| 'modern-pro'
	| 'meridian'
	| 'horizon'
	| 'atlas'
	| 'prism'
	| 'nova'
	| 'zenith'
	| 'vantage'
	| 'summit'
	| 'quantum'
	| 'vertex'
	| 'harvard'
	| 'lattice'
	| 'strata'
	| 'cascade'
	| 'pulse'
	| 'folio'
	| 'ridge'
	| 'verso'
	| 'ledger'
	| 'tableau'
	| 'apex'
	| 'herald'
	| 'beacon'
	| 'onyx';

export type CoverLetterTemplate =
	| 'atlas'
	| 'classic'
	| 'clean'
	| 'default'
	| 'executive'
	| 'horizon'
	| 'meridian'
	| 'modern-pro'
	| 'nova'
	| 'prism'
	| 'zenith';

export type TemplateColor =
	| 'blue'
	| 'black'
	| 'emerald'
	| 'purple'
	| 'rose'
	| 'amber'
	| 'slate'
	| 'indigo'
	| 'teal'
	| 'burgundy'
	| 'forest'
	| 'navy'
	| 'charcoal'
	| 'plum'
	| 'olive'
	| 'maroon'
	| 'steel'
	| 'sapphire'
	| 'pine'
	| 'violet'
	| 'mahogany'
	| 'sienna'
	| 'moss'
	| 'midnight'
	| 'copper'
	| 'cobalt'
	| 'crimson'
	| 'sage'
	| 'aqua'
	| 'coral'
	| 'graphite'
	| 'turquoise';

export type DocumentFont =
	| 'geist'
	| 'inter'
	| 'merryweather'
	| 'roboto'
	| 'playfair'
	| 'lora'
	| 'jost'
	| 'manrope'
	| 'ibm-plex-sans';

export type BackgroundColor =
	| 'white'
	| 'cream'
	| 'pearl'
	| 'mist'
	| 'smoke'
	| 'ash'
	| 'frost'
	| 'sage'
	| 'mint'
	| 'blush'
	| 'lavender'
	| 'sky'
	| 'sand'
	| 'stone'
	| 'linen'
	| 'ivory';

export type ProfilePictureRadius = 'rounded-full' | 'rounded-xl' | 'rounded-none';
export type DateFormat =
	| 'LLL yyyy'
	| 'LL/yyyy'
	| 'dd/LL/yyyy'
	| 'LL/dd/yyyy'
	| 'dd.LL.yyyy'
	| 'yyyy';
export type PageFormat = 'a4' | 'letter';
export type DocumentLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'pl' | 'lt';

export type ResumeSectionId =
	| 'summary'
	| 'employment'
	| 'skills'
	| 'education'
	| 'certifications'
	| 'languages'
	| 'references'
	| 'projects'
	| 'activities'
	| string;

// ============================================
// Resume Types
// ============================================

export interface ResumeLink {
	url?: string;
	name?: string;
}

export interface ResumeResponsibility {
	text?: string;
}

export interface ResumeEmployment {
	start_date?: string;
	end_date?: string;
	present?: boolean;
	title?: string;
	company?: string;
	location?: string;
	short_description?: string;
	responsibilities?: ResumeResponsibility[];
}

export interface ResumeAchievement {
	text?: string;
}

export interface ResumeEducation {
	start_date?: string;
	end_date?: string;
	present?: boolean;
	degree?: string;
	institution?: string;
	location?: string;
	short_description?: string;
	achievements?: ResumeAchievement[];
}

export interface ResumeSkill {
	name?: string;
	proficiency?: SkillProficiency;
	display_proficiency?: boolean;
}

export interface ResumeCertification {
	start_date?: string;
	end_date?: string;
	present?: boolean;
	name?: string;
	institution?: string;
}

export interface ResumeLanguage {
	language?: string;
	proficiency?: LanguageProficiency;
	display_proficiency?: boolean;
}

export interface ResumeReference {
	name?: string;
	title?: string;
	company?: string;
	email?: string;
	phone?: string;
}

export interface ResumeProject {
	name?: string;
	short_description?: string;
	present?: boolean;
	start_date?: string;
	end_date?: string;
}

export interface ResumeActivity {
	name?: string;
	short_description?: string;
}

export interface ResumeCustomSectionBulletPoint {
	text?: string;
}

export interface ResumeCustomSectionItem {
	start_date?: string;
	end_date?: string;
	present?: boolean;
	name?: string;
	location?: string;
	short_description?: string;
	bullet_points?: ResumeCustomSectionBulletPoint[];
}

export interface ResumeCustomSection {
	section_id: string;
	section_name: string;
	section?: (ResumeCustomSectionItem | undefined)[];
}

export interface ResumeStructureItem {
	section_id: ResumeSectionId;
	position_index: number;
}

export interface ResumeContent {
	photo_url?: string;
	links?: ResumeLink[];
	name?: string;
	role?: string;
	email?: string;
	phone?: string;
	address?: string;
	summary?: string;
	employment?: ResumeEmployment[];
	skills?: ResumeSkill[];
	education?: ResumeEducation[];
	certifications?: ResumeCertification[];
	languages?: ResumeLanguage[];
	references?: ResumeReference[];
	projects?: ResumeProject[];
	activities?: ResumeActivity[];
	// Section names
	summary_section_name?: string;
	employment_section_name?: string;
	skills_section_name?: string;
	education_section_name?: string;
	certifications_section_name?: string;
	languages_section_name?: string;
	projects_section_name?: string;
	activities_section_name?: string;
	references_section_name?: string;
	custom_sections?: ResumeCustomSection[];
	// Extra fields
	date_of_birth?: string;
	marital_status?: string;
	passport_or_id?: string;
	nationality?: string;
	visa_status?: string;
	pronouns?: string;
}

export interface ResumeStyle {
	resume_structure?: ResumeStructureItem[];
	template?: ResumeTemplate;
	template_color?: TemplateColor;
	font?: DocumentFont;
	background_color?: BackgroundColor;
	page_padding?: number;
	gap_multiplier?: number;
	font_size_multiplier?: number;
	profile_picture_radius?: ProfilePictureRadius;
	date_format?: DateFormat;
	document_language?: DocumentLanguage;
	page_format?: PageFormat;
}

export interface CreateResumeRequest {
	content: ResumeContent;
	style?: ResumeStyle;
}

// ============================================
// Cover Letter Types
// ============================================

export interface CoverLetterContent {
	name?: string;
	address?: string;
	email?: string;
	phone?: string;
	text?: string;
	hiring_manager_company?: string;
	hiring_manager_name?: string;
	role?: string;
}

export interface CoverLetterStyle {
	template?: CoverLetterTemplate;
	template_color?: TemplateColor;
	font?: DocumentFont;
	background_color?: BackgroundColor;
	page_padding?: number;
	gap_multiplier?: number;
	font_size_multiplier?: number;
	document_language?: DocumentLanguage;
	page_format?: PageFormat;
}

export interface CreateCoverLetterRequest {
	content: CoverLetterContent;
	style?: CoverLetterStyle;
}

// ============================================
// Tailored Types
// ============================================

export interface TargetJob {
	job_title: string;
	job_description: string;
}

export interface CreateTailoredResumeRequest {
	resume_content: CreateResumeRequest;
	target_job: TargetJob;
	tailoring_instructions?: string;
}

export interface CreateTailoredCoverLetterRequest {
	cover_letter_content: CreateCoverLetterRequest;
	target_job: TargetJob;
	tailoring_instructions?: string;
}

// ============================================
// Parse Types
// ============================================

export interface ParseRequest {
	file_url?: string;
	file?: string;
	parse_to: ParseTo;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponseData {
	file_url: string;
	file_url_expires_at: number;
	file_expires_at: number;
	file_size_bytes: number;
}

export interface ApiResponseMeta {
	run_id: string | null;
	credits_used: number;
	credits_remaining: number | null;
}

export interface ApiResponse {
	success: boolean;
	data: ApiResponseData;
	meta: ApiResponseMeta;
}

// ============================================
// Parse Response Types
// ============================================

export interface ParsedResumeData {
	links?: Array<{ url: string | null; name: string | null }> | null;
	name: string | null;
	role: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	summary: string | null;
	employment?: Array<{
		start_date: string | null;
		end_date: string | null;
		present: boolean | null;
		title: string | null;
		company: string | null;
		location: string | null;
		short_description: string | null;
		responsibilities?: Array<{ text: string | null }> | null;
	}> | null;
	skills?: Array<{
		name: string | null;
		proficiency: SkillProficiency | null;
	}> | null;
	education?: Array<{
		start_date: string | null;
		end_date: string | null;
		present: boolean | null;
		degree: string | null;
		institution: string | null;
		location: string | null;
		short_description: string | null;
		achievements?: Array<{ text: string | null }> | null;
	}> | null;
	certifications?: Array<{
		start_date: string | null;
		end_date: string | null;
		present: boolean | null;
		name: string | null;
		institution: string | null;
	}> | null;
	languages?: Array<{
		language: string | null;
		proficiency: LanguageProficiency | null;
	}> | null;
	references?: Array<{
		name: string | null;
		title: string | null;
		company: string | null;
		email: string | null;
		phone: string | null;
	}> | null;
	projects?: Array<{
		name: string | null;
		short_description: string | null;
		present: boolean | null;
		start_date: string | null;
		end_date: string | null;
	}> | null;
	activities?: Array<{
		name: string | null;
		short_description: string | null;
	}> | null;
	date_of_birth: string | null;
	marital_status: string | null;
	passport_or_id: string | null;
	nationality: string | null;
	visa_status: string | null;
	pronouns: string | null;
}

export interface ParseResumeJsonResponse {
	success: boolean;
	data: ParsedResumeData;
	meta: {
		run_id: string;
		credits_used: number;
		credits_remaining: number;
	};
}

export interface ParseResumeMarkdownResponse {
	success: boolean;
	data: string;
	meta: {
		run_id: string;
		credits_used: number;
		credits_remaining: number;
	};
}

export interface ParsedCoverLetterData {
	name: string | null;
	address: string | null;
	email: string | null;
	phone: string | null;
	text: string | null;
	hiring_manager_company: string | null;
	hiring_manager_name: string | null;
	role: string | null;
}

export interface ParseCoverLetterJsonResponse {
	success: boolean;
	data: ParsedCoverLetterData;
	meta: {
		run_id: string;
		credits_used: number;
		credits_remaining: number;
	};
}

export interface ParseCoverLetterMarkdownResponse {
	success: boolean;
	data: string;
	meta: {
		run_id: string;
		credits_used: number;
		credits_remaining: number;
	};
}

// ============================================
// Run Status Types
// ============================================

export interface RunStatusData {
	id: string;
	created_at: number;
	endpoint: string;
	api_platform_user_id: string;
	credits_used: number;
	status: RunStatus;
	file_url?: string | null;
	file_url_expires_at?: number | null;
	file_expires_at: number;
	file_size_bytes: number;
}

export interface RunStatusResponse {
	success: boolean;
	data: RunStatusData;
}

// ============================================
// Error Types
// ============================================

export interface ApiErrorResponse {
	error: string;
	details?: string;
	status?: number;
}
