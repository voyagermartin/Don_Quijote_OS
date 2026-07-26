/**
 * Don Quijote OS - GAS Backend API Entrypoints
 * Handles Web App GET/POST requests for equipment querying and log entry saving.
 */

var DB_NAME = 'DON_QUIJOTE_DB';

/**
 * Main HTTP GET Handler
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getEquipment';

  try {
    if (action === 'getEquipment') {
      var gearList = getEquipmentList();
      return jsonResponse({ status: 'success', data: gearList });
    }
    
    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}


/**
 * Main HTTP POST Handler
 */
function doPost(e) {
  try {
    var contents = e.postData ? JSON.parse(e.postData.contents) : {};
    var type = contents.type; // 'running' or 'citywalk'
    var logData = contents.data;

    if (!type || !logData) {
      return jsonResponse({ status: 'error', message: 'Missing type or data payload' });
    }

    var result;
    if (type === 'running') {
      result = saveRunningLog(logData);
    } else if (type === 'citywalk') {
      result = saveCityWalkLog(logData);
    } else {
      return jsonResponse({ status: 'error', message: 'Invalid log type: ' + type });
    }

    return jsonResponse({ status: 'success', result: result });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Helper to return JSON responses with proper CORS headers
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to open the Spreadsheet
 */
function getSpreadsheet() {
  var files = DriveApp.getFilesByName(DB_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  throw new Error('Spreadsheet ' + DB_NAME + ' not found. Please run initDonQuijoteDB() first.');
}

/**
 * Returns list of active equipment from Equipment_DB sheet
 */
function getEquipmentList() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Equipment_DB');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var idIdx = headers.indexOf('裝備ID');
  var nameIdx = headers.indexOf('名稱');
  var nicknameIdx = headers.indexOf('暱稱');
  var catIdx = headers.indexOf('類別');
  var brandIdx = headers.indexOf('品牌');
  var mileageIdx = headers.indexOf('累積里程KM');
  var statusIdx = headers.indexOf('狀態');

  // Fallbacks if header matching fails
  if (idIdx === -1) idIdx = 0;
  if (nameIdx === -1) nameIdx = 1;
  if (catIdx === -1) catIdx = nicknameIdx !== -1 ? 3 : 2;
  if (brandIdx === -1) brandIdx = nicknameIdx !== -1 ? 4 : 3;
  if (mileageIdx === -1) mileageIdx = nicknameIdx !== -1 ? 5 : 4;
  if (statusIdx === -1) statusIdx = nicknameIdx !== -1 ? 6 : 5;

  var list = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = row[statusIdx];
    if (status === '服役中' || status === 'Active') {
      list.push({
        id: row[idIdx],
        name: row[nameIdx],
        nickname: nicknameIdx !== -1 ? (row[nicknameIdx] || '') : '',
        category: row[catIdx],
        brand: row[brandIdx],
        mileage: Number(row[mileageIdx]) || 0,
        status: status
      });
    }
  }

  return list;
}

/**
 * Saves a Running Log entry and updates gear mileage
 */
function saveRunningLog(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Running_Logs');
  if (!sheet) throw new Error('Running_Logs sheet not found.');

  var gearStr = Array.isArray(data.gear) ? data.gear.join(', ') : (data.gear || '');
  var dist = Number(data.distance) || 0;

  var newRow = [
    data.date || new Date().toISOString().split('T')[0],
    data.subject || '',
    data.workout || '',
    gearStr,
    data.location || '',
    data.weather || '',
    dist,
    data.duration || '',
    data.paceAvg || '',
    data.paceInterval || '',
    data.cadenceAvg || '',
    data.cadenceMax || '',
    data.movementEfficiency || '',
    data.verticalOscillation || '',
    data.groundContactTime || '',
    data.hrAvg || '',
    data.hrMax || '',
    data.z1Pct || '',
    data.z2Pct || '',
    data.z3Pct || '',
    data.z4Pct || '',
    data.z5Pct || '',
    data.vo2max || '',
    data.techFocus || '',
    data.fatigue || 0,
    data.bodyState || '',
    data.notes || ''
  ];

  sheet.appendRow(newRow);

  // Update cumulative mileage for checked equipment
  if (dist > 0 && Array.isArray(data.gear)) {
    updateEquipmentMileage(ss, data.gear, dist);
  }

  return { message: 'Running log saved successfully.', row: sheet.getLastRow() };
}

/**
 * Saves a CityWalk Log entry and updates gear mileage
 */
function saveCityWalkLog(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('CityWalk_Logs');
  if (!sheet) throw new Error('CityWalk_Logs sheet not found.');

  var gearStr = Array.isArray(data.gear) ? data.gear.join(', ') : (data.gear || '');
  var dist = Number(data.distance) || 0;

  var newRow = [
    data.date || new Date().toISOString().split('T')[0],
    data.theme || '',
    data.route || '',
    data.location || '',
    data.weather || '',
    dist,
    data.duration || '',
    data.steps || '',
    gearStr,
    data.heartRate || '',
    data.fatigue || 0,
    data.bodyState || '',
    data.supply || '',
    data.memorable || '',
    data.quote || '',
    data.caminoIndex || 0,
    data.exploreIndex || 0,
    data.revisitIndex || 0,
    data.bgm || ''
  ];

  sheet.appendRow(newRow);

  // Update cumulative mileage for checked equipment
  if (dist > 0 && Array.isArray(data.gear)) {
    updateEquipmentMileage(ss, data.gear, dist);
  }

  return { message: 'CityWalk log saved successfully.', row: sheet.getLastRow() };
}

/**
 * Batch updates cumulative mileage for specified gear items
 */
function updateEquipmentMileage(ss, gearNames, addedKm) {
  var sheet = ss.getSheetByName('Equipment_DB');
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var gearName = data[i][1];
    var gearId = data[i][0];

    // Check if gear name or ID is in the checked list
    if (gearNames.indexOf(gearName) !== -1 || gearNames.indexOf(gearId) !== -1) {
      var currentMileage = Number(data[i][4]) || 0;
      var newMileage = currentMileage + addedKm;
      sheet.getRange(i + 1, 5).setValue(newMileage); // Column 5 is '累積里程KM'
    }
  }
}
