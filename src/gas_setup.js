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

  // 4. Setup TaipeiGrandTrail_Logs Sheet
  setupTaipeiGrandTrailLogsSheet(ss);

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
  
  var headers = ['裝備ID', '名稱', '暱稱', '類別', '品牌', '累積里程KM', '狀態'];
  
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f293d').setFontColor('#d4af37');

  var sampleData = [
    ['EQ-001', 'Salomon Bonatti Waterproof Jacket', '風暴戰甲', 'Body', 'Salomon', 340, '服役中'],
    ['EQ-002', 'Hoka Speedgoat 5', '山羊神行靴', 'Shoes', 'Hoka', 520, '服役中'],
    ['EQ-003', 'Garmin Forerunner 955', '時光羅盤', 'Watch', 'Garmin', 1280, '服役中'],
    ['EQ-004', 'Osprey Talon 33 Backpack', '羅西南特背包', 'Backpack', 'Osprey', 1200, '服役中'],
    ['EQ-005', 'Leki Trail Running Carbon Poles', '疾風突擊槍', 'Trekking Pole', 'Leki', 210, '服役中'],
    ['EQ-006', 'Darn Tough Run Ultra-Light Socks', '不滅戰襪', 'Socks', 'Darn Tough', 300, '服役中'],
    ['EQ-007', 'Buff Reflective Headband', '風暴避雷針', 'Head', 'Buff', 120, '服役中'],
    ['EQ-008', 'iPhone 15 Pro', '萬能預言石', 'Phone', 'Apple', 1500, '服役中'],
    ['EQ-009', 'Nitecore NB10000 Power Bank', '永恆雷電核心', 'Power Bank', 'Nitecore', 600, '服役中'],
    ['EQ-010', 'Hydrapak SoftFlask 500ml x2', '生命之泉水囊', 'Water', 'Hydrapak', 800, '服役中']
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
    '距離KM', '時間', '平均配速', '跑段配速', 
    '平均步頻', '最大步頻', '移動效率%', '垂直振幅cm', '觸地時間ms', 
    '平均心率', '最大心率', 'Z1占比%', 'Z2占比%', 'Z3占比%', 'Z4占比%', 'Z5占比%', 
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

/**
 * Creates TaipeiGrandTrail_Logs sheet with standard 32 columns.
 */
function setupTaipeiGrandTrailLogsSheet(ss) {
  var sheetName = 'TaipeiGrandTrail_Logs';
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  var headers = [
    '日期', '段數', '路線', '起點終點', '氣溫天氣', '路況', 
    '距離KM', '總時間', '移動時間', '停留時間', '平均速度', '步數', 
    '累積爬升M', '累積下降M', '裝備', '平均心率', '最高心率', 
    '體感疲勞', '路線難度', '身體狀況', '補給紀錄', 
    '今日最佳照片', '今日最喜歡的一段', '今日最痛苦的一段', '今天學到的一件事', '今日一句話', 
    'Camino相似度', '景觀指數', '挑戰指數', '再訪指數', '今日BGM', '復盤'
  ];

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f293d').setFontColor('#51cf66');
  sheet.setFrozenRows(1);
}
