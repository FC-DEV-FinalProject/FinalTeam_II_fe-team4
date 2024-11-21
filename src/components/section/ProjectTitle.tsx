import { useState } from 'react';
import { TbCheck, TbPencil, TbX } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { SaveButton } from '@/components/buttons/IconButton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ProjectTitleProps {
  type: 'TTS' | 'VC' | 'CONCAT';
  projectTitle: string;
  onSave?: () => void;
  onClose?: () => void;
}

const ProjectTitle = ({ type, projectTitle, onSave, onClose }: ProjectTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(projectTitle);

  const handleSubmit = () => {
    setIsEditing(false);
    if (title !== projectTitle && onSave) {
      onSave();
    }
  };

  return (
    <div className="flex flex-col h-full mx-1">
      <div className="flex items-center gap-2 mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/${type.toLowerCase()}`} className="text-gray-900 hover:text-gray-700">
                  {type}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-primary">
                <Link to="#">{title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="text-2xl font-semibold h-9 w-auto min-w-[200px]"
                autoFocus
              />
              <div className="w-8 h-8 flex items-center justify-center">
                <button
                  onClick={handleSubmit}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <TbCheck className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-black">{title}</h1>
              <div className="w-8 h-8 flex items-center justify-center">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <TbPencil className="w-5 h-5 ml-0 text-black" />
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 -mt-1">
          <SaveButton onClick={onSave} />
          <button
            onClick={onClose}
            className="flex items-center justify-center px-2.5 py-2 rounded-md border border-gray-200 text-gray-900 hover:bg-gray-50"
          >
            <TbX className="w-5 h-5" />
            <span className="text-sm font-medium ml-1">닫기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTitle;
