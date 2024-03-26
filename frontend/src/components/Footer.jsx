const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="footer">&copy; {year} RAMpage - Dating App</div>
    </>
  );
};

export default Footer;
