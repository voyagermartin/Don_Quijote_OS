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
    } else if (type === 'taipeigrandtrail' || type === 'taipei_grand_trail') {
      result = saveTaipeiGrandTrailLog(logData);
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

  // Update cumulative mileage for checked equipment (or auto-register missing equipment)
  if (Array.isArray(data.gear) && data.gear.length > 0) {
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

  // Update cumulative mileage for checked equipment (or auto-register missing equipment)
  if (Array.isArray(data.gear) && data.gear.length > 0) {
    updateEquipmentMileage(ss, data.gear, dist);
  }

  return { message: 'CityWalk log saved successfully.', row: sheet.getLastRow() };
}

/**
 * Saves a Taipei Grand Trail Log entry and updates gear mileage
 */
function saveTaipeiGrandTrailLog(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('TaipeiGrandTrail_Logs');
  if (!sheet) throw new Error('TaipeiGrandTrail_Logs sheet not found.');

  var gearStr = Array.isArray(data.gear) ? data.gear.join(', ') : (data.gear || '');
  var roadStr = Array.isArray(data.roadConditions) ? data.roadConditions.join(', ') : (data.roadConditions || '');
  var dist = Number(data.distance) || 0;

  var newRow = [
    data.date || new Date().toISOString().split('T')[0],
    data.section || '',
    data.route || '',
    data.startEnd || '',
    data.weather || '',
    roadStr,
    dist,
    data.totalTime || '',
    data.movingTime || '',
    data.restTime || '',
    data.avgSpeed || '',
    data.steps || '',
    data.elevationGain || '',
    data.elevationLoss || '',
    gearStr,
    data.hrAvg || '',
    data.hrMax || '',
    data.fatigue || 0,
    data.difficulty || 0,
    data.bodyState || '',
    data.supply || '',
    data.bestPhoto || '',
    data.favoriteSection || '',
    data.hardestSection || '',
    data.lessonLearned || '',
    data.quote || '',
    data.caminoIndex || 0,
    data.sceneryIndex || 0,
    data.challengeIndex || 0,
    data.revisitIndex || 0,
    data.bgm || '',
    data.review || ''
  ];

  sheet.appendRow(newRow);

  // Update cumulative mileage for checked equipment (or auto-register missing equipment)
  if (Array.isArray(data.gear) && data.gear.length > 0) {
    updateEquipmentMileage(ss, data.gear, dist);
  }

  return { message: 'Taipei Grand Trail log saved successfully.', row: sheet.getLastRow() };
}

/**
 * Batch updates cumulative mileage for specified gear items, or auto-registers missing gear into Equipment_DB.
 */
function updateEquipmentMileage(ss, gearNames, addedKm) {
  var sheet = ss.getSheetByName('Equipment_DB');
  if (!sheet) return;

  if (!Array.isArray(gearNames) || gearNames.length === 0) return;
  var km = Number(addedKm) || 0;

  var data = sheet.getDataRange().getValues();
  var headers = data.length > 0 ? data[0] : ['裝備ID', '名稱', '暱稱', '類別', '品牌', '累積里程KM', '狀態'];

  var idIdx = headers.indexOf('裝備ID');
  var nameIdx = headers.indexOf('名稱');
  var nicknameIdx = headers.indexOf('暱稱');
  var catIdx = headers.indexOf('類別');
  var brandIdx = headers.indexOf('品牌');
  var mileageIdx = headers.indexOf('累積里程KM');
  var statusIdx = headers.indexOf('狀態');

  if (idIdx === -1) idIdx = 0;
  if (nameIdx === -1) nameIdx = 1;
  if (nicknameIdx === -1) nicknameIdx = 2;
  if (catIdx === -1) catIdx = 3;
  if (brandIdx === -1) brandIdx = 4;
  if (mileageIdx === -1) mileageIdx = 5;
  if (statusIdx === -1) statusIdx = 6;

  // Track existing items in sheet
  var trackedGear = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row || row.length === 0) continue;
    trackedGear.push({
      rowIndex: i + 1,
      id: (row[idIdx] || '').toString().trim(),
      name: (row[nameIdx] || '').toString().trim(),
      nickname: (row[nicknameIdx] || '').toString().trim(),
      mileage: Number(row[mileageIdx]) || 0
    });
  }

  gearNames.forEach(function(rawGear) {
    if (!rawGear) return;
    var rawStr = rawGear.toString().replace(/^[🛡️\s]+(\[Garmin\]\s*)?/, '').trim();
    if (!rawStr) return;

    // Parse nickname and name
    var nickname = '';
    var name = rawStr;
    var match = rawStr.match(/^[「『]([^」』]+)[」』]\s*(.+)$/);
    if (match) {
      nickname = match[1].trim();
      name = match[2].trim();
    }

    // Search for match in trackedGear
    var matchedItem = null;
    for (var j = 0; j < trackedGear.length; j++) {
      var item = trackedGear[j];
      var cleanItemName = item.name.toLowerCase();
      var cleanItemNickname = item.nickname.toLowerCase();
      var cleanSearchName = name.toLowerCase();
      var cleanSearchNickname = nickname.toLowerCase();
      var cleanRawStr = rawStr.toLowerCase();

      if (
        (cleanSearchName && cleanItemName && (cleanItemName === cleanSearchName || cleanItemName.indexOf(cleanSearchName) !== -1 || cleanSearchName.indexOf(cleanItemName) !== -1)) ||
        (cleanSearchNickname && cleanItemNickname && cleanItemNickname === cleanSearchNickname) ||
        (cleanItemName && cleanRawStr.indexOf(cleanItemName) !== -1)
      ) {
        matchedItem = item;
        break;
      }
    }

    if (matchedItem) {
      if (km > 0) {
        var newMileage = matchedItem.mileage + km;
        matchedItem.mileage = newMileage;
        sheet.getRange(matchedItem.rowIndex, mileageIdx + 1).setValue(newMileage);
      }
    } else {
      // Auto-register new equipment into Equipment_DB!
      var newCount = trackedGear.length + 1;
      var newId = 'GEAR_' + (newCount < 100 ? ('00' + newCount).slice(-3) : newCount);
      var category = inferGearCategory(name || rawStr);
      var brand = inferGearBrand(name || rawStr);

      var newRow = [];
      newRow[idIdx] = newId;
      newRow[nameIdx] = name;
      newRow[nicknameIdx] = nickname;
      newRow[catIdx] = category;
      newRow[brandIdx] = brand;
      newRow[mileageIdx] = km;
      newRow[statusIdx] = '服役中';

      sheet.appendRow(newRow);

      // Add to trackedGear list for rest of loop
      trackedGear.push({
        rowIndex: sheet.getLastRow(),
        id: newId,
        name: name,
        nickname: nickname,
        mileage: km
      });
    }
  });
}

