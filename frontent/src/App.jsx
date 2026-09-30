import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ParticleBackground from './components/Background/ParticleBackground';
import HomeILovePDF from './pages/HomeILovePDF';
import ToolsDashboard from './pages/ToolsDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileNew from './pages/ProfileNew';
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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            
            {/* Public routes - without sidebar for new home page */}
            <Route
              path="/"
              element={<HomeILovePDF />}
            />
            
            {/* Protected routes - with sidebar */}
            <Route
              path="/dashboard"
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
                    <HomeILovePDF />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools"
              element={
                <MainLayout>
                  <ToolsDashboard />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfileNew />
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
            
            {/* Tool routes - public access */}
            <Route
              path="/tools/merge-pdf"
              element={
                <MainLayout>
                  <MergePDF />
                </MainLayout>
              }
            />
            <Route
              path="/tools/split-pdf"
              element={
                <MainLayout>
                  <SplitPDF />
                </MainLayout>
              }
            />
            <Route
              path="/tools/compress-pdf"
              element={
                <MainLayout>
                  <CompressPDF />
                </MainLayout>
              }
            />
            <Route
              path="/tools/pdf-to-word"
              element={
                <MainLayout>
                  <PDFToWord />
                </MainLayout>
              }
            />
            <Route
              path="/tools/word-to-pdf"
              element={
                <MainLayout>
                  <WordToPDF />
                </MainLayout>
              }
            />
            <Route
              path="/tools/rotate-pdf"
              element={
                <MainLayout>
                  <RotatePDF />
                </MainLayout>
              }
            />
            <Route
              path="/tools/add-page-numbers"
              element={
                <MainLayout>
                  <AddPageNumbers />
                </MainLayout>
              }
            />
            <Route
              path="/tools/add-watermark"
              element={
                <MainLayout>
                  <AddWatermark />
                </MainLayout>
              }
            />
            <Route
              path="/tools/jpg-to-pdf"
              element={
                <MainLayout>
                  <JpgToPdf />
                </MainLayout>
              }
            />
            <Route
              path="/tools/excel-to-pdf"
              element={
                <MainLayout>
                  <ExcelToPdf />
                </MainLayout>
              }
            />
            <Route
              path="/tools/powerpoint-to-pdf"
              element={
                <MainLayout>
                  <PowerPointToPdf />
                </MainLayout>
              }
            />
            <Route
              path="/tools/protect-pdf"
              element={
                <MainLayout>
                  <ProtectPdf />
                </MainLayout>
              }
            />
            <Route
              path="/tools/unlock-pdf"
              element={
                <MainLayout>
                  <UnlockPdf />
                </MainLayout>
              }
            />
            <Route
              path="/tools/pdf-to-jpg"
              element={
                <MainLayout>
                  <PdfToJpg />
                </MainLayout>
              }
            />
            <Route
              path="/tools/pdf-to-excel"
              element={
                <MainLayout>
                  <PdfToExcel />
                </MainLayout>
              }
            />
            <Route
              path="/tools/pdf-to-powerpoint"
              element={
                <MainLayout>
                  <PdfToPowerPoint />
                </MainLayout>
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
