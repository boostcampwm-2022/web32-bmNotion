import React, { useState, ReactElement, useEffect } from 'react';
import TypeChangeModalContent from '@/components/modal/TypeChangeModalContent';
import Modal from '@/components/modal/Modal';
import styled from 'styled-components';
import DimdLayer from '@/components/modal/DimdLayer';

interface BlockOptionModalProps {
  handleType: Function;
  deleteBlock: (param: DeleteBlockParam) => string;
  block: BlockInfo;
  selectedBlocks: BlockInfo[];
  handleBlockOptionButtonModal: Function;
}

export default function BlockOptionModalContent({
  handleType,
  deleteBlock,
  block,
  selectedBlocks,
  handleBlockOptionButtonModal,
}: BlockOptionModalProps): ReactElement {
  const [typeChangeModalOpen, setTypeChangeModalOpen] = useState(false);

  const handleChangeTypeModal = () => {
    setTypeChangeModalOpen(!typeChangeModalOpen);
    if (typeChangeModalOpen) {
      handleBlockOptionButtonModal();
    }
  };
  return (
    <OptionModalContainer>
      <OptionContainer onClick={handleChangeTypeModal}>
        <OptionImage image={'/assets/icons/change.png'} />
        <OptionTextContainer>
          <OptionTextTitle>전환</OptionTextTitle>
        </OptionTextContainer>
      </OptionContainer>
      <OptionContainer
        onClick={() => {
          if (selectedBlocks.length !== 0) {
            selectedBlocks.forEach((e) => {
              deleteBlock({ blockId: e.blockId });
            });
          } else {
            deleteBlock({ blockId: block.blockId });
          }
        }}
      >
        <OptionImage image={'/assets/icons/trash.png'} />
        <OptionTextContainer>
          <OptionTextTitle>삭제</OptionTextTitle>
        </OptionTextContainer>
      </OptionContainer>
      {typeChangeModalOpen && (
        <>
          <DimdLayer onClick={handleChangeTypeModal}></DimdLayer>
          <Modal width={'220px'} height={'236px'} position={['0px', '', '', '265px']}>
            <TypeChangeModalContent
              handleType={handleType}
              selectedBlocks={selectedBlocks}
              block={block}
            />
          </Modal>
        </>
      )}
    </OptionModalContainer>
  );
}

const OptionModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  position: relative;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 28px;
  border-radius: 3px;
  align-items: center;

  &:hover {
    background-color: #ebebea;
  }
`;

const OptionImage = styled.div<{ image: string }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin: 0px 4px 0px 10px;
`;

const OptionTextContainer = styled.div`
  display: flex;
  align-items: center;
  height: 16px;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const OptionTextTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgb(55, 53, 47);
`;
