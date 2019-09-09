/* istanbul ignore file */
import { GoogleTasksWebService } from './Web'

let GoogleTasksService = GoogleTasksWebService;

if (typeof process !== 'undefined' && process.versions && process.versions.hasOwnProperty('electron')) {
  console.log('here I am');
  const { GoogleTasksElectronService } = require('./Electron');
  GoogleTasksService = GoogleTasksElectronService;
}

const r = new GoogleTasksService();
export default r;