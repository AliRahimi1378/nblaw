const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage (replace with a database in production)
let cases = {};

// Get cases for a user
app.get('/api/cases/:phone', (req, res) => {
    const phone = req.params.phone;
    res.json(cases[phone] || []);
});

// Add a new case
app.post('/api/cases/:phone', (req, res) => {
    const phone = req.params.phone;
    const newCase = {
        ...req.body,
        id: Date.now().toString(), // Generate a unique ID
        createdAt: new Date().toISOString()
    };
    
    if (!cases[phone]) {
        cases[phone] = [];
    }
    
    cases[phone].push(newCase);
    res.json({ success: true, case: newCase });
});

// Update a case
app.put('/api/cases/:phone/:caseId', (req, res) => {
    const phone = req.params.phone;
    const caseId = req.params.caseId;
    
    if (!cases[phone]) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const caseIndex = cases[phone].findIndex(c => c.id === caseId);
    if (caseIndex === -1) {
        return res.status(404).json({ error: 'Case not found' });
    }
    
    cases[phone][caseIndex] = {
        ...cases[phone][caseIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, case: cases[phone][caseIndex] });
});

// Delete a case
app.delete('/api/cases/:phone/:caseId', (req, res) => {
    const phone = req.params.phone;
    const caseId = req.params.caseId;
    
    if (!cases[phone]) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const initialLength = cases[phone].length;
    cases[phone] = cases[phone].filter(c => c.id !== caseId);
    
    if (cases[phone].length === initialLength) {
        return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json({ success: true });
});

// Serve static files
app.use(express.static('.'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
