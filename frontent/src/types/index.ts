/**
 * Type definitions for the document converter application
 */

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
  error_code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  storageUsed: number;
  storageLimit: number;
  plan: 'free' | 'premium' | 'enterprise';
}

export interface UserStats {
  totalConversions: number;
  totalFilesProcessed: number;
  storageUsed: number;
  storageLimit: number;
  favoriteTools: string[];
}

// File Types
export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  date: Date;
  tool: string;
  url?: string;
}

export interface RecentFile extends FileInfo {
  status: 'completed' | 'processing' | 'failed';
}

// Job/Conversion Types
export interface Job {
  id: string;
  userId: string;
  tool: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  inputFiles: string[];
  outputFile?: string;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface JobProgress {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep?: string;
  totalSteps?: number;
  estimatedTimeRemaining?: number;
  error?: string;
}

export interface ConversionOptions {
  [key: string]: any;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'conversion' | 'upload' | 'download' | 'signup' | 'login' | 'logout';
  tool?: string;
  files?: number;
  date: Date;
  status: 'completed' | 'processing' | 'failed';
  details?: string;
}

// Storage Types
export interface StorageUsage {
  used: number;
  limit: number;
  percentage: number;
  breakdown: {
    pdfs: number;
    documents: number;
    images: number;
    other: number;
  };
}

// Quota Types
export interface UserQuota {
  plan: 'free' | 'premium' | 'enterprise';
  conversionsUsed: number;
  conversionsLimit: number;
  storageUsed: number;
  storageLimit: number;
  resetDate: Date;
  features: {
    batchProcessing: boolean;
    priorityProcessing: boolean;
    advancedTools: boolean;
    apiAccess: boolean;
  };
}

// Tool Configuration Types
export interface ToolConfig {
  maxFiles: number;
  maxSizePerFile: number;
  allowedTypes: string[];
  options?: ToolOption[];
}

export interface ToolOption {
  name: string;
  type: 'select' | 'radio' | 'checkbox' | 'text' | 'number' | 'range' | 'color';
  label: string;
  description?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  userMessage?: string;
}

export interface ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };
  userMessage?: string;
  code?: string;
}

// Service Types
export interface ConversionService {
  convertFile: (file: File, mode?: string, options?: ConversionOptions) => Promise<ApiResponse>;
  mergePDFs: (files: File[], options?: ConversionOptions) => Promise<ApiResponse>;
  splitPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  compressPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  pdfToWord: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  wordToPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  rotatePDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  addPageNumbers: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  addWatermark: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  pdfToExcel: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  excelToPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  pdfToJPG: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  jpgToPDF: (files: File[], options?: ConversionOptions) => Promise<ApiResponse>;
  pdfToPowerPoint: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  powerPointToPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  protectPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  unlockPDF: (file: File, options?: ConversionOptions) => Promise<ApiResponse>;
  downloadFile: (jobId: string, filename?: string) => void;
  getJobStatus: (jobId: string) => Promise<Job>;
  getJobs: () => Promise<Job[]>;
  cancelJob: (jobId: string) => Promise<ApiResponse>;
  deleteJob: (jobId: string) => Promise<ApiResponse>;
}

export interface DashboardService {
  getUserStats: () => Promise<UserStats>;
  getRecentFiles: (limit?: number) => Promise<RecentFile[]>;
  getStorageUsage: () => Promise<StorageUsage>;
  getActivityTimeline: (limit?: number) => Promise<Activity[]>;
  getUserQuota: () => Promise<UserQuota>;
  updateProfile: (profileData: Partial<User>) => Promise<ApiResponse>;
  getConversionHistory: (params?: any) => Promise<PaginatedResponse<Job>>;
  deleteFile: (fileId: string) => Promise<ApiResponse>;
  getFileDetails: (fileId: string) => Promise<FileInfo>;
  redownloadFile: (fileId: string) => void;
  shareFile: (fileId: string, options?: any) => Promise<ApiResponse>;
  getSharedFiles: () => Promise<FileInfo[]>;
}

export interface ProgressService {
  subscribeToJob: (jobId: string, callbacks: ProgressCallbacks) => () => void;
  getProgress: (jobId: string) => Promise<JobProgress>;
  calculateETR: (progress: number, startTime: number) => number | null;
  formatTime: (seconds: number) => string;
  getStepProgress: (currentStep: number, totalSteps: number) => {
    currentStep: number;
    totalSteps: number;
    stepProgress: number;
    isComplete: boolean;
  };
}

export interface ProgressCallbacks {
  onProgress?: (progress: JobProgress) => void;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

// Component Props Types
export interface ToolPageProps {
  onConversionComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

export interface FileUploadProps {
  onFilesSelect: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number;
}

export interface ProgressBarProps {
  progress: number;
  estimatedTime?: number;
  showPercentage?: boolean;
  showTime?: boolean;
}

// Utility Types
export type FileWithPreview = File & {
  preview?: string;
  id?: string;
};

export type CompressionLevel = 'low' | 'medium' | 'high';
export type RotationDirection = 'left' | 'right';
export type RotationAngle = 90 | 180 | 270;
export type PageOrientation = 'auto' | 'portrait' | 'landscape';
export type PageSize = 'a4' | 'letter' | 'legal';
export type OutputFormat = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'ppt' | 'jpg' | 'png';