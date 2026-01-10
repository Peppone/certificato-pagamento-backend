import { RouteError } from '@src/common/util/route-errors';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import Handlebars from "handlebars";
import { ICertificato, IDataCertGen } from '@src/models/Certificato';
import CertificatoRepo from '@src/repos/CertificatoRepo';
import puppeteer from 'puppeteer';
import fs from "fs";
import { dirname, join } from "path";
import conv_iac from '@src/pdfgen/num-util';
import { formatCurrency } from './utils/format';

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = 'User not found';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
function getAll(): Promise<ICertificato[]> {
  return CertificatoRepo.getAll();
}

/**
 * Add one certificato.
 */
function addOne(certificato: ICertificato): Promise<void> {
  return CertificatoRepo.add(certificato);
}

/**
 * Update one certificato.
 */
async function updateOne(certificato: ICertificato): Promise<void> {
  const persists = await CertificatoRepo.getOne(certificato.numero);
  if (!persists) {
    throw new RouteError(
      HTTP_STATUS_CODES.NotFound,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return certificato
  return CertificatoRepo.update(certificato);
}

async function generate(certificato: IDataCertGen): Promise<void> {
  const name = "nodejs-pdf-example.pdf";

  let configLaunch = {
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  const browser = await puppeteer.launch(configLaunch);
  console.log(__filename)
  const page = await browser.newPage();
  const waitUntil = "networkidle2";
  const templateDir = dirname(
    "./src/template/cert.hbs"
  );
  const pdfDir = dirname("dist\pdfgen\tmp");
  const file = fs.readFileSync(join(templateDir, "cert.hbs"), "utf8");
  //const templateDir = resolve(__dirname, '..', 'views', 'template-pdf.hbs');
  //const file = fs.readFileSync(templateDir, 'utf-8');

  const formattedSintesiCertificato = certificato.sintesiCertificato?.map(
    ({ amount: certamount, ...rest }) => ({
      ...rest,
      certamount: formatCurrency(certamount),
    })
  );
  let totale = 0;
  let totaleIva = 0;
  let totaleImponibile = 0;
  let totaleRitenuta = 0;

  const formattedFatture = certificato.fatture.map(
    ({
      ammontare,
      ritenuta,
      iva,
      percentualeIva,
      ragioneSociale,
      ...rest
    }) => {
      const imponibile = Number(ammontare) + (ritenuta ? Number(ritenuta) : 0);

      const formattedAmmontare = formatCurrency(Number(ammontare));

      const formattedImponibile = formatCurrency(imponibile);

      const formattedDetrazione =
        Number(ritenuta) && formatCurrency(Number(ritenuta));

      const formattedIva =
        Number(iva) && formatCurrency(Number(iva)*100);

      const partTotale = imponibile + Number(iva);

      totale += partTotale;
      totaleIva += Number(iva) || 0;
      totaleImponibile += imponibile;
      totaleRitenuta += Number(ritenuta) || 0;

      const formattedPartTotale = formatCurrency(partTotale);

      const formattedPercentualeIva = new Intl.NumberFormat("it-IT", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(percentualeIva)*100);

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
    (prev, { ragioneSociale, ammontare, ritenuta: detrazione, iva }) => {
      let partTotalePerDitta = 0;

      if (prev.has(ragioneSociale)) {
        partTotalePerDitta = prev.get(ragioneSociale) ?? 0;
      }

      prev.set(
        ragioneSociale,
        partTotalePerDitta + Number(ammontare) + (detrazione ? Number(detrazione) : 0) + Number(iva)
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
        (acc, curr) => (acc += curr.amount),
        0
      )
    );

  const formattedTotale = formatCurrency(totale);

  const formattedTotaleIva = formatCurrency(totaleIva);

  const formattedTotaleImponibile = formatCurrency(totaleImponibile);

  const formattedTotaleDetrazione = formatCurrency(totaleRitenuta);

  const sortedTotalePerDitta = Array.from(totalePerDitta.entries()).sort(
    ([ragA, totA], [ragB, totB]) => ragA.localeCompare(ragB)
  );

  const formattedTotalePerDitta = sortedTotalePerDitta.map(([rag, tot]) => ({
    ragioneSociale: rag,
    totale: formatCurrency(tot),
  }));

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
  //console.log(fileCompiled);
  const fileHTML = fileCompiled(data);
  //console.log(fileHTML);

  await page.setContent(fileHTML, {
    waitUntil,
  });

  page.setDefaultNavigationTimeout(1000);

  await page.pdf({
    format: "A4",
    path: `${pdfDir}/${name}`,
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
}

/**
 * Delete a certificato by its numero.
 */
async function _delete(numero: string): Promise<void> {
  const persists = await CertificatoRepo.getOne(numero);
  if (!persists) {
    throw new RouteError(
      HTTP_STATUS_CODES.NotFound,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete certificato
  return CertificatoRepo.delete(numero);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  generate,
  delete: _delete,
} as const;
