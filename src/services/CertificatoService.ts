import { RouteError } from '@src/common/util/route-errors';
import HTTP_STATUS_CODES from '@src/common/constants/HTTP_STATUS_CODES';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import { ICertificato } from '@src/models/Certificato';
import CertificatoRepo from '@src/repos/CertificatoRepo';

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
  delete: _delete,
} as const;
