import { TOOLS, TOOL_CATEGORIES, getToolById, getToolsByCategory, searchTools } from '../config/tools';

/**
 * Get recently used tools from localStorage
 */
export const getRecentTools = () => {
  try {
    const recent = localStorage.getItem('recentTools');
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Add tool to recent tools
 */
export const addToRecentTools = (toolId) => {
  try {
    const recent = getRecentTools();
    const filtered = recent.filter(id => id !== toolId);
    const updated = [toolId, ...filtered].slice(0, 5); // Keep only 5 recent
    localStorage.setItem('recentTools', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent tools:', error);
  }
};

/**
 * Get tool objects for recent tool IDs
 */
export const getRecentToolObjects = () => {
  const recentIds = getRecentTools();
  return recentIds.map(id => getToolById(id)).filter(Boolean);
};

/**
 * Check if tool is available for current user
 */
export const isToolAvailable = (tool, userPlan = 'free') => {
  if (!tool.isPremium) return true;
  return userPlan === 'premium' || userPlan === 'enterprise';
};

/**
 * Get tools available for user's plan
 */
export const getAvailableTools = (userPlan = 'free') => {
  return TOOLS.filter(tool => isToolAvailable(tool, userPlan));
};

/**
 * Get premium tools
 */
export const getPremiumTools = () => {
  return TOOLS.filter(tool => tool.isPremium);
};

/**
 * Get free tools
 */
export const getFreeTools = () => {
  return TOOLS.filter(tool => !tool.isPremium);
};

/**
 * Get tools by feature
 */
export const getToolsByFeature = (feature) => {
  return TOOLS.filter(tool => tool.features.includes(feature));
};

/**
 * Search tools with advanced filters
 */
export const advancedSearchTools = (query, filters = {}) => {
  let results = TOOLS;

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    results = getToolsByCategory(filters.category);
  }

  // Filter by premium status
  if (filters.premiumOnly) {
    results = results.filter(tool => tool.isPremium);
  } else if (filters.freeOnly) {
    results = results.filter(tool => !tool.isPremium);
  }

  // Filter by feature
  if (filters.feature) {
    results = results.filter(tool => tool.features.includes(filters.feature));
  }

  // Apply search query
  if (query) {
    results = results.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  return results;
};

/**
 * Get tool route by ID
 */
export const getToolRoute = (toolId) => {
  const tool = getToolById(toolId);
  return tool ? tool.route : null;
};

/**
 * Validate tool parameters
 */
export const validateToolParams = (toolId, params) => {
  const tool = getToolById(toolId);
  if (!tool) return { valid: false, errors: ['Tool not found'] };

  const errors = [];

  // Common validations
  if (tool.features.includes('multiple-files') && (!params.files || params.files.length < 2)) {
    errors.push('This tool requires at least 2 files');
  }

  if (tool.features.includes('range-selection') && !params.pageRange) {
    errors.push('Page range is required');
  }

  if (tool.features.includes('password-protection') && !params.password) {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get tool processing time estimate (in seconds)
 */
export const getToolProcessingTime = (toolId, fileSize) => {
  const tool = getToolById(toolId);
  if (!tool) return 0;

  const baseTime = 2; // Base processing time in seconds
  const sizeFactor = fileSize / (1024 * 1024); // Size in MB

  switch (tool.category) {
    case TOOL_CATEGORIES.ORGANIZE:
      return baseTime + (sizeFactor * 0.5);
    case TOOL_CATEGORIES.OPTIMIZE:
      return baseTime + (sizeFactor * 2);
    case TOOL_CATEGORIES.CONVERT_TO_PDF:
      return baseTime + (sizeFactor * 1.5);
    case TOOL_CATEGORIES.CONVERT_FROM_PDF:
      return baseTime + (sizeFactor * 3);
    case TOOL_CATEGORIES.EDIT:
      return baseTime + (sizeFactor * 1);
    case TOOL_CATEGORIES.SECURITY:
      return baseTime + (sizeFactor * 0.5);
    case TOOL_CATEGORIES.INTELLIGENCE:
      return baseTime + (sizeFactor * 5); // AI features take longer
    default:
      return baseTime + sizeFactor;
  }
};

/**
 * Format processing time for display
 */
export const formatProcessingTime = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};