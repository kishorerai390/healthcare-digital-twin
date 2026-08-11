import SimulationCard from '../components/SimulationCard';

function Simulation() {
  return (
    <div>
      <h2>Simulation Studio</h2>
      <div className="grid">
        <SimulationCard />
        <div className="card">
          <h3>Outcome Preview</h3>
          <p>Expected improvement: +12% mobility after 3 weeks.</p>
        </div>
      </div>
    </div>
  );
}

export default Simulation;
