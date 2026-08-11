function HealthChart() {
  return (
    <div className="panel">
      <h3>Vital Trends</h3>
      <p>Heart rate, blood pressure, and oxygen saturation are trending steadily.</p>
      <div className="grid">
        <div className="card">
          <h4>72 bpm</h4>
          <p>Average heart rate</p>
        </div>
        <div className="card">
          <h4>118/76</h4>
          <p>Blood pressure</p>
        </div>
        <div className="card">
          <h4>98%</h4>
          <p>Oxygen saturation</p>
        </div>
      </div>
    </div>
  );
}

export default HealthChart;
