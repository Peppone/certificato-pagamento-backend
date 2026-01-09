import { isNumber } from 'jet-validators';
import { transform } from 'jet-validators/utils';

import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';
import UserService from '@src/services/UserService';
import Certificato from '@src/models/Certificato';

import { IReq, IRes } from './common/types';
import { parseReq } from './common/util';
import CertificatoService from '@src/services/CertificatoService';
import CertificatoRepo from '@src/repos/CertificatoRepo';

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  add: parseReq({ certificato: Certificato.test }),
  modify: parseReq({ certificato: Certificato.test }),
  generate: parseReq({ data: Certificato.generate })
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Add a certificato.
 */
async function add(req: IReq, res: IRes) {
  console.log(req.body);
  const { certificato } = Validators.add({ certificato: req.body });
  //await CertificatoService.addOne(certificato);
  res.status(HTTP_STATUS_CODES.Created).send(certificato).end();
}

async function getAll(req: IReq, res: IRes) {
  const certificati = await CertificatoRepo.getAll();
  res.status(HTTP_STATUS_CODES.Ok).send(certificati).end();
}

/**
 * Modify a certificato.
 */
async function modify(req: IReq, res: IRes) {
  const { certificato } = Validators.modify(req.body);
  await CertificatoService.addOne(certificato);
  res.status(HTTP_STATUS_CODES.Created).end();
}

async function generate(req: IReq, res: IRes) {
  const { data } = Validators.generate(req.body);
  await CertificatoService.generate(data);
res.status(HTTP_STATUS_CODES.Ok).end();
}
/******************************************************************************
                                Export default
******************************************************************************/

export default {
  add,
  getAll,
  modify,
  generate,
} as const;
