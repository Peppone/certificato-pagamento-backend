import type { Certificato } from "./type/certificate.js";

export const certificationData: Certificato = {
  numero: 1,
  oggetto: '"Progetto innovativo tecnologico - misura 1234"',
  committente: "Autorità Regionale Innovazione Tecnologica",
  impresa: "RTI A Italia S.r.l. mandanti B, C, D",
  corpo: {
    /*header:
      "che sostituisce il precedente certificato di pagamento numero 1 emesso in data " +
      "25/10/2024 tramite la nota di credito numero 6836813964 del 23/06/2025 emessa da " +
      "IBM S.p.a che annulla la fattura 6836610392 del 10/11/2024 e la riemissione di " +
      "nuova fattura con numero 6836624842 in data 24/06/2025.",*/
    body:
      "Il sottoscritto, TizioCaio , nella qualità di Responsabile Unico del " +
      "Progetto ammesso a finanziamento con con D.D.G XX del YY/ZZ/WWWW VISTO: il " +
      "Contratto esecutivo relativo all'ordine di acquisto diretto n. 1234567, " +
      "sottoscritto digitalmente in data 99/99/2099, con CIG derivato: A1232DAD25, CUP: " +
      "G71C11548551234, Codice Caronte SI_1_32547 con il quale è stata affidata all'Impresa " +
      "l'esecuzione della su indicata fornitura e validato dalla regioneria come si evince " +
      "dalla piattaforma contabile regionale, SCORE",
    //footer: "Altra prova prova prova",
  },
  sal: [
    {
      numero: "1",
      periodo: "NOVEMBRE-SETTEMBRE 2025",
      imponibile: "100.000.000,00 €",
      ritenuta: "0,00 €",
      iva: "22.000.000,00 €",
      lordo: "122.000.000,00 €",
      altro: "Si noti che questo certificato è stato riemesso.",
    },
    {
      numero: "2",
      periodo: "NOVEMBRE-SETTEMBRE 2026",
      imponibile: "20.000.000,00 €",
      ritenuta: "50,00 €",
      iva: "22.000.000,00 €",
      lordo: "222.000.000,00 €",
    },
  ],
  fatture: [
    {
      numero: "1",
      data: "01/12/2025",
      ammontare: Number("100000000.0"),
      periodo: "NOVEMBRE-SETTEMBRE 2026",
      iva: Number("22000000.0"),
      percentualeIva: 0.22,
      ragioneSociale: "Azienda A Italia S.r.l",
    },
    {
      numero: "2",
      data: "01/12/2026",
      ammontare: Number("105200000.0"),
      detrazione: -5_000_000,
      periodo: "NOVEMBRE-SETTEMBRE 2026",
      iva: Number("22000000.0"),
      percentualeIva: 0.22,
      ragioneSociale: "A",
    },
    {
      numero: "2",
      data: "01/12/2026",
      ammontare: Number("105200000.0"),
      periodo: "NOVEMBRE-SETTEMBRE 2026",
      iva: Number("22000000.0"),
      percentualeIva: 0.22,
      ragioneSociale: "B",
    },
  ],
  sintesiCertificato: [
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
    {
      certnumber: "1",
      certdate: "01/12/2025",
      certamount: 100_000_000.0,
    },

    {
      certnumber: "2",
      certdate: "01/12/2026",
      certamount: 105_200_000.0,
    },
  ],
};

