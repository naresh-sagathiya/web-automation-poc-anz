import fs from 'node:fs/promises';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { PDFParse } from 'pdf-parse';
import { AccountSnapshot } from './export.types';

export async function createCsvExport(
  account: AccountSnapshot,
  outputDirectory: string
): Promise<string> {
  await fs.mkdir(outputDirectory, { recursive: true });

  const filePath = path.join(outputDirectory, 'account-export.csv');
  const csv = [
    'Account Number,Balance,Available Amount',
    `"${account.accountNumber}","${account.balance}","${account.availableAmount}"`
  ].join('\n');

  await fs.writeFile(filePath, csv, 'utf8');
  return filePath;
}

export async function createPdfExport(
  account: AccountSnapshot,
  outputDirectory: string
): Promise<string> {
  await fs.mkdir(outputDirectory, { recursive: true });

  const filePath = path.join(outputDirectory, 'account-export.pdf');
  const document = new PDFDocument();
  const chunks: Buffer[] = [];

  document.on('data', (chunk: Buffer) => chunks.push(chunk));

  const finished = new Promise<void>((resolve, reject) => {
    document.on('end', resolve);
    document.on('error', reject);
  });

  document.fontSize(18).text('ParaBank Account Export');
  document.moveDown();
  document.fontSize(12).text(`Account Number: ${account.accountNumber}`);
  document.text(`Balance: ${account.balance}`);
  document.text(`Available Amount: ${account.availableAmount}`);
  document.end();

  await finished;
  await fs.writeFile(filePath, Buffer.concat(chunks));
  return filePath;
}

export async function parseCsv(filePath: string): Promise<AccountSnapshot> {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.trim().split(/\r?\n/);
  const values = lines[1]
    .split(',')
    .map(value => value.trim().replace(/^"|"$/g, ''));

  return {
    accountNumber: values[0],
    balance: values[1],
    availableAmount: values[2]
  };
}

export async function parsePdf(filePath: string): Promise<AccountSnapshot> {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  await parser.destroy();

  const accountNumber = result.text.match(/Account Number:\s*(.+)/)?.[1]?.trim();
  const balance = result.text.match(/Balance:\s*(.+)/)?.[1]?.trim();
  const availableAmount = result.text.match(/Available Amount:\s*(.+)/)?.[1]?.trim();

  if (!accountNumber || !balance || !availableAmount) {
    throw new Error('Expected account data was not found in the PDF');
  }

  return { accountNumber, balance, availableAmount };
}
