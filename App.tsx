import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Checklist } from './components/Checklist';
import { AutomationDetails } from './components/AutomationDetails';
import { Diagnose } from './components/Diagnose';
import { Community } from './components/Community';
import { Library } from './components/Library';
import { Editor } from './components/Editor';
import { MyTemplates } from './components/MyTemplates';
import { Settings } from './components/Settings';

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat" element={<ChatAssistant />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/details" element={<AutomationDetails />} />
                <Route path="/diagnose" element={<Diagnose />} />
                <Route path="/community" element={<Community />} />
                <Route path="/library" element={<Library />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/my-templates" element={<MyTemplates />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </HashRouter>
    );
};

export default App;