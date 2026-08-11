import HealthChart from '../components/HealthChart';
import DigitalTwin from '../components/DigitalTwin';

function Dashboard() {
  return (
    <div>
      <h2>Care Dashboard</h2>
      <div className="grid">
        <HealthChart />
        <DigitalTwin />
      </div>
    </div>
  );
}

export default Dashboard;
