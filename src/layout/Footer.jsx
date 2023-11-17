import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex items-center justify-center bg-orange-300 h-[10%]">
      © Powered by{" "}
      <Link to={"/fpt"} className="underline">
        FPT University
      </Link>
      <div className="px-[0.75px] py-2 bg-gray-600 mx-1"></div>
      <Link to={"/library"} className="underline">
        library
      </Link>
    </div>
  );
}

export default Footer;
