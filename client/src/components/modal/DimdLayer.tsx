import styled from 'styled-components';

interface DimdLayerProps {
  onClick?: () => void;
}

export default function DimdLayer({ onClick: closeModal }: DimdLayerProps) {
  return <Dimd onClick={closeModal}></Dimd>;
}

const Dimd = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;
