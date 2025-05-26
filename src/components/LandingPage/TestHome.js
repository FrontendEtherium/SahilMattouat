import Heart from "../../assets/img/heart.png";

const TestHome = () => {
  return (
    <>
      <section className="home__test">
        <div className="container">
          <div className="d-flex align-items-center mt-5  justify-content-between">
            <img src={Heart} className="logo-img" alt="" />
            <button className="btn btn-primary btn-lg">Welcome</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestHome;
