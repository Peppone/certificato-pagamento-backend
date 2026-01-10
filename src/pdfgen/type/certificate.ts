export type SintesiCertificato = {
  certnumber: string | number;
  certdate: string | Date;
  certamount: string;
  ritenuta: string;
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
  dataCertificato?: string | Date;
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
	ammontare: number;
  detrazione?: number;
  iva: number;
  percentualeIva: number;
	periodo: string | Date;
  ragioneSociale: string;
}

export type ImportoDitta = Map<string, number>;