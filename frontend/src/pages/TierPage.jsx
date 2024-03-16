import { Link } from "react-router-dom";
const TierPage = () => {
  return (
    <>
      <div className="tier-page">
        <h2 className="tier-header">TierPage</h2>
        <br />
        <div className="free">
          Free member: browse only <br />
          <Link to="/add-card">
            <button>Register</button>
          </Link>
        </div>
        <div className="paid">
          Paid member: create profile, search user, etc
        </div>
      </div>
    </>
  );
};

export default TierPage;
