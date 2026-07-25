/**
 * Don Quijote OS - GAS Cloud DB Database Initializer
 * Automatically creates Google Sheet 'DON_QUIJOTE_DB' with required tabs & schemas.
 */

function initDonQuijoteDB() {
  var ssName = 'DON_QUIJOTE_DB';
  var ss;
  
  // Search for existing Spreadsheet or create a new one
  var files = DriveApp.getFilesByName(ssName);
  if (files.hasNext()) {
    var file = files.next();
    ss = SpreadsheetApp.open(file);
    Logger.log(' Found existing Spreadsheet: ' + ss.getUrl());
  } else {
    ss = SpreadsheetApp.create(ssName);
    Logger.log('✨ Created new Spreadsheet: ' + ss.getUrl());
  }

  // 1. Setup Equipment_DB Sheet
  setupEquipmentSheet(ss);

  // 2. Setup Running_Logs Sheet
  setupRunningLogsSheet(ss);

  // 3. Setup CityWalk_Logs Sheet
  setupCityWalkLogsSheet(ss);

  // Remove default "Sheet1" if custom tabs exist
  var defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('工作表1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('====================================================');
  Logger.log('🎉 DON_QUIJOTE_DB Setup Completed Successfully!');
  Logger.log('📊 Spreadsheet ID: ' + ss.getId());
  Logger.log('🔗 Spreadsheet URL: ' + ss.getUrl());
  Logger.log('💡 Web App Deployment Tip: Deploy script as Web App with access "Anyone"');
  Logger.log('====================================================');
}

/**
 * Creates Equipment_DB sheet and inserts initial equipment dataset.
 */
function setupEquipmentSheet(ss) {
  var sheetName = 'Equipment_DB';
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  var headers = ['裝備ID', '名稱', '類別', '品牌', '累積里程KM', '狀態'];
  
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f293d').setFontColor('#d4af37');

  var sampleData = [
    ['EQ-001', 'Salomon Bonatti Waterproof Jacket', 'Body', 'Salomon', 340, '服役中'],
    ['EQ-002', 'Hoka Speedgoat 5', 'Shoes', 'Hoka', 520, '服役中'],
    ['EQ-003', 'Garmin Forerunner 955', 'Watch', 'Garmin', 1280, '服役中'],
    ['EQ-004', 'Osprey Talon 33 Backpack', 'Backpack', 'Osprey', 1200, '服役中'],
    ['EQ-005', 'Leki Trail Running Carbon Poles', 'Trekking Pole', 'Leki', 210, '服役中'],
    ['EQ-006', 'Darn Tough Run Ultra-Light Socks', 'Socks', 'Darn Tough', 300, '服役中'],
    ['EQ-007', 'Buff Reflective Headband', 'Head', 'Buff', 120, '服役中'],
    ['EQ-008', 'iPhone 15 Pro', 'Phone', 'Apple', 1500, '服役中'],
    ['EQ-009', 'Nitecore NB10000 Power Bank', 'Power Bank', 'Nitecore', 600, '服役中'],
    ['EQ-010', 'Hydrapak SoftFlask 500ml x2', 'Water', 'Hydrapak', 800, '服役中']
  ];

  sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  sheet.setFrozenRows(1);
}

/**
 * Creates Running_Logs sheet with standard columns.
 */
function setupRunningLogsSheet(ss) {
  var sheetName = 'Running_Logs';
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  var headers = [
    '日期', '科目', '課表', '裝備', '地點', '天氣', 
    '距離KM', '時間', '配速', '步頻', '心率Z1~Z5', 
    'VO2Max', '技術專注點', '體感疲勞', '身體狀況', '感想'
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f293d').setFontColor('#ff9d00');
  sheet.setFrozenRows(1);
}

/**
 * Creates CityWalk_Logs sheet with standard columns.
 */
function setupCityWalkLogsSheet(ss) {
  var sheetName = 'CityWalk_Logs';
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  var headers = [
    '日期', '主題', '路線', '地點', '天氣', '距離KM', 
    '時間', '步數', '裝備', '心率', '體感疲勞', '身體狀況', 
    '補給', '印象深刻的事', '今日一句話', 'Camino指數', '探索指數', '再訪指數', 'BGM'
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f293d').setFontColor('#3bc9db');
  sheet.setFrozenRows(1);
}
