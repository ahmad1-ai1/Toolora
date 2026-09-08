import React from 'react';
import {
  Minimize2,
  FileArchive,
  FileSpreadsheet,
  FileImage,
  Maximize2,
  QrCode,
  Braces,
  Percent,
  Calendar,
  ImageIcon,
  FileText,
  AlignLeft,
  Code2,
  Calculator,
  Wrench,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 {...props} />;
    case 'FileArchive':
      return <FileArchive {...props} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'FileImage':
      return <FileImage {...props} />;
    case 'Maximize2':
      return <Maximize2 {...props} />;
    case 'QrCode':
      return <QrCode {...props} />;
    case 'Braces':
      return <Braces {...props} />;
    case 'Percent':
      return <Percent {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'ImageIcon':
      return <ImageIcon {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'AlignLeft':
      return <AlignLeft {...props} />;
    case 'Code2':
      return <Code2 {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    default:
      return <Wrench {...props} />;
  }
};
