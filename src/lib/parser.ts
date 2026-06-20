// @ts-ignore
import pdf from 'pdf-parse';

export async function parseResume(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    try {
      const data = await pdf(buffer);
      return data.text || '';
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF resume. Please ensure it is not password-protected or corrupted.');
    }
  } else if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or TXT file.');
  }
}
