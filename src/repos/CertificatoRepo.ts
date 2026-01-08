import { ICertificato } from '@src/models/Certificato';
import { getRandomInt } from '@src/common/util/misc';

import orm from './MockOrm';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one certificato.
 */
async function getOne(numero: string): Promise<ICertificato | null> {
  const db = await orm.openDb();
  for (const certificato of db.certificati) {
    if (certificato.numero === numero) {
      return certificato;
    }
  }
  return null;
}

/**
 * Get all certificati.
 */
async function getAll(): Promise<ICertificato[]> {
  const db = await orm.openDb();
  return db.certificati;
}

/**
 * Add one certificato.
 */
async function add(certificato: ICertificato): Promise<void> {
  const db = await orm.openDb();
  db.certificati.push(certificato);
  return orm.saveDb(db);
}

/**
 * Update a certificato.
 */
async function update(certificato: ICertificato): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.certificati.length; i++) {
    if (db.certificati[i].numero === certificato.numero) {
      const dbCertificato = db.certificati[i];
      db.certificati[i] = {
        ...dbCertificato,
        ...certificato,
      };
      return orm.saveDb(db);
    }
  }
}

/**
 * Delete one certificato.
 */
async function delete_(numero: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.certificati.length; i++) {
    if (db.certificati[i].numero === numero) {
      db.certificati.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}


// **** Unit-Tests Only **** //

/**
 * Delete every certificato record.
 * 
 * @internal
 * Test-only helper. Do not use in production code.
 */
async function deleteAllCertificati(): Promise<void> {
  const db = await orm.openDb();
  db.certificati = [];
  return orm.saveDb(db);
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllCertificati,
} as const;
