import { isString, isUnsignedInteger, isObjectArray } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';

import { transformIsDate } from '@src/common/util/validators';
import { IModel } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const DEFAULT_CERTIFICATO_VALS: ICertificato = {
  numero: '',
  amount: '',
  data: '',
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

export interface ICertificato {
  numero: string;
  amount: string;
  data: string;
}

export interface IDataCertGen {
  numero: string | number;
  oggetto: string;
  committente: string;
  impresa: string;
  corpo: CorpoCertificato;
  sal: SalCertificato[];
  fatture: FatturaCertificato[];
  sintesiCertificato?: SintesiCertificato[];
  dataCertificato?: string | Date;
}

export type SintesiCertificato = {
  numero: string;
  data: string;
  amount: string;
  ritenuta:string;
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
  numero: string;
  data: string | Date;
  ammontare: string;
  ritenuta?: number;
  iva: string;
  percentualeIva: string;
  periodo: string | Date;
  ragioneSociale: string;
}

export type ImportoDitta = Map<string, number>;

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseCertificato" function
const parseCertificato = parseObject<ICertificato>({
  numero: isString,
  amount: isString,
  data: isString,
});

const parseDataCertGen = parseObject<IDataCertGen>({
  numero: isString,
  oggetto: isString,
  committente: isString,
  impresa: isString,
  corpo: {
    body: isString,
  },
  sal: [{
    numero: isString,
    periodo: isString,
    imponibile: isString,
    ritenuta: isString,
    iva: isString,
    lordo: isString,
  }],
  fatture: [{
    numero: isString,
    data: isString,
    ammontare: isString,
    iva: isString,
    percentualeIva: isString,
    periodo: isString,
    ragioneSociale: isString,
  }],
});


/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New certificato object.
 */
function __new__(certificato?: Partial<ICertificato>): ICertificato {
  const defaults = { ...DEFAULT_CERTIFICATO_VALS };
  return parseCertificato({ ...defaults, ...certificato }, errors => {
    throw new Error('Setup new certificato failed ' + JSON.stringify(errors, null, 2));
  });
}

/**
 * Check is a certificato object. For the route validation.
 */
function test(arg: unknown, errCb?: TParseOnError): arg is ICertificato {
  return !!parseCertificato(arg, errCb);
}

function generate(arg: unknown, errCb?: TParseOnError): arg is IDataCertGen {
  return true; //!!parseDataCertGen(arg, errCb);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  test,
  generate,
} as const;