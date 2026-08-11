import HealthCard from '../components/HealthCard';

function Profile() {
  return (
    <div>
      <h2>Patient Profile</h2>
      <div className="grid">
        <HealthCard title="Name" value="Ava Nguyen" subtitle="Age 34 • Female" />
        <HealthCard title="Condition" value="Cardiac Rehab" subtitle="Stable and improving" />
        <HealthCard title="Care Team" value="3 specialists" subtitle="Cardiologist, therapist, nurse" />
      </div>
    </div>
  );
}

export default Profile;
