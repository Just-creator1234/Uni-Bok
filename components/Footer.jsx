import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-muted py-4 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} Uni-bok. All rights reserved.
    </footer>
  );
};

export default Footer;
