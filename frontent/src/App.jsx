import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ParticleBackground from './components/Background/ParticleBackground';
import Home from './pages/Home';
import ToolsDashboard from './pages/ToolsDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import MergePDF from './pages/tools/MergePDF';
import SplitPDF from './pages/tools/SplitPDF';
import CompressPDF from './pages/tools/CompressPDF';
import PDFToWord from './pages/tools/PDFToWord';
import WordToPDF from './pages/tools/WordToPDF';
import RotatePDF from './pages/tools/RotatePDF';
import AddPageNumbers from './pages/tools/AddPageNumbers';
import AddWatermark from './pages/tools/AddWatermark';
import JpgToPdf from './pages/tools/JpgToPdf';
import ExcelToPdf from './pages/tools/ExcelToPdf';
import PowerPointToPdf from './pages/tools/PowerPointToPdf';
import ProtectPdf from './pages/tools/ProtectPdf';
import UnlockPdf from './pages/tools/UnlockPdf';
import PdfToJpg from './pages/tools/PdfToJpg';
import PdfToExcel from './pages/tools/PdfToExcel';
import PdfToPowerPoint from './pages/tools/PdfToPowerPoint';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ParticleBackground />
          <Routes>
            {/* Public routes - with sidebar */}
            <Route
              path="/login"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MainLayout>
                  <Register />
                </MainLayout>
              }
            />
            
            {/* Protected routes - with sidebar */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ToolsDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <History />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Tool routes */}
            <Route
              path="/tools/merge-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MergePDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/split-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SplitPDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/compress-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompressPDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/pdf-to-word"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PDFToWord />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/word-to-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WordToPDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/rotate-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RotatePDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/add-page-numbers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddPageNumbers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/add-watermark"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddWatermark />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/jpg-to-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <JpgToPdf />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/excel-to-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExcelToPdf />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/powerpoint-to-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PowerPointToPdf />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/protect-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProtectPdf />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/unlock-pdf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UnlockPdf />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/pdf-to-jpg"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PdfToJpg />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/pdf-to-excel"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PdfToExcel />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/pdf-to-powerpoint"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PdfToPowerPoint />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
