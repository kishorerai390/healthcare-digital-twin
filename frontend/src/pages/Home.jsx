import HealthCard from '../components/HealthCard';
import HealthChart from '../components/HealthChart';

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Healthcare Digital Twin</h1>
        <p>Monitor health, simulate care pathways, and personalize treatment with an intelligent twin.</p>
        <button>Explore Insights</button>
      </section>
      <div className="grid">
        <HealthCard title="Risk Score" value="Low" subtitle="Projected risk remains below threshold" />
        <HealthCard title="Recovery" value="91%" subtitle="Progress toward target recovery" />
        <HealthCard title="Medication" value="On Track" subtitle="Next dose in 2 hours" />
      </div>
      <HealthChart />
    </div>
  );
}

export default Home;
