import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

// Create the test directory and file that pdf-parse is looking for
async function ensureTestFilesExist() {
  const testDir = path.join(process.cwd(), 'test', 'data');
  const testFilePath = path.join(testDir, '05-versions-space.pdf');
  
  // Create test directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    await mkdir(testDir, { recursive: true });
  }
  
  // Create an empty PDF file if it doesn't exist
  if (!fs.existsSync(testFilePath)) {
    // Simple valid PDF content
    const minimalPDF = Buffer.from(
      '%PDF-1.3\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n',
      'utf-8'
    );
    await writeFile(testFilePath, minimalPDF);
  }
}

export async function POST(request: Request) {
  try {
    // Ensure test files exist before loading pdf-parse
    await ensureTestFilesExist();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temp file
    const tempFilePath = join(tmpdir(), `${randomUUID()}.pdf`);
    await writeFile(tempFilePath, buffer);
    
    try {
      // Try to parse the PDF
      const data = await pdfParse(buffer);
      
      // Clean up temp file
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
      
      return NextResponse.json({
        success: true,
        text: data.text,
        pages: data.numpages
      });
    } catch (error) {
      console.error('PDF parsing error:', error);
      
      // Clean up temp file
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse PDF. Please ensure the file is a valid PDF.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process PDF'
      },
      { status: 500 }
    );
  }
}