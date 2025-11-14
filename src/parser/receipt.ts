import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as xml2js from "xml2js";

function parseXMLFile(filePath: string) {
  const xmlContent = fs.readFileSync(filePath, "utf-8");
  return xml2js.parseStringPromise(xmlContent);
}

export async function parseFattura() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Usage example:
  const filePath = __dirname + "/receipt/r1.xml";
  const parsedData = await parseXMLFile(filePath);

  const header = parsedData.FatturaElettronica.FatturaElettronicaHeader;
  const body = parsedData.FatturaElettronica.FatturaElettronicaBody;
  const cup = body[0].DatiGenerali[0].DatiContratto[0].CodiceCUP[0];
  const cig = body[0].DatiGenerali[0].DatiContratto[0].CodiceCIG[0];
  const importo =
    body[0].DatiGenerali[0].DatiGeneraliDocumento[0].ImportoTotaleDocumento[0];
  const codiceDestinatario =
    header[0].DatiTrasmissione[0].CodiceDestinatario[0];
  const datiGenerali = body[0].DatiBeniServizi[0].DatiRiepilogo[0];
  const imponibile = datiGenerali.ImponibileImporto[0];
  const iva = datiGenerali.Imposta[0];
  const descrizione =
    body[0].DatiBeniServizi[0].DettaglioLinee[0].Descrizione[0];
  const dettaglioPagamento = body[0].DatiPagamento[0].DettaglioPagamento;
  const modalitaPagamento = dettaglioPagamento[0].ModalitaPagamento[0];
  const iban = dettaglioPagamento[0].IBAN[0];
  const ritenuta = Math.round((imponibile * 0.5) / 0.995) / 100 + '';

  return {
    cup,
    cig,
    importo,
    codiceDestinatario,
    imponibile,
    iva,
    descrizione,
    ritenuta,
    modalitaPagamento,
    iban,
  };
}
