import { isString, isUnsignedInteger } from 'jet-validators';
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

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseCertificato" function
const parseCertificato = parseObject<ICertificato>({
  numero: isString,
  amount: isString,
  data: isString,
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

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  test,
} as const;