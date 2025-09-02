import {generatePDF, type PDFOptions} from 'pdf-node';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

// For ES Modules
const __filename = fileURLToPath(import.meta.url);

// Define TypeScript interfaces
interface User {
	name: string;
	age: number;
	email: string;
}

interface TemplateData {
	users: User[];
	date: string;
}

type SintesiCertificato = {
	certnumber: string;
	certdate: string;
	certamount: number;
}

type Certificato = {
	oggetto: string;
	committente: string;
	impresa: string;
	sintesiCertificato: SintesiCertificato[];
}

async function generateCertificate({oggetto, committente, impresa,sintesiCertificato}:Certificato) {
	// Read HTML template
    const dir = path.dirname('/home/portaluri/Progetti/certificati-pagamento/backend/src/template/cert.html');
	const html = fs.readFileSync(path.join(dir, 'cert.html'), 'utf8');



	// PDF options with TypeScript type
	const options: PDFOptions = {
		orientation: 'portrait',
		border: '5mm',
		footer: {
			height: '15mm',
			contents: {
				default:
					'<div style="text-align: center; color: #666;">Page {{page}} of {{pages}}</div>'
			}
		}
	} as any;

	// Generate PDF with buffer output
	try {

	const formattedSintesiCertificato = sintesiCertificato.map(({certamount, ...rest}) => ({
		...rest,
		certamount: new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(certamount)
	}));

		const result = await generatePDF({
			html: html,
			data: {
				oggetto,
				committente,
				impresa,
				certificate: formattedSintesiCertificato,
				date: new Date().toLocaleDateString()
			},
			type: 'pdf',
			buffer: true, // Get PDF as buffer
			pdfOptions: options
		} as any);

		// Example: Save buffer to file
		if ('buffer' in result) {
			fs.writeFileSync('./user-report-buffer.pdf', result.buffer);
			console.log('PDF generated from buffer');
		}

		// Or use the file path if not using buffer
		if ('filename' in result) {
			console.log('PDF generated at:', result.filename);
		}
	} catch (error) {
		console.error('Error generating PDF:', error);
	}
}

generateCertificate({
	oggetto: '"Digitalizzazione dei processi e dei procedimenti in adesione"',
	committente: 'Autorità Regionale Innovazione Tecnologica',
	impresa: 'RTI IBM Italia S.p.A. mandanti S1, S2, S3',
	sintesiCertificato: [{
		certnumber: '1',
		certdate: '01/12/2025',
		certamount: 100000000.00
	},
	{
		certnumber: '2',
		certdate: '01/12/2026',
		certamount: 105200000.00
	}]
});

///IMPORTANT! RUN WITH OPENSSL_CONF=/dev/null 