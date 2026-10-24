const colors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

export default function StatusBadge({ status }) {
  return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
}
