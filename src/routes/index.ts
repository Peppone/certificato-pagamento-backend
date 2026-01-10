import { Router, static as static_ } from 'express';

import PATHS from '@src/common/constants/PATHS';
import UserRoutes from './UserRoutes';
import CertificatoRoutes from './CertificatoRoutes';
import path from 'path';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

//image routes//



const certificatoRouter = Router();
certificatoRouter.post('', CertificatoRoutes.add)
certificatoRouter.post(PATHS.Certificato.Generate, CertificatoRoutes.generate)
certificatoRouter.put('', CertificatoRoutes.modify)
certificatoRouter.get(PATHS.Certificato.GetAll, CertificatoRoutes.getAll)
// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(PATHS.Users.Get, UserRoutes.getAll);
userRouter.post(PATHS.Users.Add, UserRoutes.add);
userRouter.put(PATHS.Users.Update, UserRoutes.update);
userRouter.delete(PATHS.Users.Delete, UserRoutes.delete);

// Add UserRouter
apiRouter.use(PATHS.Users._, userRouter);
apiRouter.use(PATHS.Certificato._, certificatoRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
