import React from "react";
import { Footer } from "flowbite-react";
import { Link ,useLocation} from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsGithub,
  BsYoutube,
  BsLinkedin,
  BsBack,
} from "react-icons/bs";
const FooterCom = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Footer container className="border bgfooter">
      <div className="w-full msx-w-7xl mx-auto">
        <div className="grid w-full justify-center sm:flex md:grid-cols-1">
          {/* <div className="mt-5"> */}
            {/* <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            > */}
              {/* <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                The Unfolded
              </span>
              Passport */}
              {/* <img src="https://res.cloudinary.com/codercloud/image/upload/v1761455293/the-unfolded-high-resolution-logo-transparent_1_wjcyyp.png" className="footerlogo"/> */}
            {/* </Link> */}
          {/* </div> */}
          <div className="gap-8 mt-4 sm:grid-cols-2 sm:gap-6">
           {pathname!=="/about" && <div>
              <span className="block text-4xl font-extrabold mb-2 windsong-medium">About Me</span>
              <Footer.LinkGroup col>
             
                  <Footer.Link
                    href="/about"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-red-500 no-underline transition-colors duration-200"
                    style={{ textDecoration: 'none' }}
                  >
                    My Journey so far..........
                  </Footer.Link>
              </Footer.LinkGroup>
            </div>}
            {/* <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.youtube.com/@theunfoldedpassport"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </Footer.Link>
                <Footer.Link
                  href="https://www.instagram.com/nithin_s_730_/?next=%2F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Footer.Link>
              </Footer.LinkGroup> */}
            {/* </div> */}
            {/* <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://policies.google.com/privacy?hl=en-US"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href="https://en.wikipedia.org/wiki/Terms_of_service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div> */}
          </div>
        </div>
        {/* <Footer.Divider /> */}
        <div className="w-full 
        mt-10
        sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href=""
            by="The Unfolded Passport™"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="https://www.facebook.com/satishsahuv1/" icon={BsFacebook} className="hover:text-red-500 transition-colors duration-200" />
            <Footer.Icon href="https://www.instagram.com/thesatishsahu/" icon={BsInstagram} className="hover:text-red-500 transition-colors duration-200" />
            <Footer.Icon href="https://www.linkedin.com/in/satishsahu/" icon={BsLinkedin} className="hover:text-red-500 transition-colors duration-200" />
            <Footer.Icon href="https://github.com/satishsahu25" icon={BsGithub} className="hover:text-red-500 transition-colors duration-200" />
            <Footer.Icon href="https://www.youtube.com/@theunfoldedpassport" icon={BsYoutube} className="hover:text-red-500 transition-colors duration-200" />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
