
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const { setdb } = require('../config/mysql'); // Import the setdb query function

// Jenkins configuration is loaded from .env file
const JENKINS_URL = process.env.JENKINS_URL;
const JENKINS_USER = process.env.JENKINS_USER;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;

// Jenkins job name
const SERVER_JOB = 'TESTJOB';

// Helper to trigger a Jenkins job with parameters
const triggerJenkinsJob = async (jobName, params) => {
    if (!JENKINS_URL || !JENKINS_USER || !JENKINS_TOKEN) {
        console.error('Jenkins environment variables not set.');
        return { success: false, message: 'Jenkins configuration is missing in the environment.' };
    }

    const url = `${JENKINS_URL}/job/${jobName}/buildWithParameters`;
    try {
        await axios.post(url, null, {
            params: params,
            auth: {
                username: JENKINS_USER,
                password: JENKINS_TOKEN
            }
        });
        return { success: true, message: `Job '${jobName}' triggered successfully with params: ${JSON.stringify(params)}` };
    } catch (error) {
        console.error(`Error triggering Jenkins job '${jobName}':`, error.response ? error.response.data : error.message);
        return { success: false, message: `Failed to trigger job '${jobName}'.` };
    }
};

// Get the list of controllable servers from the database
router.get('/servers', auth, async (req, res) => {
    try {
        // Fetch the distinct world_idx from the field server settings table.
        const rows = await setdb.query('SELECT DISTINCT world_idx FROM setting_world_field ORDER BY world_idx');
        // The user wants the world_idx to be the identifier.
        const serverIds = rows.map(row => String(row.world_idx));
        res.json(serverIds);
    } catch (error) {
        console.error('Error fetching server list from w_setdb:', error);
        res.status(500).json({ msg: 'Failed to fetch server list.' });
    }
});

// Get server status
router.get('/status', auth, async (req, res) => {
    const { serverId } = req.query; // Get serverId from query param
    // TODO: Implement actual status check logic for the given serverId or all servers
    console.log(`Fetching status for: ${serverId}`);
    res.json({ status: 'Running' }); // Mock status
});

// Start a server
router.post('/start', auth, async (req, res) => {
    const { serverId } = req.body;
    if (!serverId) {
        return res.status(400).json({ msg: 'serverId is required.' });
    }

    const params = { ACTION: 'start', SERVER_ID: serverId };
    const result = await triggerJenkinsJob(SERVER_JOB, params);

    if (result.success) {
        res.status(200).json({ msg: `Server ${serverId} start process initiated.` });
    } else {
        res.status(500).json({ msg: result.message });
    }
});

// Stop a server
router.post('/stop', auth, async (req, res) => {
    const { serverId } = req.body;
    if (!serverId) {
        return res.status(400).json({ msg: 'serverId is required.' });
    }

    const params = { ACTION: 'stop', SERVER_ID: serverId };
    const result = await triggerJenkinsJob(SERVER_JOB, params);

    if (result.success) {
        res.status(200).json({ msg: `Server ${serverId} stop process initiated.` });
    } else {
        res.status(500).json({ msg: result.message });
    }
});

module.exports = router;
