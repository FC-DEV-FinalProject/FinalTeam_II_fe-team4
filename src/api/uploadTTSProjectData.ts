import { TTSDetailDto, TTSSaveDto } from '@/api/aIParkAPI.schemas';
import { saveTTSProject } from '@/api/ttsAPI';
import { TTSItem } from '@/stores/tts.store';

type setProjectData = (data: {
  projectId: number | null;
  projectName: string;
  fullScript?: string;
  globalVoiceStyleId?: number;
  globalSpeed?: number;
  globalPitch?: number;
  globalVolume?: number;
  ttsDetails?: TTSDetailDto[];
}) => void;

export const uploadTTSProjectData = async (
  projectData: TTSSaveDto,
  items: TTSItem[],
  setProjectData: setProjectData
) => {
  try {
    const transformedData = {
      ...projectData,
      ttsDetails: items.map((item, index) => ({
        id: item.enitityId,
        unitScript: item.text,
        unitSpeed: item.speed,
        unitVolume: item.volume,
        unitPitch: item.pitch,
        unitSequence: index + 1,
        unitVoiceStyleId: item.style ? Number(item.style) : null,
        isDeleted: false,
      })),
    };

    const response = await saveTTSProject(transformedData);

    if (response) {
      setProjectData({
        projectId: response.ttsProject.id,
        projectName: response.ttsProject.projectName,
        fullScript: response.ttsProject.fullScript,
        globalSpeed: response.ttsProject.globalSpeed,
        globalPitch: response.ttsProject.globalPitch,
        globalVolume: response.ttsProject.globalVolume,
        globalVoiceStyleId: response.ttsProject.globalVoiceStyleId,
        ttsDetails: response.ttsDetails,
      });
    }

    return response;
  } catch (error) {
    console.error('프로젝트 저장 오류:', error);
    throw error;
  }
};
