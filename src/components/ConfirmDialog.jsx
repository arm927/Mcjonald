import Modal from './Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-msg">{message}</p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
