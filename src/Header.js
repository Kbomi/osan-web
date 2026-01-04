import logoBackground from "./logo_back.png";
import logoTextfrom from "./logo_text.png";
import AppInstallButton from "./AppInstallButton";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-wrap">
        <h1 className="logo-img-wrap">
          <img src={logoBackground} className="logo-background" alt="" />
          <img src={logoTextfrom} className="logo-text" alt="H" />
          <span>힐스테이트 오산더퍼스트</span>
        </h1>
        <AppInstallButton />
      </div>
    </header>
  );
}

export default Header;
