import { Router } from 'express';
import { postAttendant, getAttendant, putAttendant, delAttendant, getIdAttendant } from '../controller/attendant.controller.js';
const rota = Router();
rota.post('/Attendant', postAttendant);
rota.put('/Attendant/:id', putAttendant);
rota.get('/Attendant', getAttendant);
rota.get('/Attendant/:id', getIdAttendant);
rota.delete('/Attendant/:id', delAttendant);
export default rota;
