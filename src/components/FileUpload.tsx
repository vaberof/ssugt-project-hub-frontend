import React, { useState } from 'react';

interface UploadedFile {
  name: string;
  size: string;
  preview: string;
}

export const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      name: 'project-image-1.jpg',
      size: '2.38 МБ',
      preview: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/3a3f6dcb7b32c0a13e21a3c787b345c3be71b7bd?placeholderIfAbsent=true'
    },
    {
      name: 'project-image-2.jpg',
      size: '1.72 МБ',
      preview: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/61cc950ea38e6782b0350874cc78e0bdc6f2ccb0?placeholderIfAbsent=true'
    },
    {
      name: 'project-image-3.jpg',
      size: '4.22 МБ',
      preview: 'https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/a10c2e31523ba7edd3109c01126c8c0a662f309b?placeholderIfAbsent=true'
    }
  ]);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload">
      <div className="upload-zone">
        <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/472df02b97f9522fe8a502476b9aeea5a7103c46?placeholderIfAbsent=true" alt="Upload" className="upload-icon" />
        <p className="upload-text">Перетащите файлы сюда или</p>
        <button type="button" className="choose-files-button">
          Выберите файлы
        </button>
        <p className="upload-hint">PNG, JPG до 5 МБ</p>
      </div>

      <div className="uploaded-files">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <div className="file-info">
              <img src={file.preview} alt={file.name} className="file-preview" />
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{file.size}</span>
              </div>
            </div>
            <button
              type="button"
              className="remove-file-button"
              onClick={() => handleRemoveFile(index)}
            >
              <img src="https://cdn.builder.io/api/v1/image/assets/11a8d4f539624a85af93ab73e5adf46a/10a7f112fc3cddb7aae11e599f561e577fec3217?placeholderIfAbsent=true" alt="Remove" className="remove-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};