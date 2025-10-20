import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsGithub,
  BsReddit,
  BsTwitter,
  BsYoutube,
  BsLinkedin,
  BsBack,
} from "react-icons/bs";
const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-purple-500">
      <div className="w-full msx-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                The Unfolded
              </span>
              Passport
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <Footer.Title title="About me" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Story so far
                </Footer.Link>
                {/* <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Vision
                </Footer.Link> */}
              </Footer.LinkGroup>
            </div>
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
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href=""
            by="The Unfolded Passport™"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="https://www.facebook.com/satishsahuv1/" icon={BsFacebook} />
            <Footer.Icon href="https://www.instagram.com/thesatishsahu/" icon={BsInstagram} />
            <Footer.Icon href="https://www.linkedin.com/in/satishsahu/" icon={BsLinkedin} />
            <Footer.Icon href="https://github.com/satishsahu25" icon={BsGithub} />
            <Footer.Icon href="https://www.youtube.com/@theunfoldedpassport" icon={BsYoutube} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
