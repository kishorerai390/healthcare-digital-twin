function HealthCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <div className="chip">{title}</div>
      <h3>{value}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export default HealthCard;
