export type SintesiCertificato = {
  certnumber: string | number;
  certdate: string | Date;
  certamount: number;
};

export type Certificato = {
  numero: string | number;
  oggetto: string;
  committente: string;
  impresa: string;
  corpo: CorpoCertificato;
  sal: SalCertificato[];
  fatture: FatturaCertificato[];
  sintesiCertificato?: SintesiCertificato[];
};

type CorpoCertificato = {
  header?: string;
  body: string;
  footer?: string;
};

type SalCertificato = {
	numero: string | number;
  periodo: string | Date;
	imponibile: string;
	ritenuta: string;
	iva: string;
	lordo: string;
	quotaSospesa?: string;
	altro?: string;
}

type FatturaCertificato = {
	numero: string | number;
	data: string | Date;
	imponibile: number;
  detrazione?: number;
  iva: number;
  percentualeIva: number;
	periodo: string | Date;
}
