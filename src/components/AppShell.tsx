import { Menu, Search } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { BrandMark } from './BrandMark';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="主导航">
            <NavLink to="/learn">学习目录</NavLink>
            <NavLink to="/projects">项目实战</NavLink>
            <NavLink to="/aipm">面试准备</NavLink>
          </nav>
          <div className="header-actions">
            <NavLink className="icon-button" to="/learn" aria-label="搜索学习内容">
              <Search size={18} strokeWidth={2} />
            </NavLink>
            <NavLink className="header-cta" to="/learn">从目录开始</NavLink>
            <NavLink className="icon-button mobile-menu" to="/learn" aria-label="打开学习目录">
              <Menu size={19} />
            </NavLink>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="site-footer__inner">
          <BrandMark />
          <p>从真实任务开始，少一点术语，多一个能用的结果。</p>
          <div className="footer-links">
            <NavLink to="/learn">学习目录</NavLink>
            <NavLink to="/projects">项目实战</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
