import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Madhya Pradesh Hydrological & Flood Zones Data
const baseZones = [
  {
    id: 'bargi-reservoir',
    name: 'Bargi Reservoir (Jabalpur)',
    basin: 'Narmada Basin',
    waterLevel: 421.85,
    dangerLevel: 422.76,
    inflowCusecs: 145200,
    outflowCusecs: 138000,
    rainfall24hMm: 84.5,
    status: 'ALERT',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'narsinghpur-narmada',
    name: 'Narsinghpur_Narmada',
    basin: 'Narmada Basin',
    waterLevel: 325.40,
    dangerLevel: 327.00,
    inflowCusecs: 162000,
    outflowCusecs: 159500,
    rainfall24hMm: 62.0,
    status: 'WATCH',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'ugli-seoni',
    name: 'Ugli (Seoni)',
    basin: 'Wainganga Basin',
    waterLevel: 548.10,
    dangerLevel: 550.00,
    inflowCusecs: 42500,
    outflowCusecs: 41000,
    rainfall24hMm: 95.2,
    status: 'ALERT',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'man-dam-dhar',
    name: 'Man Dam Project (Dhar)',
    basin: 'Narmada Basin',
    waterLevel: 296.90,
    dangerLevel: 297.65,
    inflowCusecs: 38400,
    outflowCusecs: 36000,
    rainfall24hMm: 71.8,
    status: 'ALERT',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'sheopur-chambal',
    name: 'Sheopur',
    basin: 'Chambal Basin',
    waterLevel: 214.30,
    dangerLevel: 218.00,
    inflowCusecs: 54000,
    outflowCusecs: 52000,
    rainfall24hMm: 34.0,
    status: 'NORMAL',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'gwalior-sindh',
    name: 'Gwalior',
    basin: 'Sindh / Chambal Basin',
    waterLevel: 198.15,
    dangerLevel: 202.50,
    inflowCusecs: 28900,
    outflowCusecs: 27500,
    rainfall24hMm: 22.4,
    status: 'NORMAL',
    lastUpdated: new Date().toISOString()
  }
];

function getZonesData(simulate = false) {
  return baseZones.map((zone) => {
    if (!simulate) {
      return { ...zone, lastUpdated: new Date().toISOString() };
    }
    const delta = Number(((Math.random() - 0.35) * 1.2).toFixed(2));
    const updatedLevel = Number((zone.waterLevel + delta).toFixed(2));
    const ratio = updatedLevel / zone.dangerLevel;
    let status = 'NORMAL';
    if (ratio >= 1.0) status = 'CRITICAL';
    else if (ratio >= 0.992) status = 'ALERT';
    else if (ratio >= 0.985) status = 'WATCH';

    return {
      ...zone,
      waterLevel: updatedLevel,
      inflowCusecs: Math.max(0, Math.round(zone.inflowCusecs + delta * 12000)),
      outflowCusecs: Math.max(0, Math.round(zone.outflowCusecs + delta * 11000)),
      rainfall24hMm: Number(Math.max(0, zone.rainfall24hMm + delta * 8).toFixed(1)),
      status,
      lastUpdated: new Date().toISOString()
    };
  });
}

// REST API Endpoints
app.get('/api/flood-data', (req, res) => {
  const simulate = req.query.simulate === 'true';
  const zones = getZonesData(simulate);
  res.json({
    region: 'Madhya Pradesh (CWC & State Telemetry)',
    simulated: simulate,
    timestamp: new Date().toISOString(),
    zones
  });
});

app.get('/api/stats', (req, res) => {
  const zones = getZonesData(false);
  const criticalCount = zones.filter((z) => z.status === 'CRITICAL' || z.status === 'ALERT').length;
  const avgRainfall = Number(
    (zones.reduce((sum, z) => sum + z.rainfall24hMm, 0) / zones.length).toFixed(1)
  );
  res.json({
    totalZones: zones.length,
    highAlertZones: criticalCount,
    averageRainfall24hMm: avgRainfall,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/zones', (req, res) => {
  res.json(getZonesData(false));
});

app.get('/api/zones/:id', (req, res) => {
  const zone = getZonesData(false).find((z) => z.id === req.params.id);
  if (!zone) {
    return res.status(404).json({ error: 'Zone not found' });
  }
  res.json(zone);
});

// OpenAPI Specification for Swagger UI
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FloodGuard - Madhya Pradesh Hydrological API',
    version: '1.0.0',
    description: 'REST API for Bargi Reservoir, Narmada Basin, and MP Flood Telemetry'
  },
  servers: [{ url: 'http://localhost:5000' }],
  paths: {
    '/api/flood-data': {
      get: {
        summary: 'Get all flood telemetry zones (supports live simulation)',
        parameters: [
          {
            name: 'simulate',
            in: 'query',
            required: false,
            schema: { type: 'boolean', default: false }
          }
        ],
        responses: {
          200: { description: 'Telemetry payload returned successfully' }
        }
      }
    },
    '/api/stats': {
      get: {
        summary: 'Get summary flood statistics for Madhya Pradesh',
        responses: {
          200: { description: 'Summary statistics returned' }
        }
      }
    },
    '/api/zones': {
      get: {
        summary: 'List all monitored reservoirs and river stations',
        responses: {
          200: { description: 'Array of hydrological zones' }
        }
      }
    },
    '/api/zones/{id}': {
      get: {
        summary: 'Get telemetry for a specific zone by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'bargi-reservoir' }
          }
        ],
        responses: {
          200: { description: 'Zone details returned' },
          404: { description: 'Zone not found' }
        }
      }
    }
  }
};

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FloodGuard MP - Swagger API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`;

app.get('/api-docs', (req, res) => {
  res.type('html').send(swaggerHtml);
});

app.get('/docs', (req, res) => {
  res.type('html').send(swaggerHtml);
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}/api/flood-data`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});