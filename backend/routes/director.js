const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to format dates
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// 1. Dashboard KPI
router.get('/dashboard/kpi', async (req, res) => {
  console.log("Received request for /dashboard/kpi");
  try {
    // Get latest KPI summary
    console.log("Querying kpi_summary...");
    const [kpiRows] = await db.query('SELECT * FROM kpi_summary ORDER BY summary_date DESC LIMIT 1');
    console.log("kpiRows:", kpiRows);
    const kpi = kpiRows[0] || {
      active_sites: 0, active_officers: 0, completion_rate: 0, missed_patrols: 0, open_incidents: 0, closed_incidents: 0
    };

    // Get site performance
    const [siteRows] = await db.query(`
      SELECT sp.*, s.site_name 
      FROM site_performance sp
      JOIN sites s ON sp.site_id = s.site_id
      ORDER BY sp.performance_date DESC, sp.completion_rate DESC
    `);
    
    const topSites = siteRows.slice(0, 5).map(s => ({
      id: s.site_id.toString(),
      name: s.site_name,
      completion: parseFloat(s.completion_rate),
      incidents: s.incident_count,
      score: parseFloat(s.safety_score)
    }));

    const bottomSites = [...siteRows].sort((a, b) => a.completion_rate - b.completion_rate).slice(0, 5).map(s => ({
      id: s.site_id.toString(),
      name: s.site_name,
      completion: parseFloat(s.completion_rate),
      critical: s.incident_count, // mapping incident_count to critical for now
      action: s.completion_rate < 80 ? 'Review Security Roster' : 'Checklist Compliance Warning'
    }));

    res.json({
      activeSites: kpi.total_sites,
      activeOfficers: kpi.active_officers,
      completionRate: parseFloat(kpi.completion_rate),
      missedPatrols: kpi.missed_patrols,
      openIncidents: kpi.open_incidents,
      closedIncidents: kpi.closed_incidents,
      topSites,
      bottomSites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Map Live Officers
router.get('/map/live-officers', async (req, res) => {
  try {
    // Get latest GPS log per officer
    const [rows] = await db.query(`
      SELECT o.officer_id, u.name, r.role_name as role, o.status, o.latitude, o.longitude, o.recorded_at, s.site_name
      FROM officer_gps_logs o
      JOIN users u ON o.officer_id = u.user_id
      LEFT JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN sites s ON o.site_id = s.site_id
      INNER JOIN (
        SELECT officer_id, MAX(recorded_at) as max_time FROM officer_gps_logs GROUP BY officer_id
      ) latest ON o.officer_id = latest.officer_id AND o.recorded_at = latest.max_time
    `);

    const officers = rows.map(r => ({
      id: r.officer_id.toString(),
      name: r.name,
      role: r.role || 'Field Officer',
      status: r.status === 'sos' ? 'active' : r.status,
      sosActive: r.status === 'sos',
      site: r.site_name || 'Unknown',
      latitude: r.latitude,
      longitude: r.longitude,
      lastUpdate: r.recorded_at
    }));

    res.json(officers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. SOS Console
router.get('/sos/all', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sos.*, u.name as officer_name, s.site_name
      FROM sos_tickets sos
      JOIN users u ON sos.officer_id = u.user_id
      LEFT JOIN sites s ON sos.site_id = s.site_id
      ORDER BY sos.triggered_at DESC
    `);

    const tickets = rows.map(r => {
      let mappedStatus = 'open';
      if (r.status === 'Acknowledged') mappedStatus = 'acknowledged';
      if (r.status === 'Under Investigation') mappedStatus = 'investigating';
      if (r.status === 'Resolved' || r.status === 'Closed') mappedStatus = 'resolved';

      return {
        id: r.ticket_number,
        officer: r.officer_name,
        site: r.site_name || 'Unknown',
        time: new Date(r.triggered_at).toLocaleString(),
        status: mappedStatus,
        location: `Lat: ${r.latitude}, Lng: ${r.longitude}`,
        timeSince: r.triggered_at,
        responseTime: r.acknowledged_at ? 'Acknowledged' : null
      };
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. Alerts Logs
router.get('/alerts/exceptions', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, u.name as officer_name, s.site_name
      FROM exception_logs e
      JOIN users u ON e.officer_id = u.user_id
      LEFT JOIN sites s ON e.site_id = s.site_id
      ORDER BY e.triggered_at DESC
    `);

    const alerts = rows.map(r => {
      let mappedType = 'Unknown';
      if (r.alert_type === 'missed_patrol') mappedType = 'Missed Patrol';
      if (r.alert_type === 'late_login') mappedType = 'Late Shift Start';
      if (r.alert_type === 'incomplete_checklist') mappedType = 'Incomplete Checklist';
      if (r.alert_type === 'gps_tamper') mappedType = 'GPS Tamper';
      if (r.alert_type === 'low_battery') mappedType = 'Low Battery';
      if (r.alert_type === 'mock_location') mappedType = 'Mock Location';

      let mappedStatus = 'warning';
      if (r.severity === 'critical' || r.severity === 'high') mappedStatus = 'critical';
      if (r.severity === 'low') mappedStatus = 'info';

      return {
        id: r.log_id.toString(),
        time: new Date(r.triggered_at).toLocaleString(),
        type: mappedType,
        officer: r.officer_name,
        site: r.site_name || 'Unknown',
        details: r.details,
        status: mappedStatus,
        read: !!r.is_read
      };
    });
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Daily Reports
router.get('/reports/daily-patrol', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.name as officer_name, s.site_name
      FROM patrol_reports p
      JOIN users u ON p.officer_id = u.user_id
      LEFT JOIN sites s ON p.site_id = s.site_id
      ORDER BY p.shift_date DESC
    `);

    const reports = rows.map(r => ({
      id: r.report_id.toString(),
      date: formatDate(r.shift_date),
      officer: r.officer_name,
      site: r.site_name || 'Unknown',
      completion: parseFloat(r.completion_percentage),
      incidents: r.incident_count,
      observations: r.observation_count
    }));
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. Officer Performance
router.get('/reports/officer-performance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.name as officer_name, s.site_name
      FROM officer_performance_summary o
      JOIN users u ON o.officer_id = u.user_id
      LEFT JOIN sites s ON o.site_id = s.site_id
      ORDER BY o.period_date DESC
    `);

    const performance = rows.map(r => ({
      id: r.summary_id.toString(),
      name: r.officer_name,
      site: r.site_name || 'Unknown',
      punctuality: parseFloat(r.punctuality_score),
      completion: parseFloat(r.completion_rate),
      avgTime: r.avg_time_per_checkpoint + 'm',
      incidents: r.incident_count,
      observations: r.observation_count,
      missed: r.missed_patrol_count
    }));
    res.json(performance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 7. Historical Trends
router.get('/analytics/trends', async (req, res) => {
  try {
    res.json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 8. Escalations
router.get('/escalations', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*
      FROM escalation_logs e
      WHERE e.escalated_to_role = 'Director'
      ORDER BY e.escalated_at DESC
    `);

    const escalations = rows.map(r => ({
      id: r.escalation_id.toString(),
      incident: r.incident_type,
      escalatedAt: new Date(r.escalated_at).toLocaleString(),
      timeSince: r.escalated_at,
      reason: r.reason,
      status: r.is_acknowledged ? 'Acknowledged' : '⚠️ Unacknowledged',
      read: !!r.is_acknowledged
    }));
    res.json(escalations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
