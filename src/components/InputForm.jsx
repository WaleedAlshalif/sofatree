import React from 'react';
import { useForm } from 'react-hook-form';
import { FileJson, FolderOpen } from 'lucide-react';

const InputForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const inputType = watch('inputType', 'json');

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="input-form">
      <h3>Choose Input Type</h3>
      
      {/* select the input type */}
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

      {/*  insert file JSON */}
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
            placeholder='{"name": "root", "children": [...]}'
            rows="8"
          />
          {errors.jsonInput && (
            <span className="error">{errors.jsonInput.message}</span>
          )}
        </div>
      )}

      {/* the filed input to map file */}
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

      <button type="submit" className="submit-btn">
        Generate Tree
      </button>
    </form>
  );
};

export default InputForm;