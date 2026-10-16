import { NextResponse } from 'next/server';
import { 
  analyzeTenderText, 
  MAX_FILE_SIZE_BYTES, 
  SAMPLE_TENDER_DOCUMENTS 
} from '@/lib/ai/tender-pdf-analyzer';
import { TenderAnalysisResultSchema } from '@/lib/schemas/analysis-schema';
import { MOCK_STARTUPS } from '@/lib/data/mock-data';

// Simple in-memory rate limiter per IP / client
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30; // 30 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    return false;
  }

  clientData.count += 1;
  return true;
}

export async function POST(request: Request) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Rate limit exceeded. Please wait 60 seconds before submitting further documents.' 
      }, 
      { status: 429 }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let rawText = '';
    let fileName = 'Uploaded_Tender_Document.pdf';
    let startupId = 'startup-1';

    // Handle Multipart Form Data (PDF File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      startupId = (formData.get('startupId') as string) || 'startup-1';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No PDF file was provided in upload.' }, 
          { status: 400 }
        );
      }

      fileName = file.name;

      // Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { 
            success: false, 
            error: `File size exceeds the 15MB limit (File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB). Please optimize or split the PDF.` 
          }, 
          { status: 413 }
        );
      }

      // Handle empty file
      if (file.size === 0) {
        return NextResponse.json(
          { success: false, error: 'Uploaded file is 0 bytes (empty). Please upload a valid document.' }, 
          { status: 400 }
        );
      }

      // Validate PDF format
      if (!file.type.includes('pdf') && !fileName.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { success: false, error: 'Unsupported file format. Only PDF tender documents (.pdf) are accepted.' }, 
          { status: 415 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      try {
        // Safe PDF Text Extraction using pdf-parse
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text || '';
      } catch (parseErr) {
        // Fallback for malformed or scanned PDFs
        rawText = `[SCANNED IMAGE DOCUMENT: PDF contains bitmap pages without embedded text streams. Native OCR text extraction yielded 0 ASCII characters.]`;
      }
    } 
    // Handle JSON (Sample Documents or Direct Text)
    else {
      const jsonBody = await request.json();
      startupId = jsonBody.startupId || 'startup-1';

      if (jsonBody.sampleDocId) {
        const sample = SAMPLE_TENDER_DOCUMENTS.find(s => s.id === jsonBody.sampleDocId);
        if (sample) {
          rawText = sample.rawText;
          fileName = sample.name;
        }
      } else if (jsonBody.rawText) {
        rawText = jsonBody.rawText;
        fileName = jsonBody.fileName || 'Tender_Text_Input.pdf';
      }
    }

    if (!rawText) {
      return NextResponse.json(
        { success: false, error: 'Could not extract any content from the document.' }, 
        { status: 400 }
      );
    }

    const startup = MOCK_STARTUPS.find(s => s.id === startupId) || MOCK_STARTUPS[0];

    // Analyze using deterministic grounded rules and schema validation
    const analysisResult = analyzeTenderText(rawText, fileName, startup);

    // Validate structured output against Zod schema
    const validation = TenderAnalysisResultSchema.safeParse(analysisResult);
    if (!validation.success) {
      console.warn('Schema validation warning:', validation.error.format());
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      rawTextSummary: rawText.substring(0, 1000)
    });

  } catch (error: any) {
    console.error('Tender analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'An unexpected error occurred during tender document processing.' 
      }, 
      { status: 500 }
    );
  }
}
