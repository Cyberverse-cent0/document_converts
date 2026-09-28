const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

// Create a simple test PDF file
const testPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000208 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

// Write test PDF files
fs.writeFileSync('/tmp/test1.pdf', testPdfContent);
fs.writeFileSync('/tmp/test2.pdf', testPdfContent);

// Test the merge endpoint
const form = new FormData();
form.append('files', fs.createReadStream('/tmp/test1.pdf'), 'test1.pdf');
form.append('files', fs.createReadStream('/tmp/test2.pdf'), 'test2.pdf');

const options = {
  hostname: 'localhost',
  port: 5280,
  path: '/api/pdf/merge',
  method: 'POST',
  headers: form.getHeaders()
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    console.log('Response body:', data);
  });
});

form.pipe(req);

req.on('error', (error) => {
  console.error('Error:', error);
});
