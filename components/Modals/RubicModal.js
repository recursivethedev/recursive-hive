import Modal from './Modal';
import RubicWidget from '../Widgets/RubicWidget';

export default function RubicModal({ isOpen, chainId, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} paddingX={4} title="Exchange" className="!max-w-[580px]" titleClassname="text-[22px]">
      <RubicWidget/>
    </Modal>
  );
}