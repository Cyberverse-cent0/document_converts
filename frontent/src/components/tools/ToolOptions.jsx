import React from 'react';

const ToolOptions = ({ 
  options = [], 
  values = {}, 
  onChange, 
  layout = 'vertical',
  compact = false 
}) => {
  const handleChange = (optionId, value) => {
    if (onChange) {
      onChange(optionId, value);
    }
  };

  const renderOption = (option) => {
    const value = values[option.id] !== undefined ? values[option.id] : option.defaultValue;

    switch (option.type) {
      case 'select':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <select
              value={value}
              onChange={(e) => handleChange(option.id, e.target.value)}
              disabled={option.disabled}
              className={`
                w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                dark:bg-gray-700 dark:text-white
                ${compact ? 'px-3 py-1 text-sm' : ''}
              `}
            >
              {option.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <div className={`flex ${option.direction === 'vertical' ? 'flex-col space-y-2' : 'space-x-4'}`}>
              {option.options.map((opt) => (
                <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={option.id}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => handleChange(option.id, e.target.value)}
                    disabled={option.disabled}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className={`text-gray-700 dark:text-gray-300 ${compact ? 'text-sm' : ''}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(option.id, e.target.checked)}
                disabled={option.disabled}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className={`text-gray-700 dark:text-gray-300 ${compact ? 'text-sm' : ''}`}>
                {option.label}
              </span>
            </label>
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ml-6 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(option.id, e.target.value)}
              placeholder={option.placeholder}
              disabled={option.disabled}
              className={`
                w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                dark:bg-gray-700 dark:text-white
                ${compact ? 'px-3 py-1 text-sm' : ''}
              `}
            />
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleChange(option.id, e.target.value ? parseFloat(e.target.value) : '')}
              min={option.min}
              max={option.max}
              step={option.step || 1}
              placeholder={option.placeholder}
              disabled={option.disabled}
              className={`
                w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                dark:bg-gray-700 dark:text-white
                ${compact ? 'px-3 py-1 text-sm' : ''}
              `}
            />
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'range':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}: {value}
              </label>
            )}
            <input
              type="range"
              value={value}
              onChange={(e) => handleChange(option.id, parseFloat(e.target.value))}
              min={option.min}
              max={option.max}
              step={option.step || 1}
              disabled={option.disabled}
              className="w-full"
            />
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'color':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => handleChange(option.id, e.target.value)}
                disabled={option.disabled}
                className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              {option.presets && (
                <div className="flex space-x-2">
                  {option.presets.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleChange(option.id, color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        value === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <input
              type="file"
              accept={option.accept}
              onChange={(e) => handleChange(option.id, e.target.files[0])}
              disabled={option.disabled}
              className={`
                w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                dark:bg-gray-700 dark:text-white
                ${compact ? 'px-3 py-1 text-sm' : ''}
              `}
            />
            {option.description && (
              <p className={`text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                {option.description}
              </p>
            )}
          </div>
        );

      case 'button-group':
        return (
          <div key={option.id} className={compact ? 'mb-2' : 'mb-4'}>
            {option.label && (
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${compact ? 'text-xs' : ''}`}>
                {option.label}
              </label>
            )}
            <div className={`grid ${option.gridCols || 'grid-cols-3'} gap-3`}>
              {option.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleChange(option.id, opt.value)}
                  disabled={option.disabled}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${value === opt.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }
                  `}
                >
                  <div className="text-center">
                    {opt.icon && <div className="text-2xl mb-2">{opt.icon}</div>}
                    <div className={`font-semibold text-gray-900 dark:text-white ${compact ? 'text-sm' : ''}`}>
                      {opt.label}
                    </div>
                    {opt.description && (
                      <div className={`text-gray-500 dark:text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                        {opt.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (layout === 'horizontal') {
    return (
      <div className="flex items-center space-x-6">
        {options.map(renderOption)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {options.map(renderOption)}
    </div>
  );
};

export default ToolOptions;