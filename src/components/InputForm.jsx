import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileJson, FolderOpen } from 'lucide-react';
import { parseInput } from '../../src/utils/parsers'

const InputForm = ({ onTreeGenerated }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const inputType = watch('inputType', 'json');

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = parseInput(data.inputType, data.inputType === 'json' ? data.jsonInput : data.folderPath);
      
      if (result.error) {
        alert(`Error: ${result.error}`);
        return;
      }
      
      console.log('Generated Tree:', result.tree);
      
    //   moving the data to the main compoents
      if (onTreeGenerated) {
        onTreeGenerated(result.tree);
      }
      
      alert('Tree generated successfully!(*_*) ');
      
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="input-form">
      <h3>Choose Input Type</h3>
      
      <div className="input-type-selector">
        <label className="radio-label">
          <input
            type="radio"
            value="json"
            {...register('inputType')}
          />
          <FileJson size={18} />
          JSON Input
        </label>
        
        <label className="radio-label">
          <input
            type="radio"
            value="folderPath"
            {...register('inputType')}
          />
          <FolderOpen size={18} />
          Folder Path
        </label>
      </div>

      {inputType === 'json' && (
        <div className="input-field">
          <label>JSON Structure</label>
          <textarea
            {...register('jsonInput', {
              required: 'JSON is required',
              validate: (value) => {
                try {
                  JSON.parse(value);
                  return true;
                } catch {
                  return 'Invalid JSON format';
                }
              }
            })}
            placeholder={`Example:
{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "documents",
      "type": "folder",
      "children": [
        {
          "name": "file1.txt",
          "type": "file"
        }
      ]
    }
  ]
}`}
            rows="8"
          />
          {errors.jsonInput && (
            <span className="error">{errors.jsonInput.message}</span>
          )}
        </div>
      )}

      {inputType === 'folderPath' && (
        <div className="input-field">
          <label>Folder Path</label>
          <input
            type="text"
            {...register('folderPath', {
              required: 'Folder path is required',
              pattern: {
                value: /^([a-zA-Z]:)?([\\/][^\\/]+)+$/,
                message: 'Please enter a valid folder path'
              }
            })}
            placeholder="C:\Users\Username\Documents or /home/username/documents"
          />
          {errors.folderPath && (
            <span className="error">{errors.folderPath.message}</span>
          )}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Generating Tree...' : 'Generate Tree'}
      </button>
    </form>
  );
};

export default InputForm;