export const TOOL_CATEGORIES = {
  ORGANIZE: 'organize',
  OPTIMIZE: 'optimize',
  CONVERT_TO_PDF: 'convert-to-pdf',
  CONVERT_FROM_PDF: 'convert-from-pdf',
  EDIT: 'edit',
  SECURITY: 'security',
  INTELLIGENCE: 'intelligence'
} as const;

export type ToolCategory = typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  route: string;
  isPremium: boolean;
  features: string[];
}

export interface CategoryInfo {
  name: string;
  description: string;
  color: string;
}

export const TOOLS: Tool[] = [
  // Organize PDF
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: '🔗',
    category: TOOL_CATEGORIES.ORGANIZE,
    route: '/tools/merge-pdf',
    isPremium: false,
    features: ['multiple-files', 'reorder', 'preview']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: '✂️',
    category: TOOL_CATEGORIES.ORGANIZE,
    route: '/tools/split-pdf',
    isPremium: false,
    features: ['range-selection', 'preview']
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    description: 'Delete specific pages from your PDF document.',
    icon: '🗑️',
    category: TOOL_CATEGORIES.ORGANIZE,
    route: '/tools/remove-pages',
    isPremium: false,
    features: ['page-selection', 'preview']
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Extract pages from your PDF into a new document.',
    icon: '📄',
    category: TOOL_CATEGORIES.ORGANIZE,
    route: '/tools/extract-pages',
    isPremium: false,
    features: ['page-selection', 'preview']
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    description: 'Sort pages of your PDF file however you like.',
    icon: '📋',
    category: TOOL_CATEGORIES.ORGANIZE,
    route: '/tools/organize-pdf',
    isPremium: false,
    features: ['reorder', 'rotate', 'preview']
  },

  // Optimize PDF
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: '📦',
    category: TOOL_CATEGORIES.OPTIMIZE,
    route: '/tools/compress-pdf',
    isPremium: false,
    features: ['compression-levels', 'preview']
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    description: 'Repair a damaged PDF and recover data from corrupt PDF.',
    icon: '🔧',
    category: TOOL_CATEGORIES.OPTIMIZE,
    route: '/tools/repair-pdf',
    isPremium: true,
    features: ['auto-repair', 'preview']
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    description: 'Easily convert scanned PDF into searchable and selectable documents.',
    icon: '🔍',
    category: TOOL_CATEGORIES.OPTIMIZE,
    route: '/tools/ocr-pdf',
    isPremium: true,
    features: ['language-selection', 'preview']
  },

  // Convert to PDF
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    icon: '🖼️',
    category: TOOL_CATEGORIES.CONVERT_TO_PDF,
    route: '/tools/jpg-to-pdf',
    isPremium: false,
    features: ['multiple-files', 'orientation', 'margins']
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    icon: '📝',
    category: TOOL_CATEGORIES.CONVERT_TO_PDF,
    route: '/tools/word-to-pdf',
    isPremium: false,
    features: ['docx-support', 'preview']
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    icon: '📊',
    category: TOOL_CATEGORIES.CONVERT_TO_PDF,
    route: '/tools/powerpoint-to-pdf',
    isPremium: false,
    features: ['pptx-support', 'preview']
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    icon: '📈',
    category: TOOL_CATEGORIES.CONVERT_TO_PDF,
    route: '/tools/excel-to-pdf',
    isPremium: false,
    features: ['xlsx-support', 'preview']
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page.',
    icon: '🌐',
    category: TOOL_CATEGORIES.CONVERT_TO_PDF,
    route: '/tools/html-to-pdf',
    isPremium: false,
    features: ['url-input', 'preview']
  },

  // Convert from PDF
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: '🖼️',
    category: TOOL_CATEGORIES.CONVERT_FROM_PDF,
    route: '/tools/pdf-to-jpg',
    isPremium: false,
    features: ['page-selection', 'quality-options']
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
    icon: '📝',
    category: TOOL_CATEGORIES.CONVERT_FROM_PDF,
    route: '/tools/pdf-to-word',
    isPremium: false,
    features: ['docx-output', 'preview']
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
    icon: '📊',
    category: TOOL_CATEGORIES.CONVERT_FROM_PDF,
    route: '/tools/pdf-to-powerpoint',
    isPremium: false,
    features: ['pptx-output', 'preview']
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    icon: '📈',
    category: TOOL_CATEGORIES.CONVERT_FROM_PDF,
    route: '/tools/pdf-to-excel',
    isPremium: false,
    features: ['xlsx-output', 'preview']
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    description: 'Transform your PDF to PDF/A, the ISO-standardized version for long-term archiving.',
    icon: '📋',
    category: TOOL_CATEGORIES.CONVERT_FROM_PDF,
    route: '/tools/pdf-to-pdfa',
    isPremium: true,
    features: ['iso-standard', 'preview']
  },

  // Edit PDF
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    icon: '🔄',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/rotate-pdf',
    isPremium: false,
    features: ['rotation-angles', 'multiple-files']
  },
  {
    id: 'add-page-numbers',
    name: 'Page Numbers',
    description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
    icon: '🔢',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/add-page-numbers',
    isPremium: false,
    features: ['position-options', 'formatting']
  },
  {
    id: 'add-watermark',
    name: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency.',
    icon: '💧',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/add-watermark',
    isPremium: false,
    features: ['text-image', 'positioning', 'transparency']
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    description: 'Crop margins of PDF documents or select specific areas.',
    icon: '✂️',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/crop-pdf',
    isPremium: false,
    features: ['margin-selection', 'preview']
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Add text, images, shapes or freehand annotations to a PDF document.',
    icon: '✏️',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/edit-pdf',
    isPremium: true,
    features: ['text-editing', 'images', 'shapes', 'annotations']
  },
  {
    id: 'pdf-forms',
    name: 'PDF Forms',
    description: 'Detect form fields automatically, create interactive fillable PDFs.',
    icon: '📝',
    category: TOOL_CATEGORIES.EDIT,
    route: '/tools/pdf-forms',
    isPremium: true,
    features: ['form-detection', 'interactive-fields']
  },

  // Security
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs.',
    icon: '🔓',
    category: TOOL_CATEGORIES.SECURITY,
    route: '/tools/unlock-pdf',
    isPremium: false,
    features: ['password-removal']
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
    icon: '🔒',
    category: TOOL_CATEGORIES.SECURITY,
    route: '/tools/protect-pdf',
    isPremium: false,
    features: ['password-protection', 'encryption-levels']
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Sign yourself or request electronic signatures from others.',
    icon: '✍️',
    category: TOOL_CATEGORIES.SECURITY,
    route: '/tools/sign-pdf',
    isPremium: true,
    features: ['digital-signature', 'request-signatures']
  },
  {
    id: 'redact-pdf',
    name: 'Redact PDF',
    description: 'Redact text and graphics to permanently remove sensitive information from a PDF.',
    icon: '🛡️',
    category: TOOL_CATEGORIES.SECURITY,
    route: '/tools/redact-pdf',
    isPremium: true,
    features: ['text-redaction', 'image-redaction']
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF',
    description: 'Show a side-by-side document comparison and easily spot changes between versions.',
    icon: '🔍',
    category: TOOL_CATEGORIES.SECURITY,
    route: '/tools/compare-pdf',
    isPremium: true,
    features: ['side-by-side', 'change-highlighting']
  },

  // Intelligence
  {
    id: 'ai-summarizer',
    name: 'AI Summarizer',
    description: 'Quickly generate concise summaries from articles, paragraphs, and essays.',
    icon: '🤖',
    category: TOOL_CATEGORIES.INTELLIGENCE,
    route: '/tools/ai-summarizer',
    isPremium: true,
    features: ['summarization', 'key-points']
  },
  {
    id: 'translate-pdf',
    name: 'Translate PDF',
    description: 'Easily translate PDF files powered by AI. Keep fonts, layout, and formatting intact.',
    icon: '🌍',
    category: TOOL_CATEGORIES.INTELLIGENCE,
    route: '/tools/translate-pdf',
    isPremium: true,
    features: ['translation', 'format-preservation']
  },
  {
    id: 'pdf-to-markdown',
    name: 'PDF to Markdown',
    description: 'Easily turn PDFs into Markdown files. Perfect for notes, docs, and LLMs.',
    icon: '📝',
    category: TOOL_CATEGORIES.INTELLIGENCE,
    route: '/tools/pdf-to-markdown',
    isPremium: true,
    features: ['markdown-conversion', 'format-preservation']
  }
];

