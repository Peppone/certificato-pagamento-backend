import type { Request, Response } from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import { dirname, join } from "path";
import Handlebars from "handlebars";
import type { Certificato, ImportoDitta } from "./type/certificate.ts";
import conv_iac from "./num-util.js";

class PDFController {
  async index(certificato: Certificato) {
    const name = "nodejs-pdf-example.pdf";

    let configLaunch = {
      headless: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    };

    const browser = await puppeteer.launch(configLaunch);

    const page = await browser.newPage();
    const waitUntil = "networkidle2";
    const templateDir = dirname(
      "/home/portaluri/Progetti/certificati-pagamento/backend/src/template/cert.hbs"
    );
    const file = fs.readFileSync(join(templateDir, "cert.hbs"), "utf8");
    //const templateDir = resolve(__dirname, '..', 'views', 'template-pdf.hbs');
    //const file = fs.readFileSync(templateDir, 'utf-8');

    const formattedSintesiCertificato = certificato.sintesiCertificato?.map(
      ({ certamount, ...rest }) => ({
        ...rest,
        certamount: new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(certamount),
      })
    );
    let totale = 0;
    let totaleIva = 0;
    let totaleImponibile = 0;
    let totaleDetrazione = 0;

    const formattedFatture = certificato.fatture.map(
      ({
        ammontare,
        detrazione,
        iva,
        percentualeIva,
        ragioneSociale,
        ...rest
      }) => {
        const imponibile = ammontare + (detrazione ?? 0);

        const formattedAmmontare = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(ammontare);

        const formattedImponibile = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(imponibile);

        const formattedDetrazione =
          detrazione &&
          new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(detrazione);

        const formattedIva =
          iva &&
          new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(iva);

        const partTotale = imponibile + iva;

        totale += partTotale;
        totaleIva += iva || 0;
        totaleImponibile += imponibile;
        totaleDetrazione += detrazione || 0;

        const formattedPartTotale = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(partTotale);

        const formattedPercentualeIva = new Intl.NumberFormat("it-IT", {
          style: "percent",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(percentualeIva);

        return {
          ...rest,
          ammontare: formattedAmmontare,
          imponibile: formattedImponibile,
          detrazione: formattedDetrazione,
          totale: formattedPartTotale,
          iva: formattedIva,
          percentualeIva: formattedPercentualeIva,
          ragioneSociale,
        };
      }
    );

    const totalePerDitta = certificato.fatture.reduce(
      (prev, { ragioneSociale, ammontare, detrazione, iva }) => {
        let partTotalePerDitta = 0;

        if (prev.has(ragioneSociale)) {
          partTotalePerDitta = prev.get(ragioneSociale) ?? 0;
        }

        prev.set(
          ragioneSociale,
          partTotalePerDitta + ammontare + (detrazione ?? 0) + iva
        );

        return prev;
      },
      new Map<string, number>()
    );

    const totaleSintesiCertificato =
      certificato.sintesiCertificato &&
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(
        certificato.sintesiCertificato.reduce(
          (acc, curr) => (acc += curr.certamount),
          0
        )
      );

    const formattedTotale = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(totale);

    const formattedTotaleIva = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(totaleIva);

    const formattedTotaleImponibile = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(totaleImponibile);

    const formattedTotaleDetrazione = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(totaleDetrazione);

    const sortedTotalePerDitta = Array.from(totalePerDitta.entries()).sort(
      ([ragA, totA], [ragB, totB]) => ragA.localeCompare(ragB)
    );

    const formattedTotalePerDitta = sortedTotalePerDitta.map(([rag, tot]) => ({
      ragioneSociale:rag,
      totale: new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(tot),
  }));

    console.log("AAAAA");
    console.log(formattedTotalePerDitta);
    const data = {
      ...certificato,
      certificate: formattedSintesiCertificato,
      totaleSintesiCertificato,
      fatture: formattedFatture,
      totale: formattedTotale,
      totaleImponibile: formattedTotaleImponibile,
      totaleIva: formattedTotaleIva,
      totaleStringNum: conv_iac(totale),
      totaleIvaStringNum: conv_iac(totaleIva),
      totaleDetrazione: formattedTotaleDetrazione,
      dataCertificato:
        certificato.dataCertificato ?? new Date().toLocaleDateString("it-IT"),
      totalePerDitta: formattedTotalePerDitta,
    };

    const fileCompiled = Handlebars.compile(file);
    console.log(fileCompiled);
    const fileHTML = fileCompiled(data);
    console.log(fileHTML);

    await page.setContent(fileHTML, {
      waitUntil,
    });

    page.setDefaultNavigationTimeout(5000);

    await page.pdf({
      format: "A4",
      path: `/home/portaluri/Progetti/certificati-pagamento/backend/dist/pdfgen/tmp/${name}`,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      printBackground: true,
      margin: {
        top: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();
    //const pdfFile = fs.readFileSync(`tmp/${name}`);

    //fs.unlinkSync(`tmp/${name}`);

    /*response.contentType('application/pdf');
    response.send(pdfFile);*/
  }
}

const certificatoData: Certificato = {
  numero: 1,
  oggetto: '"Digitalizzazione dei processi e dei procedimenti in adesione"',
  committente: "Autorità Regionale Innovazione Tecnologica",
  impresa: "RTI IBM Italia S.p.A. mandanti S1, S2, S3",
  corpo: {
    /*header:
      "che sostituisce il precedente certificato di pagamento numero 1 emesso in data " +
      "25/10/2024 tramite la nota di credito numero 6836813964 del 23/06/2025 emessa da " +
      "IBM S.p.a che annulla la fattura 6836610392 del 10/11/2024 e la riemissione di " +
      "nuova fattura con numero 6836624842 in data 24/06/2025.",*/
    body:
      "La sottoscritta, Avv. Vitalba Vaccaro, nella qualità di Responsabile Unico del " +
      "Progetto ammesso a finanziamento con con D.D.G 97 del 24/06/2024 VISTO: il " +
      "Contratto esecutivo relativo all'ordine di acquisto diretto n. 7379100, " +
      "sottoscritto digitalmente in data 16/08/2023, con CIG derivato: A0052ADAB9, CUP: " +
      "G71C22001550002, Codice Caronte SI_1_34253 con il quale è stata affidata all'Impresa " +
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
      ragioneSociale: "A",
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
  ],
};

new PDFController().index(certificatoData);

//export default new PDFController();
