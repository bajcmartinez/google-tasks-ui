/* istanbul ignore file */
import { GoogleTasksWebService } from './Web'
import isElectron from 'is-electron';

let GoogleTasksService = GoogleTasksWebService;

if (isElectron()) {
  const { GoogleTasksElectronService } = require('./Electron');
  GoogleTasksService = GoogleTasksElectronService;
}

const r = new GoogleTasksService();
export default r;