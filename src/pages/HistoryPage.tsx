import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import PaginationFooter from '@/components/section/footer/PaginationFooter';
import MainHeader from '@/components/section/header/MainHeader';
import { dummyData } from '@/constants/dummy';
import { usePagination } from '@/hooks/usePagination';
import { useTableSelection } from '@/hooks/useTableSelection';
import PageLayout from '@/layouts/PageLayout';

const HistoryPage = () => {
  const { currentPage, setCurrentPage, getCurrentPageItems, totalPages } = usePagination({
    data: dummyData,
    itemsPerPage: 8,
  });

  const { selectedItems, isAllSelected, handleSelectAll, handleSelectionChange } =
    useTableSelection({
      getCurrentPageItems,
    });

  const handlePlay = (id: string) => {
    console.log(`${id} 재생 시작`);
  };

  const handlePause = (id: string) => {
    console.log(`${id} 재생 중지`);
  };

  const handleDelete = () => {
    console.log('삭제:', selectedItems);
  };

  const handleSearch = (searchTerm: string) => {
    console.log('검색어:', searchTerm);
  };

  const handleFilter = () => {
    console.log('필터 버튼 클릭');
  };

  return (
    <PageLayout
      variant="main"
      header={<MainHeader />}
      footer={
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      }
    >
      <Title
        variant="recent"
        title="히스토리 내역"
        description="저장된 히스토리 기록을 조회하고 파일을 편리하게 다운로드할 수 있어요."
      />
      <MainContents
        type="RECENT"
        items={getCurrentPageItems().map((item) => ({
          id: item.id,
          projectName: item.projectName,
          projectType: item.projectType as 'TTS' | 'VC' | 'Concat',
          fileName: item.fileName,
          script: item.script,
          status: item.status,
          updatedAt: item.updatedAt,
          isSelected: selectedItems.includes(item.id),
          text: item.projectName,
        }))}
        isAllSelected={isAllSelected}
        onSelectAll={(checked = false) => handleSelectAll(checked)}
        onSelectionChange={(id) => handleSelectionChange(id, !selectedItems.includes(id))}
        onDelete={handleDelete}
        onAdd={() => {}}
        onPlay={handlePlay}
        onPause={handlePause}
        itemCount={getCurrentPageItems().length}
        selectedItemsCount={selectedItems.length}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </PageLayout>
  );
};

export default HistoryPage;
