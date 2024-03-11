// This is the code to copy/paste on the Google sheet side, then run and deploy (web app, give access to anyone), and then copy the URL for POST method
// sheetName must be replaced with the Google sheet tab name 
// The name of each HTML form input must match the name of each header/column in the Google sheet 

const sheetName = ''
const scriptProp = PropertiesService.getScriptProperties()

function intialSetup() {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost(e) {
    const lock = LockService.getScriptLock()
    lock.tryLock(10000)

    try {
        const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
        const sheet = doc.getSheetByName(sheetName)

        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
        const nextRow = sheet.getLastRow() + 1

        const newRow = headers.map(function (header) {
            return header === 'Date' ? new Date() : e.parameter[header]
        })

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    finally {
        lock.releaseLock()
    }
}