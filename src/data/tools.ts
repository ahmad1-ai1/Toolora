import { ToolMetadata, ToolCategory } from '../types';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'images',
    name: 'Images',
    description: 'Compress, resize, and convert image files client-side with zero loss in quality.',
    icon: 'ImageIcon',
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Compress PDF files, merge JPGs into PDF, and convert PDF pages into high-resolution JPG images.',
    icon: 'FileText',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Analyze word counts, character limits, reading speeds, and format text strings.',
    icon: 'AlignLeft',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Format & validate JSON structures, generate dynamic QR codes, and debug payloads.',
    icon: 'Code2',
  },
  {
    id: 'calculators',
    name: 'Calculators',
    description: 'Calculate percentages, date differences, exact chronological age, and leap-year intervals.',
    icon: 'Calculator',
  },
];

export const TOOLS: ToolMetadata[] = [
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce image file size while keeping great quality.',
    longDescription: 'Compress JPG, PNG, and WebP images directly in your browser. Maintain visual crispness while drastically slashing file sizes for faster web pages and smaller email attachments.',
    category: 'images',
    iconName: 'Minimize2',
    isPopular: true,
    keywords: ['image compressor', 'compress photo', 'reduce image size', 'jpg compressor', 'png compressor', 'webp compress', 'shrink picture'],
    features: [
      'Client-side compression with zero server upload',
      'Supports JPG, JPEG, PNG, and WebP formats',
      'Interactive quality slider with real-time file size comparison',
      'Side-by-side or tabbed visual preview',
      'Instant savings percentage metric calculation',
      'Batch download and privacy guaranteed',
    ],
    howToSteps: [
      'Drag and drop your image file or click to browse from your device.',
      'Adjust the compression quality slider to balance fidelity and size.',
      'Review the live calculated output size and percent saved.',
      'Click "Download Compressed Image" to save your optimized file immediately.',
    ],
    whyUse: [
      '100% Client-side: Your private photos and sensitive documents never leave your browser.',
      'Lightning speed: No network queue, uploading, or downloading from remote servers.',
      'Smart compression: Utilizes native browser canvas compression algorithms for optimal balance.',
    ],
    faqs: [
      {
        question: 'Are my photos uploaded to any external server?',
        answer: 'No. All image processing runs strictly within your browser using modern HTML5 Canvas and Web APIs. Your images are never transmitted over the internet.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, JPEG, PNG, and WebP. You can also output your compressed images in your preferred file format.',
      },
      {
        question: 'What is the recommended quality setting?',
        answer: 'For websites and email, 75% to 85% delivers massive size reductions (often 60-80% smaller) with virtually imperceptible loss of visual sharpness.',
      },
    ],
    relatedToolSlugs: ['image-resizer', 'jpg-to-pdf', 'pdf-to-jpg'],
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    shortDescription: 'Reduce PDF file size without sacrificing readability.',
    longDescription: 'Optimize and compress PDF documents right inside your browser. Strip redundant streams, optimize document objects, and produce compact PDF files ready for email and portal uploads.',
    category: 'pdf',
    iconName: 'FileArchive',
    isPopular: true,
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer', 'small pdf'],
    features: [
      'Client-side PDF stream optimization and dictionary stripping',
      'Calculates original size, new size, and exact savings',
      'Safe for contracts, resumes, statements, and tax forms',
      'Zero server latency and zero upload risk',
      'Clear diagnostics and handling of encrypted or already-compressed files',
    ],
    howToSteps: [
      'Upload your PDF document by dragging it into the dropzone or clicking to select.',
      'The engine automatically analyzes document streams, fonts, and object structures.',
      'Review original file size versus optimized size and savings percentage.',
      'Click "Download Compressed PDF" to receive your lightweight document.',
    ],
    whyUse: [
      'Absolute confidentiality: Ideal for sensitive legal, financial, and medical documents.',
      'No file size queues or waiting rooms.',
      'Compliant with standard PDF readers like Adobe Acrobat, Preview, and browser viewers.',
    ],
    faqs: [
      {
        question: 'How much smaller will my PDF become?',
        answer: 'Compression rates vary depending on the original document. Documents containing redundant object definitions, high-overhead metadata, or uncompressed vector streams often shrink by 20% to 60%. Documents that are already hyper-optimized or contain pre-compressed scanned images will see modest changes.',
      },
      {
        question: 'Can I compress password-protected PDFs?',
        answer: 'Encrypted PDFs cannot be modified without entering their credentials. Please ensure your PDF is decrypted before processing.',
      },
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-to-jpg', 'image-compressor'],
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert multiple images into a single polished PDF document.',
    longDescription: 'Combine JPG, PNG, and WebP images into one organized, printable PDF. Customize page orientation, margins, and page sizes (A4, Letter, or Fit to Image).',
    category: 'pdf',
    iconName: 'FileSpreadsheet',
    isPopular: true,
    keywords: ['jpg to pdf', 'images to pdf', 'convert photo to pdf', 'combine images pdf', 'png to pdf', 'create pdf from photos'],
    features: [
      'Multi-image batch upload with thumbnail previews',
      'Interactive touch-friendly reordering (move up/down or drag)',
      'Page size selection: A4, US Letter, or Fit to Image dimensions',
      'Orientation options: Portrait or Landscape',
      'Margin controls: None, Small, or Standard padding',
      'Instant client-side PDF generation using pure JavaScript',
    ],
    howToSteps: [
      'Add one or more images using the file picker or drag-and-drop zone.',
      'Arrange your images in the desired page order using the order arrows or controls.',
      'Select your target page size (e.g. A4), orientation, and margin preferences.',
      'Click "Generate & Download PDF" to instantly create your combined document.',
    ],
    whyUse: [
      'Convenient for receipts, multipage scanned documents, portfolios, and homework assignments.',
      'Zero server upload: Your personal photos remain entirely on your device.',
      'Generates universally compatible, crisp vector-embedded PDF files.',
    ],
    faqs: [
      {
        question: 'Can I upload formats other than JPG?',
        answer: 'Yes! You can upload PNG, WebP, and standard JPG files interchangeably, and they will all be assembled into a single continuous PDF.',
      },
      {
        question: 'Is there a limit on how many images I can merge?',
        answer: 'Because processing happens directly in your browser memory, you can easily combine 30+ images without restriction.',
      },
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'pdf-compressor', 'image-compressor'],
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Extract and convert PDF pages into high-quality JPG images.',
    longDescription: 'Turn any PDF into sharp, high-resolution JPG images. Preview every page individually, choose specific pages or convert the whole document, and download as single images or a handy ZIP archive.',
    category: 'pdf',
    iconName: 'FileImage',
    isPopular: true,
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to photo', 'extract pdf pages', 'pdf to jpeg converter'],
    features: [
      'Full in-browser PDF rendering using canvas technology',
      'Interactive gallery preview of every page in the document',
      'Select specific pages or export all pages simultaneously',
      'Download individual page JPGs or download all in a ZIP file',
      'High DPI crispness suitable for presentations and printing',
    ],
    howToSteps: [
      'Upload your PDF document into the designated drop area.',
      'Browse through the rendered page thumbnails in the preview gallery.',
      'Select individual pages or leave all selected.',
      'Click "Download JPG" on any page or "Download All as ZIP".',
    ],
    whyUse: [
      'Extract slides, receipts, book pages, or certificates without taking blurry screenshots.',
      'Complete privacy: documents are rendered locally in your browser memory.',
      'High-resolution output preserving fine typography and line art.',
    ],
    faqs: [
      {
        question: 'What resolution are the extracted JPGs?',
        answer: 'Pages are rendered at high scale (up to 2x display density) to preserve fine fonts and diagrams cleanly.',
      },
      {
        question: 'Can I convert just one page from a 20-page document?',
        answer: 'Yes! Each page has its own direct "Download Page JPG" button so you never have to convert pages you do not need.',
      },
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-compressor', 'image-resizer'],
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize photos to exact pixel dimensions or popular social presets.',
    longDescription: 'Resize JPG, PNG, and WebP images with precision. Lock aspect ratio, choose from curated social media presets (Instagram, YouTube, LinkedIn, X/Twitter), and export in your chosen file format.',
    category: 'images',
    iconName: 'Maximize2',
    isPopular: true,
    keywords: ['image resizer', 'resize photo', 'change picture dimensions', 'instagram photo size', 'youtube thumbnail resizer', 'scale image'],
    features: [
      'Precise custom width and height inputs with aspect ratio lock',
      'One-click presets: Instagram Square (1080x1080), Instagram Story (1080x1920), YouTube Thumbnail (1280x720), Twitter Header (1500x500), LinkedIn Banner (1584x396)',
      'High-quality bicubic canvas interpolation algorithm',
      'Export to JPG, PNG, or WebP with adjustable compression quality',
      'Live dimension badge and file preview',
    ],
    howToSteps: [
      'Select or drag an image into the resizer workbench.',
      'Pick a popular preset or type your custom width and height.',
      'Optionally toggle the aspect ratio lock or pick an output format.',
      'Click "Download Resized Image" to save your scaled file.',
    ],
    whyUse: [
      'Meet exact platform requirements for profile avatars, thumbnails, and banners.',
      'Fast client-side rendering with instant preview feedback.',
      'No quality degradation caused by multiple server re-encodings.',
    ],
    faqs: [
      {
        question: 'What does "Lock Aspect Ratio" do?',
        answer: 'When enabled, changing the width automatically updates the height proportionally (and vice-versa) so your photo never looks stretched or squished.',
      },
      {
        question: 'Does resizing reduce file size?',
        answer: 'Yes! Reducing the pixel dimensions of an image naturally reduces the number of pixels stored, which significantly shrinks file size.',
      },
    ],
    relatedToolSlugs: ['image-compressor', 'jpg-to-pdf', 'qr-code-generator'],
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Real-time text analyzer with word, character, and speed metrics.',
    longDescription: 'Comprehensive real-time writing statistics. Count words, characters, spaces, sentences, paragraphs, estimated reading time, and speaking time. Features case conversion tools and keyword density tracking.',
    category: 'text',
    iconName: 'FileSpreadsheet',
    isPopular: false,
    keywords: ['word counter', 'character count', 'text analyzer', 'reading time calculator', 'essay word count', 'sentence counter'],
    features: [
      'Instant real-time analysis as you type or paste',
      'Tracks words, characters (with and without spaces), sentences, and paragraphs',
      'Calculates accurate reading time (~200 wpm) and speaking time (~130 wpm)',
      'Top keyword frequency and density breakdown table',
      'One-click case transformers: UPPERCASE, lowercase, Title Case, Sentence case',
      'Instant copy to clipboard and clear actions',
    ],
    howToSteps: [
      'Type or paste your text into the expansive writing area.',
      'Inspect the top metric cards which update in real time.',
      'Use the case transformation buttons if you need to reformat capitalization.',
      'Click "Copy Text" to grab your polished writing with one tap.',
    ],
    whyUse: [
      'Perfect for essays, blog articles, social media character limits (X/Twitter, LinkedIn), and speeches.',
      'Zero server transmission: Private journals, drafts, and notes remain confidential.',
      'Instant feedback with zero delay or page reloads.',
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Based on standard cognitive reading research, the average adult reads at approximately 200 words per minute. Speaking time is calculated at 130 words per minute.',
      },
      {
        question: 'Is there a limit to how many words I can paste?',
        answer: 'You can paste full book chapters or lengthy research papers (50,000+ words) and the analysis will calculate within milliseconds.',
      },
    ],
    relatedToolSlugs: ['json-formatter', 'qr-code-generator', 'percentage-calculator'],
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create custom QR codes for URLs, text, Wi-Fi, emails, and phone numbers.',
    longDescription: 'Generate crisp, scannable QR codes in seconds. Supports website URLs, freeform text, direct email composition, phone dialing, and Wi-Fi network credentials. Download high-resolution PNG or vector SVG.',
    category: 'developer',
    iconName: 'QrCode',
    isPopular: true,
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'wifi qr code', 'url to qr', 'vector qr code svg'],
    features: [
      'Multiple dynamic input presets: URL, Plain Text, Email, Phone, and Wi-Fi Network',
      'Customizable foreground and background colors with instant preview',
      'Configurable error correction levels (Low, Medium, Quartile, High)',
      'Adjustable pixel resolution slider (up to 1200px)',
      'Export as high-res raster PNG or infinite-resolution vector SVG',
    ],
    howToSteps: [
      'Select your data type (e.g. Website URL, Wi-Fi, or Contact Info).',
      'Fill in the required fields; your QR code updates live on the screen.',
      'Optionally customize color palettes and error correction levels.',
      'Click "Download PNG" or "Download SVG" to save your ready-to-print code.',
    ],
    whyUse: [
      'Static QR codes that never expire and require no recurring subscriptions.',
      'Supports high-density vector SVG for billboards, business cards, and menus.',
      'Private and ad-free: Your links and Wi-Fi passwords are never logged or stored.',
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No! These are standard static QR codes encoded directly with your data. They will function permanently for as long as the underlying link or Wi-Fi password exists.',
      },
      {
        question: 'What is Error Correction Level?',
        answer: 'Error correction allows the QR code to remain scannable even if parts are smudged, damaged, or covered by a logo. "High" (Level H) allows up to 30% data recovery.',
      },
    ],
    relatedToolSlugs: ['json-formatter', 'image-resizer', 'word-counter'],
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    shortDescription: 'Prettify, minify, and validate JSON with line-by-line syntax diagnostics.',
    longDescription: 'A developer-grade JSON workbench. Format messy JSON with customizable indentation, minify for production payload efficiency, and identify syntax errors with precise error locations.',
    category: 'developer',
    iconName: 'Braces',
    isPopular: false,
    keywords: ['json formatter', 'json prettify', 'json validator', 'json minifier', 'format json online', 'json parser'],
    features: [
      'Format with 2 spaces, 4 spaces, or compact tabs',
      'Minify JSON to a single compressed line for API payloads',
      'Strict schema validation highlighting exact problem syntax and line offsets',
      'Interactive key-value explorer and structure tree',
      'Sample JSON loader for rapid testing',
      'One-click copy and clean error messaging without raw JS traces',
    ],
    howToSteps: [
      'Paste raw JSON into the code editor or click "Load Sample".',
      'Click "Prettify JSON" to format with clean indentation.',
      'If your JSON has a typo, review the friendly diagnostic message highlighting the issue.',
      'Copy the formatted or minified output to your clipboard with one click.',
    ],
    whyUse: [
      'Essential for developers debugging REST APIs, webhooks, and config files.',
      'Safe for production credentials: JSON is evaluated locally without hitting any third-party server.',
      'Keyboard shortcut friendly and resilient to huge JSON payloads.',
    ],
    faqs: [
      {
        question: 'Is my data secure when using this formatter?',
        answer: 'Yes! JSON formatting and validation occur completely client-side in your browser. No tokens, secrets, or payloads are transmitted to any server.',
      },
      {
        question: 'Can it handle invalid JSON with trailing commas?',
        answer: 'Our validator detects common issues such as trailing commas, unquoted keys, and mismatched brackets, pointing you directly to the exact location to fix.',
      },
    ],
    relatedToolSlugs: ['qr-code-generator', 'word-counter', 'percentage-calculator'],
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Solve percentage increases, decreases, fractions, and discounts with steps.',
    longDescription: 'An intuitive percentage math solver. Calculate what X% of Y is, determine what percentage X is of Y, and compute percentage increase/decrease between two values with clear mathematical breakdown.',
    category: 'calculators',
    iconName: 'Percent',
    isPopular: false,
    keywords: ['percentage calculator', 'calculate percent', 'percent increase calculator', 'percent decrease', 'discount calculator', 'fraction to percent'],
    features: [
      'Three dedicated calculation modes for everyday financial and educational needs',
      'Live instant results with every keystroke',
      'Step-by-step formula breakdown showing the underlying math',
      'Color-coded gain/loss indicators for percent increase and decrease',
      'Quick reset button and high contrast readable typography',
    ],
    howToSteps: [
      'Choose the calculation scenario matching your question.',
      'Enter the values into the designated input fields.',
      'The calculated percentage and numerical result appear instantaneously.',
      'Review the step-by-step formula cards to see the math explained.',
    ],
    whyUse: [
      'Perfect for calculating store discounts, tip amounts, tax rates, margins, and quiz scores.',
      'Eliminates mental math errors and explains the exact steps.',
      'Responsive and thumb-friendly touch layout optimized for mobile shoppers.',
    ],
    faqs: [
      {
        question: 'How do you calculate a percentage increase?',
        answer: 'Subtract the original number from the new number, divide that difference by the original number, and multiply by 100.',
      },
      {
        question: 'Can I calculate negative numbers?',
        answer: 'Yes, the calculator accurately supports positive numbers, decimals, and negative changes.',
      },
    ],
    relatedToolSlugs: ['age-calculator', 'word-counter', 'json-formatter'],
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    shortDescription: 'Calculate chronological age in years, months, days, and birthday countdown.',
    longDescription: 'Determine exact age with calendar precision. Computes years, months, and days lived, total elapsed days and hours, the exact day of the week you were born, and a live countdown to your next birthday.',
    category: 'calculators',
    iconName: 'Calendar',
    isPopular: false,
    keywords: ['age calculator', 'calculate my age', 'chronological age', 'days until birthday', 'how old am i', 'birthday countdown'],
    features: [
      'Accurate chronological calculations handling leap years and variable month lengths',
      'Detailed breakdown: Years, Months, Days, Total Weeks, Total Days, and Total Hours',
      'Next birthday countdown showing days remaining and weekday',
      'Historical day-of-week detection (e.g., "Born on a Thursday")',
      'Custom reference date option to calculate age at any point in history or future',
    ],
    howToSteps: [
      'Select your Date of Birth using the intuitive date picker.',
      'Optionally adjust the "Calculate Age At" reference date (defaults to today).',
      'Instantly view your full chronological age breakdown and birthday countdown.',
    ],
    whyUse: [
      'Useful for official forms, passport renewals, insurance quotes, and milestones.',
      'Accurately accounts for leap years (such as Feb 29) without crude 365.25 approximations.',
      'Clean visual cards that are easy to screenshot or share.',
    ],
    faqs: [
      {
        question: 'How does the calculator handle leap years?',
        answer: 'The algorithm evaluates the precise Gregorian calendar rules, calculating exact leap days that occurred during your lifetime rather than using a rounded average.',
      },
      {
        question: 'Can I calculate how old someone was on a past date?',
        answer: 'Yes! You can set the "Calculate Age At" field to any date in the past or future to calculate their exact age at that specific point in time.',
      },
    ],
    relatedToolSlugs: ['percentage-calculator', 'word-counter', 'image-compressor'],
  },
];
