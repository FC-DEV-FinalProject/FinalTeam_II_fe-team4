import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { convertBatchTexts, ttsLoad } from '@/api/ttsAPI';
import { uploadTTSProjectData } from '@/api/uploadTTSProjectData';
import { TableContents } from '@/components/custom/tables/project/common/TableContents';
import Title from '@/components/section/contents/Title';
import AudioFooter from '@/components/section/footer/AudioFooter';
import TTSOptionsSidebar from '@/components/section/sidebar/TTSSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import PageLayout from '@/layouts/PageLayout';
import { ttsInitialSettings, TTSItem, useTTSStore } from '@/stores/tts.store';
import { useTTSAudioHistoryStore } from '@/stores/TTSAudioHistory.store.ts';

const TTSPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    items,
    projectData,
    setItems,
    setProjectData,
    toggleSelection,
    toggleSelectAll,
    updateItem,
    deleteSelectedItems,
    addItems,
    updateProjectName,
  } = useTTSStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const setHistoryItems = useTTSAudioHistoryStore((state) => state.setHistoryItems);

  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });

  console.log('alert visible', alert.visible);

  const [isLoading, setIsLoading] = useState(false);

  const showAlert = useCallback((message: string, variant: 'default' | 'destructive') => {
    setAlert({ visible: true, message, variant });
    setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 3000);
  }, []);

  // TTS 프로젝트 데이터 로드
  useEffect(() => {
    const loadTTSProject = async () => {
      if (!id) {
        console.warn('ID가 없습니다.');
        showAlert('프로젝트 ID가 없습니다. 저장을 누르면 새프로젝트가 생성됩니다 ', 'destructive');
        return;
      }

      setIsLoading(true); // 로딩 상태 업데이트
      try {
        const response = await ttsLoad(Number(id));
        console.log('API 응답:', response.data);
        const { ttsProject, ttsDetails } = response.data;

        // 상태 업데이트
        if (ttsProject) {
          setProjectData({
            projectId: ttsProject.id,
            projectName: ttsProject.projectName || '새 프로젝트',
          });
          console.log('setProjectData 호출 완료:', ttsProject);
        } else {
          console.warn('ttsProject 데이터가 없습니다.');
        }

        if (Array.isArray(ttsDetails)) {
          const loadedItems: TTSItem[] = ttsDetails.map((detail) => ({
            id: String(detail.id),
            enitityId: detail.id,
            text: detail.unitScript || '',
            isSelected: false,
            volume: detail.unitVolume || ttsInitialSettings.volume,
            speed: detail.unitSpeed || ttsInitialSettings.speed,
            pitch: detail.unitPitch || ttsInitialSettings.pitch,
            style: detail.unitVoiceStyleId || null,
          }));

          setItems(loadedItems);
          setHistoryItems(ttsDetails);

          // 사용자에게 성공 적으로 프로젝트를 로드했음을 알림
          showAlert('프로젝트를 성공적으로 로드했습니다.', 'default');
        } else {
          console.warn('ttsDetails 데이터가 유효하지 않습니다.');
        }
      } catch (error) {
        console.error('TTS 프로젝트 로드 오류:', error);
        showAlert('프로젝트 로드 중 오류가 발생했습니다.', 'destructive');
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    loadTTSProject();
  }, [id, setProjectData, setItems, setHistoryItems, showAlert]);

  const isAllSelected = useMemo(() => items.every((item) => item.isSelected), [items]);

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const newItems = [...items];
      const [removed] = newItems.splice(startIndex, 1);
      newItems.splice(endIndex, 0, removed);
      setItems(newItems);
    },
    [items, setItems]
  );

  const checkIsValidToGenerate = useCallback(() => {
    const validations = [
      { condition: !projectData.projectId, message: '프로젝트 ID가 없습니다.' },
      {
        condition: !projectData.projectName || !items.length,
        message: '프로젝트 데이터가 유효하지 않습니다.',
      },
      { condition: !items.every((item) => item.text), message: '텍스트가 없는 항목이 있습니다.' },
      { condition: !items.every((item) => item.speed), message: '속도가 없는 항목이 있습니다.' },
      { condition: !items.every((item) => item.volume), message: '볼륨이 없는 항목이 있습니다.' },
      { condition: !items.every((item) => item.pitch), message: '피치가 없는 항목이 있습니다.' },
      {
        condition: !items.every((item) => item.style),
        message: '음성 스타일이 없는 항목이 있습니다.',
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        console.warn(message);
        showAlert(message, 'destructive');
        return false;
      }
    }
    return true;
  }, [projectData, items, showAlert]);

  // TTS 오디오 데이터 생성
  const generateTTSAudioData = useCallback(async () => {
    setIsGenerating(true);
    if (!checkIsValidToGenerate()) {
      setIsGenerating(false);
      return;
    }
    if (!projectData.projectId) {
      setIsGenerating(false);
      return;
    }

    try {
      await uploadTTSProjectData(projectData, items, setProjectData);
    } catch (error) {
      console.error('프로젝트 저장 오류:', error);
      showAlert('프로젝트 저장 중 오류가 발생했습니다.', 'destructive');
    }
    const request = {
      ...projectData,
      projectId: projectData.projectId,
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
    // 유효성 검사
    const response = await convertBatchTexts(request);
    setIsGenerating(false);

    setHistoryItems(response.data.ttsDetails);
    showAlert('TTS 오디오 데이터 생성이 완료되었습니다.', 'default');
  }, [projectData, items, setHistoryItems, setProjectData, checkIsValidToGenerate, showAlert]);

  const historyItems = useTTSAudioHistoryStore((state) => state.historyItems);
  const audioTTSHistoryItems = Object.values(historyItems)
    .flat()
    .reverse()
    .slice(0, 7)
    .map((historyItem) => {
      return {
        id: historyItem.audioId,
        audioUrl: historyItem.audioUrl,
      };
    });

  const currentAudioUrl = audioTTSHistoryItems.length > 0 ? audioTTSHistoryItems[0].audioUrl : '';

  const handleSave = useCallback(async () => {
    try {
      await uploadTTSProjectData(projectData, items, setProjectData);
    } catch (error) {
      console.error('프로젝트 저장 오류:', error);
      showAlert('프로젝트 저장 중 오류가 발생했습니다.', 'destructive');
    }
  }, [projectData, items, setProjectData, showAlert]);

  return (
    <PageLayout
      variant="project"
      header={<></>}
      sidebar={<TTSOptionsSidebar />}
      footer={<AudioFooter audioUrl={currentAudioUrl} />}
      children={
        <>
          <Title
            type="TTS"
            projectTitle={projectData.projectName ?? '새 프로젝트'}
            onProjectNameChange={updateProjectName} // 이름 변경 핸들러 추가
            onSave={handleSave} // 저장 핸들러 추가
          />
          {isLoading ? (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div>Loading...</div>
            </div>
          ) : (
            <>
              {alert.visible && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                  <Alert variant={alert.variant}>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                </div>
              )}
              <div className={`h-[580px] mt-6 overflow-hidden`}>
                <TableContents
                  items={items}
                  isAllSelected={isAllSelected}
                  onSelectAll={toggleSelectAll}
                  onSelectionChange={toggleSelection}
                  onTextChange={(id, text) => updateItem(id, { text })}
                  onDelete={deleteSelectedItems}
                  onAdd={addItems}
                  onRegenerateItem={(id) => console.log('재생성 항목:', id)}
                  onDownloadItem={(id) => console.log('다운로드 항목:', id)}
                  onPlay={(id) => console.log('재생:', id)}
                  onReorder={handleReorder}
                  type={'TTS'}
                />
              </div>
              <div className={`TTS mt-12 text-center`}>
                <Button onClick={generateTTSAudioData} disabled={isGenerating}>
                  {isGenerating ? '생성 중...' : 'TTS 생성'}
                </Button>
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default TTSPage;
