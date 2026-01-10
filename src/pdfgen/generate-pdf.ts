import type { NextFunction, Request, Response } from "express";
import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import path, { dirname, join } from "path";
import Handlebars from "handlebars";
import type { Certificato } from "./type/certificate.ts";
import conv_iac from "./num-util.js";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);


export class PDFController {
  async index(certificato: Certificato) {
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
          (acc, curr) => (acc += Number(curr.certamount)),
          0
        )
      );

    const totaleSintesiRitenuta =
      certificato.sintesiCertificato &&
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(
        certificato.sintesiCertificato.reduce(
          (acc, curr) => (acc += Number(curr.ritenuta)),
          0
        )
      );
      console.log("HELLO")
      console.log(totaleSintesiRitenuta);

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
      ragioneSociale: rag,
      totale: new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(tot),
    }));

    const data = {
      ...certificato,
      certificate: formattedSintesiCertificato,
      totaleSintesiCertificato,
      totaleSintesiRitenuta,
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
    return 200;
    //const pdfFile = fs.readFileSync(`tmp/${name}`);

    //fs.unlinkSync(`tmp/${name}`);

    /*response.contentType('application/pdf');
    response.send(pdfFile);*/
  }
}
