// App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { NotificationProvider } from './context/NotificationContext';

import SIGNIN from './pages/signin';
import SIGNUP from './pages/signup';
import HOME from './pages/home';
import REDIRECT from './pages/redirect';
import WORLD from './pages/world';
import HomePage from './pages/homepage';
import UploadTask from './pages/upload';
import MESSAGES from './pages/messages';
import CHAT from './pages/chat';
import PROFILE from './pages/profile';
import NOTIFICATIONS from './pages/notifications';
import FAVORITES from './pages/favorites';
import JOB_DETAILS from './pages/job-details';
import SEARCH from './pages/search';

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Layout background="white"><HOME /></Layout>} />
        <Route path="/signup" element={<Layout background="white"><SIGNUP /></Layout>} />
        <Route path="/signin" element={<Layout background="white"><SIGNIN /></Layout>} />
        <Route path="/redirect" element={<Layout showHeader={false} showFooter={false}><REDIRECT /></Layout>} />
        <Route path="/world" element={<Layout background="white"><WORLD /></Layout>} />
        <Route path="/homepage" element={<Layout><HomePage /></Layout>} />
        <Route path="/upload" element={<Layout background="white"><UploadTask /></Layout>} />
        <Route path="/profile" element={<Layout background="white"><PROFILE /></Layout>} />
        <Route path="/notifications" element={<Layout background="white"><NOTIFICATIONS /></Layout>} />
        <Route path="/favorites" element={<Layout background="white"><FAVORITES /></Layout>} />
        <Route path="/search" element={<Layout background="white"><SEARCH /></Layout>} />
        <Route path="/job/:jobId" element={<Layout background="white"><JOB_DETAILS /></Layout>} />
        <Route path="/messages/:postId" element={<Layout><MESSAGES /></Layout>} />
        <Route path="/chat/:postId" element={<Layout><CHAT /></Layout>} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
