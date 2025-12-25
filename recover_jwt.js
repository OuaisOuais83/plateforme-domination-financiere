const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Stivecomettto83]@db.grwglesellhgwkldnypo.supabase.co:5432/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        // Try to get JWT secret
        try {
            const res = await client.query("SHOW app.settings.jwt_secret;");
            console.log('RESULT_SHOW:', JSON.stringify(res.rows));
        } catch (e) {
            console.error("SHOW failed", e.message);
        }
    } catch (err) {
        console.error('CONNECTION_ERROR:', err);
    } finally {
        await client.end();
    }
}

run();
