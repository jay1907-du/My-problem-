
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Render dynamically assigns the application port
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// FLOODGUARD - MADHYA PRADESH ZONE DATA
// ==========================================

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
    status: 'ALERT'
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
    status: 'WATCH'
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
    status: 'ALERT'
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
    status: 'ALERT'
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
    status: 'NORMAL'
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
    status: 'NORMAL'
  }
];

// ==========================================
// FLOOD DATA GENERATOR
// ==========================================

function getZonesData(simulate = false) {
  return baseZones.map((zone) => {
    if (!simulate) {
      return {
        ...zone,
        lastUpdated: new Date().toISOString()
      };
    }

    const delta = Number(
      ((Math.random() - 0.35) * 1.2).toFixed(2)
    );

    const updatedLevel = Number(
      (zone.waterLevel + delta).toFixed(2)
    );

    const ratio = updatedLevel / zone.dangerLevel;

    let status = 'NORMAL';

    if (ratio >= 1.0) {
      status = 'CRITICAL';
    } else if (ratio >= 0.992) {
      status = 'ALERT';
    } else if (ratio >= 0.985) {
      status = 'WATCH';
    }

    return {
      ...zone,
      waterLevel: updatedLevel,
      inflowCusecs: Math.max(
        0,
        Math.round(zone.inflowCusecs + delta * 12000)
      ),
      outflowCusecs: Math.max(
        0,
        Math.round(zone.outflowCusecs + delta * 11000)
      ),
      rainfall24hMm: Number(
        Math.max(0, zone.rainfall24hMm + delta * 8).toFixed(1)
      ),
      status,
      lastUpdated: new Date().toISOString()
    };
  });
}

// ==========================================
// API ROUTES
// ==========================================

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FloodGuard API is running',
    timestamp: new Date().toISOString()
  });
});

// All flood data
app.get('/api/flood-data', (req, res) => {
  const simulate = req.query.simulate === 'true';
  const zones = getZonesData(simulate);

  res.json({
    success: true,
    region: 'Madhya Pradesh',
    source: 'FloodGuard demonstration dataset',
    simulated: simulate,
    timestamp: new Date().toISOString(),
    zones
  });
});

// Dashboard statistics
app.get('/api/stats', (req, res) => {
  const zones = getZonesData(false);

  const criticalCount = zones.filter(
    (z) => z.status === 'CRITICAL' || z.status === 'ALERT'
  ).length;

  const avgRainfall = Number(
    (
      zones.reduce((sum, z) => sum + z.rainfall24hMm, 0) /
      zones.length
    ).toFixed(1)
  );

  res.json({
    success: true,
    totalZones: zones.length,
    highAlertZones: criticalCount,
    averageRainfall24hMm: avgRainfall,
    timestamp: new Date().toISOString()
  });
});

// All zones
app.get('/api/zones', (req, res) => {
  res.json({
    success: true,
    zones: getZonesData(false)
  });
});

// Single zone
app.get('/api/zones/:id', (req, res) => {
  const zone = getZonesData(false).find(
    (z) => z.id === req.params.id
  );

  if (!zone) {
    return res.status(404).json({
      success: false,
      error: 'Zone not found'
    });
  }

  res.json({
    success: true,
    zone
  });
});

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'FloodGuard - Madhya Pradesh Hydrological API',
    version: '1.0.0',
    description:
      'REST API for Madhya Pradesh flood monitoring demonstration data'
  },

  // Relative URL works on Render and locally
  servers: [
    {
      url: '/'
    }
  ],

  paths: {
    '/api/health': {
      get: {
        summary: 'Check API health',
        responses: {
          200: {
            description: 'API is running'
          }
        }
      }
    },

    '/api/flood-data': {
      get: {
        summary: 'Get flood telemetry data',
        parameters: [
          {
            name: 'simulate',
            in: 'query',
            required: false,
            schema: {
              type: 'boolean',
              default: false
            }
          }
        ],
        responses: {
          200: {
            description: 'Flood data returned successfully'
          }
        }
      }
    },

    '/api/stats': {
      get: {
        summary: 'Get flood dashboard statistics',
        responses: {
          200: {
            description: 'Statistics returned successfully'
          }
        }
      }
    },

    '/api/zones': {
      get: {
        summary: 'Get all monitored zones',
        responses: {
          200: {
            description: 'Zone list returned successfully'
          }
        }
      }
    },

    '/api/zones/{id}': {
      get: {
        summary: 'Get a specific zone',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'bargi-reservoir'
            }
          }
        ],
        responses: {
          200: {
            description: 'Zone details returned'
          },
          404: {
            description: 'Zone not found'
          }
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
  <title>FloodGuard MP - API Documentation</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
  />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui'
      });
    };
  </script>
</body>
</html>`;

app.get(['/api-docs', '/docs'], (req, res) => {
  res.type('html').send(swaggerHtml);
});

// ==========================================
// FRONTEND STATIC FILE SERVING
// ==========================================

// Serve Vite production build
app.use(express.static(distPath));

// Return JSON for unknown API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// React Router / SPA fallback
app.get('*', (req, res) => {
  res.sendFile(
    path.join(distPath, 'index.html'),
    (err) => {
      if (err && !res.headersSent) {
        res.status(500).send(
          'Frontend build not found. Please run npm run build.'
        );
      }
    }
  );
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, HOST, () => {
  console.log('================================');
  console.log('FloodGuard MP Server Started');
  console.log(`Port: ${PORT}`);
  console.log(`Host: ${HOST}`);
  console.log('API: /api/flood-data');
  console.log('Stats: /api/stats');
  console.log('Health: /api/health');
  console.log('Swagger: /api-docs');
  console.log('Frontend: /');
  console.log('================================');
});
