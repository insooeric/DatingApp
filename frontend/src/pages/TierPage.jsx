import { Link } from "react-router-dom";
const TierPage = () => {
  return (
    <>
      <div className="tier-page">
        TierPage
        <br />
        <div className="free">
          free member: browse only{" "}
          <Link to="/add-card">
            <button>Register</button>
          </Link>
        </div>
        <div className="paid">
          paid member: create profile, search user, etc
        </div>
      </div>
    </>
  );
};

export default TierPage;
