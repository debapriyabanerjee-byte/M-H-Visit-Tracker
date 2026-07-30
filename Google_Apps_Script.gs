/*
 * V1 M&H Visit Tracker backend.
 * Single sheet: Responses.
 * Supports: doGet() dashboard summary, doPost() append visit.
 */

var SHEET_NAME = "Responses";

function doGet(e) {
  return json(success_(getDashboard(), ""));
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json(error_("INVALID_PAYLOAD", "Malformed JSON body."));
  }
  var payload = body.payload || {};
  var invalid = validatePayload(payload);
  if (invalid) return json(invalid);
  return json(appendVisit(payload));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function success_(data, message) {
  return { status: "success", data: data, message: message || "" };
}

function error_(code, message) {
  return { status: "error", errorCode: code, message: message };
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function ensureHeader_(sh) {
  if (sh.getLastRow() > 0) return;
  var headers = [
    "Submission ID","Timestamp","Employee Name","Employee Code","Designation",
    "Reporting Zone","Base Location","Visit Date","Visit Type","Visit City",
    "Latitude","Longitude","GPS Accuracy","Partner Name","Partner Type","Partner GID",
    "Partner Category","Partner Status","Active Issues","Inactive Issues",
    "Activation Possibility","Business Opportunity","Conversion Probability",
    "Meeting Type","Team Member","Health Assessment","Challenges","Insurer Name",
    "Contact Person","Discussion Topics","Outcome","Support Required","Action Plan",
    "Action Owner","Follow-up Required","Follow-up Date","Notes/Comments","Photo URLs"
  ];
  sh.appendRow(headers);
  sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sh.setFrozenRows(1);
}

function sanitize_(value) {
  if (value === null || value === undefined) return "";
  var s = String(value);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function joinMulti_(arr) {
  if (!arr || !arr.length) return "";
  return arr.map(function (x) { return String(x); }).join("|");
}

function generateSubmissionId(visitDateIso) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = visitDateIso ? new Date(visitDateIso) : new Date();
    var stamp = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyyMMdd");
    var props = PropertiesService.getScriptProperties();
    var key = "SEQ_" + stamp;
    var next = parseInt(props.getProperty(key) || "0", 10) + 1;
    props.setProperty(key, String(next));
    var seq = ("0000" + next).slice(-4);
    return "MH-" + stamp + "-" + seq;
  } finally {
    lock.releaseLock();
  }
}

function validatePayload(p) {
  if (!p || !p.common) return error_("INVALID_PAYLOAD", "Missing visit details.");
  var c = p.common;
  if (!p.gps || typeof p.gps.latitude !== "number" || typeof p.gps.longitude !== "number") {
    return error_("GPS_REQUIRED", "GPS coordinates are mandatory.");
  }
  if (!c.employeeCode) return error_("INVALID_PAYLOAD", "Employee is required.");
  if (!c.visitDate) return error_("INVALID_PAYLOAD", "Visit date is required.");
  if (!c.visitCity) return error_("INVALID_PAYLOAD", "Visit city is required.");
  if (!c.visitType) return error_("INVALID_PAYLOAD", "Visit type is required.");
  if (c.visitType === "Partner Meet" && (!p.partner || !p.partner.partnerName)) {
    return error_("INVALID_PAYLOAD", "Partner name is required.");
  }
  if (c.visitType === "Team Connect" && (!p.team || !p.team.meetingType)) {
    return error_("INVALID_PAYLOAD", "Meeting type is required.");
  }
  if (c.visitType === "Insurer Meet" && (!p.insurer || !p.insurer.insurerName)) {
    return error_("INVALID_PAYLOAD", "Insurer name is required.");
  }
  return null;
}