function inferGearCategory(str) {
  var s = str.toLowerCase();
  if (s.indexOf('shoe') !== -1 || s.indexOf('mizuno') !== -1 || s.indexOf('hoka') !== -1 || 
      s.indexOf('nike') !== -1 || s.indexOf('adidas') !== -1 || s.indexOf('asics') !== -1 || 
      s.indexOf('saucony') !== -1 || s.indexOf('brooks') !== -1 || s.indexOf('altra') !== -1 || 
      s.indexOf('revolt') !== -1 || s.indexOf('speedgoat') !== -1 || s.indexOf('footwear') !== -1) {
    return '跑鞋';
  }
  if (s.indexOf('watch') !== -1 || s.indexOf('garmin') !== -1 || s.indexOf('forerunner') !== -1 || 
      s.indexOf('fenix') !== -1 || s.indexOf('coros') !== -1 || s.indexOf('suunto') !== -1) {
    return '跑錶';
  }
  if (s.indexOf('pack') !== -1 || s.indexOf('vest') !== -1 || s.indexOf('salomon') !== -1 || 
      s.indexOf('osprey') !== -1 || s.indexOf('gregory') !== -1) {
    return '背包';
  }
  return '裝備';
}

function inferGearBrand(str) {
  var s = str.toLowerCase();
  if (s.indexOf('mizuno') !== -1) return 'Mizuno';
  if (s.indexOf('garmin') !== -1) return 'Garmin';
  if (s.indexOf('hoka') !== -1) return 'HOKA';
  if (s.indexOf('nike') !== -1) return 'Nike';
  if (s.indexOf('adidas') !== -1) return 'Adidas';
  if (s.indexOf('asics') !== -1) return 'Asics';
  if (s.indexOf('saucony') !== -1) return 'Saucony';
  if (s.indexOf('brooks') !== -1) return 'Brooks';
  if (s.indexOf('salomon') !== -1) return 'Salomon';
  return 'Generic';
}