export const CATEGORY_INFO: Record<ToolCategory, CategoryInfo> = {
  [TOOL_CATEGORIES.ORGANIZE]: {
    name: 'Organize PDF',
    description: 'Merge, split, and manage your PDF documents',
    color: 'from-blue-500 to-blue-600'
  },
  [TOOL_CATEGORIES.OPTIMIZE]: {
    name: 'Optimize PDF',
    description: 'Compress, repair, and enhance PDF quality',
    color: 'from-green-500 to-green-600'
  },
  [TOOL_CATEGORIES.CONVERT_TO_PDF]: {
    name: 'Convert to PDF',
    description: 'Transform various formats into PDF',
    color: 'from-purple-500 to-purple-600'
  },
  [TOOL_CATEGORIES.CONVERT_FROM_PDF]: {
    name: 'Convert from PDF',
    description: 'Convert PDF to other formats',
    color: 'from-orange-500 to-orange-600'
  },
  [TOOL_CATEGORIES.EDIT]: {
    name: 'Edit PDF',
    description: 'Modify and customize your PDFs',
    color: 'from-pink-500 to-pink-600'
  },
  [TOOL_CATEGORIES.SECURITY]: {
    name: 'PDF Security',
    description: 'Protect and secure your documents',
    color: 'from-red-500 to-red-600'
  },
  [TOOL_CATEGORIES.INTELLIGENCE]: {
    name: 'PDF Intelligence',
    description: 'AI-powered PDF features',
    color: 'from-indigo-500 to-indigo-600'
  }
};

export const getToolById = (id: string): Tool | undefined => TOOLS.find(tool => tool.id === id);
export const getToolsByCategory = (category: ToolCategory): Tool[] => TOOLS.filter(tool => tool.category === category);
export const searchTools = (query: string): Tool[] => TOOLS.filter(tool => 
  tool.name.toLowerCase().includes(query.toLowerCase()) ||
  tool.description.toLowerCase().includes(query.toLowerCase())
);