function appendVisit(payload) {
  try {
    var sh = sheet_();
    ensureHeader_(sh);
    var submissionId = generateSubmissionId(payload.common.visitDate);
    var now = new Date();
    var c = payload.common;
    var g = payload.gps;
    var p = payload.partner || {};
    var t = payload.team || {};
    var ins = payload.insurer || {};
    var photoValues = payload.photoUrls || [];

    var row = [
      submissionId,
      now,
      sanitize_(c.employeeName),
      sanitize_(c.employeeCode),
      sanitize_(c.designation),
      sanitize_(c.reportingZone),
      sanitize_(c.baseLocation),
      sanitize_(c.visitDate),
      sanitize_(c.visitType),
      sanitize_(c.visitCity),
      g.latitude,
      g.longitude,
      g.accuracy,
      sanitize_(p.partnerName),
      sanitize_(p.partnerType),
      sanitize_(p.partnerGid),
      sanitize_(p.partnerCategory),
      sanitize_(p.partnerStatus),
      joinMulti_(p.activeIssues || []),
      joinMulti_(p.inactiveIssues || []),
      sanitize_(p.activationPossibility || ""),
      sanitize_(p.businessOpportunity),
      sanitize_(p.conversionProbability),
      sanitize_(t.meetingType),
      sanitize_(t.teamMemberName),
      sanitize_(t.healthAssessment),
      joinMulti_(t.challenges || []),
      sanitize_(ins.insurerName),
      sanitize_(ins.contactPerson),
      joinMulti_(ins.discussionTopics || []),
      sanitize_(ins.outcome),
      joinMulti_(p.supportRequired || t.supportRequired || ins.supportRequired || []),
      sanitize_(t.actionPlan || ins.actionPlan || ""),
      sanitize_(p.actionOwner || t.actionOwner || ins.actionOwner || ""),
      (p.followUpRequired || t.followUpRequired || ins.followUpRequired || false) ? "Yes" : "No",
      sanitize_(p.followUpDate || t.followUpDate || ins.followUpDate || ""),
      sanitize_(p.additionalNotes || t.additionalComments || ins.comments || ""),
      photoValues.map(function (value) { return String(value); }).join("|")
    ];

    sh.appendRow(row);
    return success_({ submissionId: submissionId, timestamp: now.toISOString() }, "Visit recorded.");
  } catch (err) {
    return error_("GOOGLE_SHEET_FAILED", "Could not write to sheet: " + err);
  }
}

function getDashboard() {
  try {
    var sh = sheet_();
    ensureHeader_(sh);
    var last = sh.getLastRow();
    if (last < 2) return {
      todaysVisits: 0,
      thisWeekVisits: 0,
      partnerMeets: 0,
      teamConnects: 0,
      insurerMeets: 0,
      followUpsPending: 0,
      gpsCompliance: 0,
      travelCompliance: 0,
      recentVisits: []
    };
    var values = sh.getRange(2, 1, last - 1, 39).getValues();
    var tz = Session.getScriptTimeZone();
    var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    var summary = {
      todaysVisits: 0,
      thisWeekVisits: 0,
      partnerMeets: 0,
      teamConnects: 0,
      insurerMeets: 0,
      followUpsPending: 0,
      gpsCompliance: 0,
      travelCompliance: 0,
      recentVisits: []
    };
    for (var i = 0; i < values.length; i++) {
      var r = values[i];
      var visitType = r[8];
      var visitDate = String(r[7]).slice(0, 10);
      var ts = r[1] instanceof Date ? r[1] : new Date(r[1]);
      if (visitDate === today) summary.todaysVisits++;
      if (ts >= weekAgo) summary.thisWeekVisits++;
      if (visitType === "Partner Meet") summary.partnerMeets++;
      else if (visitType === "Team Connect") summary.teamConnects++;
      else if (visitType === "Insurer Meet") summary.insurerMeets++;
      if (r[35] === "Yes") summary.followUpsPending++;
      if (r[10] && r[11]) summary.gpsCompliance++;
      summary.recentVisits.push({
        submissionId: r[0],
        visitType: visitType,
        primaryName: r[13] || r[23] || r[25] || "—",
        city: r[9],
        time: Utilities.formatDate(ts, tz, "dd MMM, HH:mm"),
        outcome: r[31] || r[17] || "—",
        _ts: ts.getTime()
      });
    }
    summary.gpsCompliance = values.length ? Math.round((summary.gpsCompliance / values.length) * 100) : 0;
    summary.recentVisits.sort(function (a, b) { return b._ts - a._ts; });
    summary.recentVisits = summary.recentVisits.slice(0, 10).map(function (item) { delete item._ts; return item; });
    return summary;
  } catch (err) {
    return error_("GOOGLE_SHEET_FAILED", "Dashboard read failed: " + err);
  }
}
